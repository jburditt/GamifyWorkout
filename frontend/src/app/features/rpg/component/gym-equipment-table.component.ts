import { Component, inject, Input, output } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '@app/api/models';

@Component({
    templateUrl: 'gym-equipment-table.component.html',
    imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatTableModule],
    selector: 'gym-equipment-table'
})
export class GymEquipmentTableComponent {
  private readonly _loggingService: LoggingService;
  @Input() canAddRow: boolean = false;
  @Input() dataSource = new MatTableDataSource<Equipment>();
  displayedColumns: string[] = ['icon', 'equipment', 'edit'];

  addGymEquipment = output<boolean>();

  constructor(private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('GymEquipmentTableComponent initialized');
  }

  openDialog() {
    this.addGymEquipment.emit(true);
  }
}
