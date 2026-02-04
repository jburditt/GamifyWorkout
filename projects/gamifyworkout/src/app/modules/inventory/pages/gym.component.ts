import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextboxComponent } from 'fullswing-angular-library';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { Gym } from '@app/api/models';
import { GymService } from '@app/api/services';
import { ManageGymComponent } from '@app/features/rpg/component/manage-gym.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    templateUrl: 'gym.component.html',
    imports: [ReactiveFormsModule, ManageGymComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, TextboxComponent],
    styleUrls: ['gym.component.scss'],
})
export class GymPageComponent implements OnInit {

  gyms: Gym[] = [];

  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(private gymService: GymService, private change: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.gymService.apiGymGet().subscribe({
      next: (gyms) => {
        this.gyms = gyms;
        window.setTimeout(()=>{
          this.tabGroup.selectedIndex = 0;
          this.change.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error fetching gyms:', error);
      }
    });
  }

  protected insert() {
    if (this.form.valid) {
      // TODO get userId from userService
      const newGym: Gym = { name: this.form.value.name };
      this.gymService.apiGymPost({ body: newGym }).subscribe({
        next: (gym) => {
          this.gyms.push(newGym);
          this.form.reset();
        },
        error: (error) => {
          console.error('Error adding gym:', error);
        }
      });
    }
  }
}
