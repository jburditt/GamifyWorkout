import { Component, inject, input } from '@angular/core';
import { LoggingFactory, LoggingService, TextboxComponent } from '@fullswing-angular-library';
import { Equipment, Gym } from '@app/api/models';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentService, GymEquipmentService, GymService } from '@app/api/services';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddGymEquipmentDialog } from '@app/modules/inventory/dialogs/add-gym-equipment';
import { GymEquipmentTableComponent } from './gym-equipment-table.component';

@Component({
    templateUrl: 'manage-gym.component.html',
    imports: [
      ReactiveFormsModule, TextboxComponent, MatDialogModule, MatButtonModule, MatInputModule,
      MatIconModule, MatGridListModule, GymEquipmentTableComponent
    ],
    selector: 'manage-gym'
})
export class ManageGymComponent {
  private readonly _loggingService: LoggingService;
  gym = input.required<Gym>();
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });
  equipment: Equipment[] = [];

  readonly dialog = inject(MatDialog);

  constructor(private loggingFactory: LoggingFactory, private equipmentService: EquipmentService, private gymEquipmentService: GymEquipmentService)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('ManageGymComponent initialized');
    this.form.get('name')!.setValue(this.gym().name);
    console.log("id", this.gym());
    this.equipmentService.apiEquipmentIdGet({ id: this.gym().id! }).subscribe((equipment) => {
      this.equipment = equipment;
    });
  }

  openDialog(equipmentIds: string[]) {
    const dialogRef = this.dialog.open(AddGymEquipmentDialog, { data: { equipmentIds: equipmentIds } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.gymEquipmentService.apiGymEquipmentGymIdPost({ gymId: this.gym().id as string, body: result }).subscribe((response) => {
          // TODO reload equipment table by passing icon, name, id from source and updating this.equipment instead of using API
          // TODO optimize by updating table with returned results from dialog instead of reloading from database
          this.equipmentService.apiEquipmentIdGet({ id: this.gym().id! }).subscribe((equipment) => {
            this.equipment = equipment;
          });
        });
      }
    });
  }

  deleteGymEquipment(equipmentId: string): void {
    this.equipment = this.equipment.filter(e => e.id != equipmentId);
    this.gymEquipmentService.apiGymEquipmentGymIdEquipmentIdDelete({ gymId: this.gym().id as string, equipmentId: equipmentId }).subscribe((response) => {

    });
  }
}
