# GamifyworkoutClient
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.

## Libary Dependency
The repository must be cloned within the 'fullswing-angular-library' repository, in the folder 'projects/gamifyworkout.
```bash
git clone https://github.com/jburditt/fullswing-angular-library.git
cd projects
mkdir gamifyworkout
cd gamifyworkout
git clone https://github.com/jburditt/GamifyWorkout.git .
```
Now you can build, run, and test the frontend project from the root folder in fullswing-angular-library.


## Deploy using Github Actions
- Create a new static web app with Deployment Token (not Github Id) and see the [Workflow](https://github.com/jburditt/GamifyWorkout/.github/workflows/gamifyworkout.yml)

## Deploy using Azure CLI
```bash
# npm install -D @azure/static-web-apps-cli
npm run deploy
```

## Custom domain
NOTES to myself:
- *AWS Route 53* 
  - add CNAME e.g. www with value from Azure resource e.g. blue-smoke-0eefaf11e.3.azurestaticapps.net
  - add A record with blank name and value by pinging the above?
- *Azure* - Static Web App -> Custom domains CNAME www name and value matching above
  
## Development server
Run `ng s` for a dev server. Navigate to `https://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng b` to build the project. The build artifacts will be stored in the `dist/` directory.

## Generate API
Run `ng-openapi-gen --input https://localhost:8080/swagger/v1/swagger.json --output src/app/api`

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Troubleshooting
If you encounter a self-signed certificate error, trust your local self-signed certificate or run `export NODE_TLS_REJECT_UNAUTHORIZED=0` to ignore the self-sign certificate error
