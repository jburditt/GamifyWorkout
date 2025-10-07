import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-week-container',
  imports: [MatIconModule, MatTooltip],
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css'
})
export class WeekContainerComponent {
  help = input.required<string>();

  constructor() { }

  protected displayDate(i: number): string {
    var today = new Date();
    if (today.getDay() == i)
      return today.toDateString();
    else
      return "";
  }
}
