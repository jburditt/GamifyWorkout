import { Component, computed, input, output } from '@angular/core';
import { LoggingFactory, LoggingService } from '@fullswing-angular-library';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '@app/api/models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GymEquipmentService } from '@app/api/services';

@Component({
    templateUrl: 'gym-equipment-table.component.html',
    imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule],
    selector: 'gym-equipment-table'
})
export class GymEquipmentTableComponent
{
  private readonly _loggingService: LoggingService;

  canAddRow = input<boolean>(false);
  canSelect = input<boolean>(false);
  dataSourceComputed = computed(() => new MatTableDataSource<Equipment>(this.equipment()));
  equipment = input<Equipment[]>([]);

  addGymEquipment = output<string[]>();
  changeGymEquipment = output<string[]>();
  deleteGymEquipment = output<string>();

  displayedColumns: string[] = ['icon', 'equipment', 'edit'];

  equipmentIds: string[] = [];

  constructor(private loggingFactory: LoggingFactory)
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

  openDialogEmitter() {
    let data = this.dataSourceComputed().data;// || (this.dataSource() as unknown as Array<Equipment>);
    let equipmentIds = data ? data.map(e => e.id as string) : [];
    this.addGymEquipment.emit(equipmentIds);
  }
}
