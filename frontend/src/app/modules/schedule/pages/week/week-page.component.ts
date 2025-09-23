import { Component, Input, forwardRef, inject } from '@angular/core';
import { WeekContainerComponent } from "@app/features/rpg/component/week-container/week-container.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkDropListGroup } from "@angular/cdk/drag-drop";
import { MatButtonModule } from '@angular/material/button';
import { AddWeeklyScheduleDialog } from '../../dialogs/add-weekly-schedule';
import { MatDialog } from '@angular/material/dialog';
import { MuscleGroup, Schedule, WeeklySchedule } from '@app/api/models';

type DialogAction = 'Save Template' | 'Save';

@Component({
  imports: [WeekContainerComponent, MatButtonModule, CdkDropList, CdkDrag, CdkDropListGroup, forwardRef(() => WeekdayDropContainer)],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.css'
})
export class WeekPageComponent {
  activity: Array<MuscleGroup> = [MuscleGroup.Any, MuscleGroup.Cardio, MuscleGroup.Core, MuscleGroup.Chest, MuscleGroup.Back, MuscleGroup.Shoulders, MuscleGroup.Arms, MuscleGroup.Legs];
  monday: Array<MuscleGroup> = [];
  tuesday: Array<MuscleGroup> = [];
  wednesday: Array<MuscleGroup> = [];
  thursday: Array<MuscleGroup> = [];
  friday: Array<MuscleGroup> = [];
  saturday: Array<MuscleGroup> = [];
  sunday: Array<MuscleGroup> = [];

  readonly dialog = inject(MatDialog);


  openDialog(action: DialogAction) {
    const dialogRef = this.dialog.open(AddWeeklyScheduleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(`Dialog result: ${result.name}`);
      console.log(`Dialog result: ${result.default}`);
      // TODO optimize by updating table with returned results from dialog instead of reloading from database
      // this.equipmentService.apiEquipmentIdGet({ id: this.gym.id! }).subscribe((equipment) => {
      //   this.equipment = equipment;
      // });
      if (result && action == 'Save') {
        let today = new Date();
        let dayOfWeek = today.getDay();
        let monday = new Date();
        monday.setDate(today.getDate() + dayOfWeek - 1);
        let tuesday = new Date();
        tuesday.setDate(today.getDate() + dayOfWeek);
        let wednesday = new Date();
        wednesday.setDate(today.getDate() + dayOfWeek + 1);
        let thursday = new Date();
        thursday.setDate(today.getDate() + dayOfWeek + 2);
        let friday = new Date();
        friday.setDate(today.getDate() + dayOfWeek + 3);
        let saturday = new Date();
        saturday.setDate(today.getDate() + dayOfWeek + 4);
        let sunday = new Date();
        sunday.setDate(today.getDate() + dayOfWeek + 5);

        const weeklySchedule: WeeklySchedule = {
          monday: {
            date: monday.toLocaleDateString(),
            muscleGroupFilter: this.monday
          },
          tuesday: {
            date: tuesday.toLocaleDateString(),
            muscleGroupFilter: this.tuesday
          },
          wednesday: {
            date: wednesday.toLocaleDateString(),
            muscleGroupFilter: this.wednesday
          },
          thursday: {
            date: thursday.toLocaleDateString(),
            muscleGroupFilter: this.thursday
          },
          friday: {
            date: friday.toLocaleDateString(),
            muscleGroupFilter: this.friday
          },
          saturday: {
            date: saturday.toLocaleDateString(),
            muscleGroupFilter: this.saturday
          },
          sunday: {
            date: sunday.toLocaleDateString(),
            muscleGroupFilter: this.sunday
          },
        }
        console.log("weeklySchedule", weeklySchedule);
      }
    });
  }
}

@Component({
  selector: 'app-weekday-drop-container',
  template: `
    <div class="weekdayColumn" cdkDropList [id]="id" [cdkDropListData]="data" (cdkDropListDropped)="drop($event)">
      @for (item of data; track item) {
        <div class="activity activity-{{ item.toLowerCase() }}" cdkDrag>{{ item }}</div>
      }
    </div>
  `,
  styleUrls: ['week-page.component.css'],
  imports: [CdkDropList, CdkDrag],
})
export class WeekdayDropContainer {
  @Input() data: Array<string> = [];
  @Input() id!: string;

  drop(event: CdkDragDrop<string[]>) {
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
