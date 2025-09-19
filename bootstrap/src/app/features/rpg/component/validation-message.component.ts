import { Component, Input } from '@angular/core';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
    templateUrl: 'validation-message.component.html',
    imports: [],
    selector: 'validation-message'
})
export class ValidationMessageComponent {
  @Input() control!: AbstractControl;

  private readonly _loggingService: LoggingService;

  constructor(private loggingFactory: LoggingFactory) {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('ValidationMessageComponent initialized');
  }

  getControlName(c: AbstractControl): string | null {
      const formGroup = c.parent?.controls;
      if (!formGroup) {
          return null;
      }
      if (typeof formGroup === 'object' && !Array.isArray(formGroup)) {
          return Object.keys(formGroup).find((name: string) => c === (formGroup as { [key: string]: AbstractControl })[name]) || null;
      }
      return null;
  }
}
