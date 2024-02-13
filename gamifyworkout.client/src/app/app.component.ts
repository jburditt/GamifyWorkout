import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterOutlet
  ]
})
export class AppComponent implements OnInit {

  private readonly _loggingService: LoggingService;

  constructor(private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('AppComponent initialized');
  }
}
