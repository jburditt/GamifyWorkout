import { Component, inject, Input } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddGymEquipmentDialog } from '@app/modules/inventory/dialogs/add-gym-equipment';
import { MatButtonModule } from '@angular/material/button';

@Component({
    templateUrl: 'gym-equipment-table.component.html',
    imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatTableModule],
    selector: 'gym-equipment-table'
})
export class GymEquipmentTableComponent {
  private readonly _loggingService: LoggingService;
  @Input() canAddRow: boolean = false;
  @Input() dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['icon', 'equipment', 'edit'];

  constructor(private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('GymEquipmentTableComponent initialized');
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(AddGymEquipmentDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
