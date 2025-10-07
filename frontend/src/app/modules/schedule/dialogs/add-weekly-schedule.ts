import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TextboxComponent } from '@fullswing-angular-library';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  templateUrl: 'add-weekly-schedule.html',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, TextboxComponent, MatSlideToggleModule]
})
export class AddWeeklyScheduleDialog {
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    }),
    default: new FormControl()
  });

  protected dialogClose(): { name: string, default: boolean } {
    return { name: this.form.get('name')?.value, default: this.form.get('default')?.value || false };
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }
}
