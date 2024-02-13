import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: '[datePickerFormControl] date-picker',
  templateUrl: './date-picker.component.html',
  imports: [
    FormsModule, ReactiveFormsModule, 
    NgIf,
    MatDatepickerModule, MatInputModule
  ],
})
export class DatePickerComponent  {
    @Input() title!: string;
    @Input() datePickerFormControl!: FormControl;
}