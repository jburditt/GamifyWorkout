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
  // addressForm = new FormGroup({
  //   addressLine1: new FormControl('', [Validators.required]),
  //   addressLine2: new FormControl(''),
  //   city: new FormControl('', [Validators.required]),
  //   province: new FormControl('', [Validators.required]),
  //   postalCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])
  // });
}
