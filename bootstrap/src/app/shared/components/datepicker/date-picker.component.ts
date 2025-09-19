// TODO currently this component will leave a <date-picker> tag in the DOM which will break the Material CSS
// to fix, replace <date-picker> with ng-template or similar

import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: '[datePickerFormControl] date-picker',
    templateUrl: './date-picker.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        MatDatepickerModule, MatInputModule
    ]
})
export class DatePickerComponent  {
    @Input() title: string = "Date";
    @Input() datePickerFormControl!: FormControl;
}
