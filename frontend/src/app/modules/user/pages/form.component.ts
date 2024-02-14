import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePickerComponent } from '@app/shared/components/datepicker/date-picker.component';

@Component({
  standalone: true,
  templateUrl: 'form.component.html',
  imports: [
    FormsModule, ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePickerComponent
  ]
})
export class FormPageComponent {
  searchForm = new FormGroup({
    date: new FormControl('', []),
  });
}
