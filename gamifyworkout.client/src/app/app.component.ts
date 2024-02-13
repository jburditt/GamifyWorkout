import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ]
})
export class AppComponent implements OnInit {

  public forecasts: WeatherForecast[] = [];

  private readonly _loggingService: LoggingService;

  constructor(private http: HttpClient, private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this.getForecasts();
    this._loggingService.debug('AppComponent initialized');
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

  title = 'gamifyworkout.client';
}
