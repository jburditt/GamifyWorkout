import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '@app/features/rpg/component/validation-message.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Gym } from '@app/api/models';
import { GymService } from '@app/api/services';
import { ManageGymComponent } from '@app/features/rpg/component/manage-gym.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from "@app/shared/components/form/textbox/textbox.component";

@Component({
    templateUrl: 'gym.component.html',
    imports: [ReactiveFormsModule, ManageGymComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, ValidationMessageComponent, TextboxComponent],
    styleUrls: ['gym.component.scss'],
})
export class GymPageComponent implements OnInit {
  gyms: Gym[] = [];
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });

  constructor(private gymService: GymService) { }

  ngOnInit(): void {
    this.gymService.apiGymGet().subscribe({
      next: (gyms) => {
        this.gyms = gyms;
      },
      error: (error) => {
        console.error('Error fetching gyms:', error);
      }
    });
  }
}
