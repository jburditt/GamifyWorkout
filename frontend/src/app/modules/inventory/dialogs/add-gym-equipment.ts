import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Equipment } from '@app/api/models';
import { EquipmentService } from '@app/api/services';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'add-gym-equipment',
  templateUrl: 'add-gym-equipment.html',
  imports: [MatButtonModule, MatDialogModule, GymEquipmentTableComponent],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGymEquipmentDialog implements OnInit {
  equipment!: Equipment[];

  constructor(private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {
      this.equipment = equipment;
    });
  }
}
