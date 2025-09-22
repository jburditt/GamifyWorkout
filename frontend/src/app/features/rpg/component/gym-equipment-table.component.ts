import { Component, inject, Input, output } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '@app/api/models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GymEquipmentService } from '@app/api/services';

@Component({
    templateUrl: 'gym-equipment-table.component.html',
    imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule],
    selector: 'gym-equipment-table'
})
export class GymEquipmentTableComponent {
  private readonly _loggingService: LoggingService;

  @Input() canAddRow: boolean = false;
  @Input() canSelect: boolean = false;

  @Input() dataSource = new MatTableDataSource<Equipment>();
  displayedColumns: string[] = ['icon', 'equipment', 'edit'];

  @Input() gymId!: string;

  addGymEquipment = output<string[]>();
  changeGymEquipment = output<string[]>();
  equipmentIds: string[] = [];

  constructor(private gymEquipmentService: GymEquipmentService, private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('GymEquipmentTableComponent initialized');
  }

  onChange(event: any) {
    if (event.checked) {
      this.equipmentIds.push(event.source.value);
    } else {
      this.equipmentIds = this.equipmentIds.filter(e => e != event.source.value);
    }
    this.changeGymEquipment.emit(this.equipmentIds);
  }

  // this should be emitted to parent for deletion
  onDelete(equipmentId: string) {
    this.gymEquipmentService.apiGymEquipmentGymIdEquipmentIdDelete({ gymId: this.gymId, equipmentId: equipmentId }).subscribe((response) => {
      console.log("response", this.dataSource.data);
      let equipmentIdsRemaining = new Array<Equipment>;
      if (this.dataSource.data) {
        equipmentIdsRemaining = this.dataSource.data.filter(e => e.id != equipmentId);
      } else {
        equipmentIdsRemaining = (this.dataSource as unknown as Array<Equipment>).filter(e => e.id != equipmentId);
      }
      this.dataSource = new MatTableDataSource(equipmentIdsRemaining);
    });
  }

  openDialog() {
    let data = this.dataSource.data || (this.dataSource as unknown as Array<Equipment>);
    let equipmentIds = data ? data.map(e => e.id as string) : [];
    this.addGymEquipment.emit(equipmentIds);
  }
}
