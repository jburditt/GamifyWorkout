import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '@app/shared/components/form/validation/validation-message.component';

@Component({
    selector: '[label] [controlName] [parentForm] textbox',
    templateUrl: './textbox.component.html',
    imports: [FormsModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, ValidationMessageComponent]
})
export class TextboxComponent  {
    @Input() label!: string;
    @Input() controlName!: string;
    @Input() parentForm!: FormGroup;
}
