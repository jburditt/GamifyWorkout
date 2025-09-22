import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TextboxComponent } from '@app/shared/components/form/textbox/textbox.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  templateUrl: 'add-weekly-schedule.html',
  imports: [MatButtonModule, MatDialogModule, MatInputModule, TextboxComponent, MatSlideToggleModule]
})
export class AddWeeklyScheduleDialog {
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });

  constructor() { }
}
