import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: '[addressForm] address',
  templateUrl: 'address.component.html',
  imports: [FormsModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule],
  styleUrls: ['address.component.scss']
})
export class AddressComponent  {
  @Input() addressForm!: FormGroup;
}
