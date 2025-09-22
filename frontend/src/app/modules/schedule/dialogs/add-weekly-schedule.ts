import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EquipmentService, GymEquipmentService } from '@app/api/services';
import { TextboxComponent } from '@app/shared/components/form/textbox/textbox.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  templateUrl: 'add-weekly-schedule.html',
  imports: [MatButtonModule, MatDialogModule, MatInputModule, TextboxComponent, MatSlideToggleModule],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWeeklyScheduleDialog implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { gymId: string, equipmentIds: string }, private equipmentService: EquipmentService, private gymEquipmentService: GymEquipmentService) { }

  ngOnInit(): void {
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {

    });
  }

  add(): void {

  }
}
