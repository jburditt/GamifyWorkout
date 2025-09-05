import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EntityService } from '@app/api/services';
import { DatePickerComponent } from '@app/shared/components/datepicker/date-picker.component';
import { Model } from "survey-core";
import { SurveyModule } from 'survey-angular-ui';

@Component({
    templateUrl: 'form.component.html',
    imports: [
        FormsModule, ReactiveFormsModule, SurveyModule,
        MatDatepickerModule,
        MatNativeDateModule,
        DatePickerComponent
    ]
})
export class FormPageComponent implements OnInit {
  searchForm = new FormGroup({
    date: new FormControl('', []),
  });
  surveyModel!: Model;

  constructor(private entityService: EntityService)
  {

  }

  ngOnInit(): void {
    this.entityService.apiEntityGetentityGet({ entityName: "User" }).subscribe((entities) => {
      console.log(entities);
    });

    const surveyJson = {
      elements: [{
        name: "FirstName",
        title: "Enter your first name:",
        type: "text"
      }, {
        name: "LastName",
        title: "Enter your last name:",
        type: "text"
      }]
    };

    const survey = new Model(surveyJson);
    this.surveyModel = survey;
  }
}
