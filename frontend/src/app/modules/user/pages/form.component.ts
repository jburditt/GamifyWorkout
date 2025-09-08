import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { EntityService, UserService } from '@app/api/services';
import { Model } from "survey-core";
import { SurveyModule } from 'survey-angular-ui';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'form.component.html',
    imports: [FormsModule, ReactiveFormsModule, SurveyModule, MatNativeDateModule]
})
export class FormPageComponent implements OnInit {
  surveyModel!: Model;

  constructor(private entityService: EntityService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.entityService.apiEntityGetentityGet({ entityName: "User" }).subscribe((entities) => {
      console.log(entities);
    });

    // TODO last step for full automation, transform the above to the below
    const surveyJson = {
      elements: [{
        name: "firstName",
        title: "First Name:",
        type: "text"
      }, {
        name: "lastName",
        title: "Last Name:",
        type: "text"
      }, {
        name: "username",
        title: "Username:",
        type: "text"
      }, {
        name: "email",
        title: "Email:",
        type: "text"
      }]
    };

    let survey = new Model(surveyJson);
if (id) {
  this.userService.apiUserIdGet({ id: id }).subscribe((user) => {
    console.log(user);
    survey.data = user;
});
}
// TODO handle edit instead of always adding new user
    survey.onComplete.add((sender, options) => {
      console.log("Survey results: " + survey.data);
      this.userService.apiUserPost({ body: survey.data }).subscribe((user) => {
        console.log("User created", user);
      });
    });
    this.surveyModel = survey;
  }
}
