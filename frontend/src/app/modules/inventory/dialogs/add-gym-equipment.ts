import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Equipment } from '@app/api/models';
import { EquipmentService, GymEquipmentService } from '@app/api/services';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'add-gym-equipment',
  templateUrl: 'add-gym-equipment.html',
  imports: [MatButtonModule, MatDialogModule, GymEquipmentTableComponent],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGymEquipmentDialog implements OnInit {
  equipment!: Equipment[];
  equipmentIds!: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { gymId: string }, private equipmentService: EquipmentService, private gymEquipmentService: GymEquipmentService) { }

  ngOnInit(): void {
    this.loadEquipment();
  }

  addGymEquipment(): void {
    console.log("formArray", this.equipmentIds);
    this.gymEquipmentService.apiGymEquipmentGymIdPost({ gymId: this.data.gymId, body: this.equipmentIds }).subscribe((response) => {
      // TODO reload equipment table by passing icon, name, id from source and updating this.equipment instead of using API
      this.loadEquipment();
    });
  }

  changeGymEquipment(equipmentIds: string[]): void {
    this.equipmentIds = equipmentIds;
  }

  loadEquipment() {
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {
      this.equipment = equipment;
    });
  }
}
