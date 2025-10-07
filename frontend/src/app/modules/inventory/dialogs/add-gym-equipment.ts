import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Equipment } from '@app/api/models';
import { EquipmentService, GymEquipmentService } from '@app/api/services';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';

@Component({
  templateUrl: 'add-gym-equipment.html',
  imports: [MatButtonModule, MatDialogModule, GymEquipmentTableComponent],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGymEquipmentDialog implements OnInit {
  equipment!: Equipment[];
  equipmentIds!: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { equipmentIds: string }, private equipmentService: EquipmentService, private gymEquipmentService: GymEquipmentService) { }

  public ngOnInit(): void {
    // TODO cache this or only load it the first time
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {
      if (this.data.equipmentIds.length > 0)
        this.equipment = equipment.filter(e => this.data.equipmentIds.indexOf(e.id as string) == -1);
      else
        this.equipment = equipment;
    });
  }

  protected changeGymEquipment(equipmentIds: string[]): void {
    this.equipmentIds = equipmentIds;
  }
}
