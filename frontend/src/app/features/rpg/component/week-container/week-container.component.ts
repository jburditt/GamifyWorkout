import { Component } from '@angular/core';

@Component({
  selector: 'app-week-container',
  imports: [],
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css'
})
export class WeekContainerComponent {
  constructor() { }

  displayDate(i: number): string {
    var today = new Date();
    if (today.getDay() == i)
      return today.toDateString();
    else
      return "";
  }
}
