import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EntityService, UserService } from '@app/api/services';
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

  constructor(private entityService: EntityService, private userService: UserService) { }

  ngOnInit(): void {
    this.entityService.apiEntityGetentityGet({ entityName: "User" }).subscribe((entities) => {
      console.log(entities);
    });

    const surveyJson = {
      elements: [{
        name: "FirstName",
        title: "First Name:",
        type: "text"
      }, {
        name: "LastName",
        title: "Last Name:",
        type: "text"
      }, {
        name: "Username",
        title: "Username:",
        type: "text"
      }, {
        name: "Email",
        title: "Email:",
        type: "text"
      }]
    };

    const survey = new Model(surveyJson);
    survey.onComplete.add((sender, options) => {
      console.log("Survey results: " + survey.data);
      this.userService.apiUserPost({ body: survey.data }).subscribe((user) => {
        console.log("User created", user);
      });
    });
    this.surveyModel = survey;
  }
}
