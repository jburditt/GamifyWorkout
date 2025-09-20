import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '@app/features/rpg/component/validation-message.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Gym } from '@app/api/models';
import { GymService } from '@app/api/services';

@Component({
    templateUrl: 'gym.component.html',
    imports: [
      MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, ValidationMessageComponent
    ],
    styleUrls: ['gym.component.scss'],
})
export class GymPageComponent implements OnInit {
  gyms: Gym[] = [];

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
