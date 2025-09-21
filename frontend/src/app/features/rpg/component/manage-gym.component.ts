import { Component, Input } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { Gym } from '@app/api/models';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from './validation-message.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: 'manage-gym.component.html',
    imports: [MatInputModule, ValidationMessageComponent],
    selector: 'manage-gym'
})
export class ManageGymComponent {
  private readonly _loggingService: LoggingService;
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    })
  });
  @Input() gym!: Gym;

  constructor(private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('ManageGymComponent initialized');
  }
}
