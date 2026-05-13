import { Component, input, forwardRef, inject, OnInit } from '@angular/core';
import { WeekContainerComponent } from "@app/features/rpg/component/week-container/week-container.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkDropListGroup } from "@angular/cdk/drag-drop";
import { MatButtonModule } from '@angular/material/button';
import { AddWeeklyScheduleDialog } from '../../dialogs/add-weekly-schedule';
import { MatDialog } from '@angular/material/dialog';
import { MuscleGroup, Schedule, WeeklySchedule } from '@app/api/models';
import { ScheduleService } from '@app/api/services';
import { catchError, EMPTY } from 'rxjs';

type DialogAction = 'Save Template' | 'Save';

@Component({
  imports: [WeekContainerComponent, MatButtonModule, CdkDropList, CdkDrag, CdkDropListGroup, forwardRef(() => WeekdayDropContainer)],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.css'
})
export class WeekPageComponent implements OnInit {
  activity: Array<MuscleGroup> = [MuscleGroup.Any, MuscleGroup.Cardio, MuscleGroup.Core, MuscleGroup.Chest, MuscleGroup.Back, MuscleGroup.Shoulders, MuscleGroup.Arms, MuscleGroup.Legs];
  monday: Array<MuscleGroup> = [];
  tuesday: Array<MuscleGroup> = [];
  wednesday: Array<MuscleGroup> = [];
  thursday: Array<MuscleGroup> = [];
  friday: Array<MuscleGroup> = [];
  saturday: Array<MuscleGroup> = [];
  sunday: Array<MuscleGroup> = [];

  readonly dialog = inject(MatDialog);

  constructor(private scheduleService: ScheduleService) { }

  private getMondayDate(): Date {
    const today = new Date();
    // getDay() returns 0=Sun..6=Sat; treat Sunday as 7 so Monday is always offset 0
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    return monday;
  }

  ngOnInit(): void {
    const monday = this.getMondayDate();
    this.scheduleService.apiScheduleMondayGet({ monday: monday.toLocaleDateString('en-CA') })
      .pipe(catchError(() => EMPTY))
      .subscribe((response) => {
        const schedule = response as unknown as WeeklySchedule;
        this.monday = schedule.monday?.muscleGroupFilter ?? [];
        this.tuesday = schedule.tuesday?.muscleGroupFilter ?? [];
        this.wednesday = schedule.wednesday?.muscleGroupFilter ?? [];
        this.thursday = schedule.thursday?.muscleGroupFilter ?? [];
        this.friday = schedule.friday?.muscleGroupFilter ?? [];
        this.saturday = schedule.saturday?.muscleGroupFilter ?? [];
        this.sunday = schedule.sunday?.muscleGroupFilter ?? [];
      });
  }

  protected clear(): void {
    this.monday = [];
    this.tuesday = [];
    this.wednesday = [];
    this.thursday = [];
    this.friday = [];
    this.saturday = [];
    this.sunday = [];
  }

  protected openDialog(action: DialogAction) {
    const dialogRef = this.dialog.open(AddWeeklyScheduleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog name: ${result.name}`);
      console.log(`Dialog isDefault: ${result.default}`);
      if (result && action == 'Save') {
        const monday = this.getMondayDate();
        let tuesday = new Date(monday); tuesday.setDate(monday.getDate() + 1);
        let wednesday = new Date(monday); wednesday.setDate(monday.getDate() + 2);
        let thursday = new Date(monday); thursday.setDate(monday.getDate() + 3);
        let friday = new Date(monday); friday.setDate(monday.getDate() + 4);
        let saturday = new Date(monday); saturday.setDate(monday.getDate() + 5);
        let sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);

        const weeklySchedule: WeeklySchedule = {
          monday: {
            // TODO use pipe?
            date: monday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.monday
          },
          tuesday: {
            date: tuesday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.tuesday
          },
          wednesday: {
            date: wednesday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.wednesday
          },
          thursday: {
            date: thursday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.thursday
          },
          friday: {
            date: friday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.friday
          },
          saturday: {
            date: saturday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.saturday
          },
          sunday: {
            date: sunday.toLocaleDateString('en-CA'),
            muscleGroupFilter: this.sunday
          },
        }
        console.log("weeklySchedule", weeklySchedule);
        this.scheduleService.apiSchedulePost({ body: weeklySchedule }).subscribe((isSuccess) => {
          console.log("success", isSuccess);
        });
      }
    });
  }
}

@Component({
  selector: 'app-weekday-drop-container',
  template: `
    <div class="weekdayColumn" cdkDropList [id]="id()" [cdkDropListData]="data()" (cdkDropListDropped)="drop($event)">
      @for (item of data(); track item) {
        <div class="activity activity-{{ item.toLowerCase() }}" cdkDrag>{{ item }}</div>
      }
    </div>
  `,
  styleUrls: ['week-page.component.css'],
  imports: [CdkDropList, CdkDrag],
})
export class WeekdayDropContainer {
  data = input<Array<string>>([]);
  id = input.required<string>();

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id != "activityList")
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      else
        copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
