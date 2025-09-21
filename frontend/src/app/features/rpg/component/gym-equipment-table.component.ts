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

  addGymEquipment = output<boolean>();
  changeGymEquipment = output<FormArray>();
  formGroup!: FormGroup;

  constructor(private loggingFactory: LoggingFactory, private formBuilder: FormBuilder)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('GymEquipmentTableComponent initialized');
    this.formGroup = this.formBuilder.group({ equipment: this.formBuilder.array([]) });
  }

  onChange(event: any) {
    const equipment = <FormArray>this.formGroup.get('equipment') as FormArray;
    if (event.checked) {
      equipment.push(new FormControl(event.source.value))
    } else {
      const i = equipment.controls.findIndex(x => x.value === event.source.value);
      equipment.removeAt(i);
    }
    this.changeGymEquipment.emit(this.formGroup.value);
  }

  openDialog() {
    this.addGymEquipment.emit(true);
  }
}
