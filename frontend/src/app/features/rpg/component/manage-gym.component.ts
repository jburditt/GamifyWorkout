import { Component, Input } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { Gym } from '@app/api/models';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from './validation-message.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TextboxComponent } from '@app/shared/components/form/textbox/textbox.component';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentService } from '@app/api/services';

@Component({
    templateUrl: 'manage-gym.component.html',
    imports: [ReactiveFormsModule, TextboxComponent, MatButtonModule, MatInputModule, ValidationMessageComponent, MatPaginatorModule, MatIconModule, MatGridListModule, MatInputModule, MatTableModule],
    selector: 'manage-gym'
})
export class ManageGymComponent {
  private readonly _loggingService: LoggingService;
  @Input() gym!: Gym;
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['icon', 'equipment', 'edit'];

  constructor(private loggingFactory: LoggingFactory, private equipmentService: EquipmentService)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('ManageGymComponent initialized');
    this.form.get('name')!.setValue(this.gym.name);
    this.equipmentService.apiEquipmentGet().subscribe((equipment) => {
      this.dataSource.data = equipment;
    });
  }
}
