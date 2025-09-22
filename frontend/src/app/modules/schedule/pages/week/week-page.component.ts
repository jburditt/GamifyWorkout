import { Component, Input, forwardRef, inject } from '@angular/core';
import { WeekContainerComponent } from "@app/features/rpg/component/week-container/week-container.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkDropListGroup } from "@angular/cdk/drag-drop";
import { MatButtonModule } from '@angular/material/button';
import { AddWeeklyScheduleDialog } from '../../dialogs/add-weekly-schedule';
import { MatDialog } from '@angular/material/dialog';

@Component({
  imports: [WeekContainerComponent, MatButtonModule, CdkDropList, CdkDrag, CdkDropListGroup, forwardRef(() => WeekdayDropContainer)],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.css'
})
export class WeekPageComponent {
  activity = ['Rest', 'Any', 'Cardio', 'Core', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs'];
  monday: Array<string> = [];
  tuesday: Array<string> = [];
  wednesday: Array<string> = [];
  thursday: Array<string> = [];
  friday: Array<string> = [];
  saturday: Array<string> = [];
  sunday: Array<string> = [];

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(AddWeeklyScheduleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // TODO optimize by updating table with returned results from dialog instead of reloading from database
      // this.equipmentService.apiEquipmentIdGet({ id: this.gym.id! }).subscribe((equipment) => {
      //   this.equipment = equipment;
      // });
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
