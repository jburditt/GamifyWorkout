import { Component } from '@angular/core';
import { WeekContainerComponent } from "@app/features/rpg/component/week-container/week-container.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CdkDropListGroup } from "@angular/cdk/drag-drop";

@Component({
  imports: [WeekContainerComponent, CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.css'
})
export class WeekPageComponent {
  activity = ['Rest', 'Any', 'Cardio', 'Core', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs'];
  monday: Array<string> = [];
  tuesday: Array<string> = [];

  drop(event: CdkDragDrop<string[]>) {
    console.log("event", event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
