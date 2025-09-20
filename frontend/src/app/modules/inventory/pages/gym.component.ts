import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePickerComponent } from '@app/shared/components/datepicker/date-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '@app/features/rpg/component/validation-message.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    templateUrl: 'gym.component.html',
    imports: [
      FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, DatePickerComponent,
      MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, ValidationMessageComponent
    ],
    styleUrls: ['gym.component.scss'],
})
export class GymPageComponent {
  searchForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    // TODO try replacing with Service
    addressForm: new FormGroup({
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][0-9][a-zA-Z] ?[0-9][a-zA-Z][0-9]$')])
      //postalCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])
    })
  });

  constructor() { }

  onSubmit() {
    this.searchForm.get('addressForm')?.markAllAsTouched();
    console.log("isValid", this.searchForm.valid);
    console.log("searchForm", this.searchForm.value);
  }
}
