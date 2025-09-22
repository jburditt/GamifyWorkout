import { Component } from '@angular/core';
import { WeekContainerComponent } from "@app/features/rpg/component/week-container/week-container.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  imports: [WeekContainerComponent, CdkDropList, CdkDrag],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.css'
})
export class WeekPageComponent {
  activity = ['Rest', 'Any', 'Cardio', 'Core', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs']
  
}
