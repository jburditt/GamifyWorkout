import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-week-container',
  imports: [MatIconModule, MatTooltip, DatePipe],
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css'
})
export class WeekContainerComponent {
  help = input.required<string>();

  constructor() { }

  protected getTodayOrNull(i: number): Date | null {
    var today = new Date();
    if (today.getDay() == i)
      return today;
    else
      return null;
  }
}
