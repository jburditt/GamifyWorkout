import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePickerComponent } from '@app/shared/components/datepicker/date-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    templateUrl: 'form.component.html',
    imports: [
      FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, DatePickerComponent,
      MatButtonModule, MatFormFieldModule, MatInputModule
    ],
    styleUrls: ['form.component.scss'],
})
export class FormPageComponent {
  searchForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor() { }

  onSubmit() {
    if (!this.searchForm.valid) {
      return;
    }
  }
}
