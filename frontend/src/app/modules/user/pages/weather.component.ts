import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { RouterLink, RouterOutlet } from '@angular/router';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterOutlet
  ]
})
export class WeatherPageComponent implements OnInit {

  public forecasts: WeatherForecast[] = [];

  private readonly _loggingService: LoggingService;

  constructor(private http: HttpClient, private loggingFactory: LoggingFactory) {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this.getForecasts();
    this._loggingService.debug('Weather page initialized');
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
