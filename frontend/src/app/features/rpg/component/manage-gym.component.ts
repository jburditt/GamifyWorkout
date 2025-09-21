import { Component, inject, Input } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { Equipment, Gym } from '@app/api/models';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { TextboxComponent } from '@app/shared/components/form/textbox/textbox.component';
import { MatButtonModule } from '@angular/material/button';
import { GymService } from '@app/api/services';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddGymEquipmentDialog } from '@app/modules/inventory/dialogs/add-gym-equipment';
import { GymEquipmentTableComponent } from './gym-equipment-table.component';

@Component({
    templateUrl: 'manage-gym.component.html',
    imports: [
      ReactiveFormsModule, TextboxComponent, MatDialogModule, MatButtonModule, MatInputModule,
      MatIconModule, MatGridListModule, MatInputModule, GymEquipmentTableComponent
    ],
    selector: 'manage-gym'
})
export class ManageGymComponent {
  private readonly _loggingService: LoggingService;
  @Input() gym!: Gym;
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });
  equipment!: Equipment[];

  readonly dialog = inject(MatDialog);

  constructor(private loggingFactory: LoggingFactory, private gymService: GymService)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('ManageGymComponent initialized');
    this.form.get('name')!.setValue(this.gym.name);
    console.log("id", this.gym.id);
    this.gymService.apiGymIdEquipmentGet({ id: this.gym.id! }).subscribe((equipment) => {
      this.equipment = equipment;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddGymEquipmentDialog, { data: { gymId: this.gym.id } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
