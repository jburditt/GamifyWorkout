import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Equipment } from '@app/api/models';
import { EquipmentService } from '@app/api/services';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'add-gym-equipment',
  templateUrl: 'add-gym-equipment.html',
  imports: [MatButtonModule, MatDialogModule, GymEquipmentTableComponent],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGymEquipmentDialog implements OnInit {
  equipment!: Equipment[];
  equipmentFormArray!: FormArray;

  constructor(private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {
      this.equipment = equipment;
    });
  }

  addGymEquipment(): void {
    console.log("value", this.equipmentFormArray);
  }

  changeGymEquipment(formArray: FormArray): void {
    this.equipmentFormArray = formArray;
  }
}
