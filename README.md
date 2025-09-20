# Bootstrap Project
A project to demonstrate Angular features to be used for reference and bootstrapping new projects. WIP: The following are all automated, once you add models (simple POCOs):
- Create form from model
- Save form to database
- Create database from models
- Load form from database
- Query model using OData

# Tech Stack
- .NET 9 OData API 
- EntityFramework 8
- Angular 20

# Angular Features
- OAuth authentication -> Auth guard, Azure AD
- Dependency Injection -> Logging service, Toast service
- Datepicker
- NgRx
- OData query -> Query database using OData .NET EF controllers
- Menu -> Routing
- SurveyJS -> Automate creating form from model, and loading form from database
- OpenAPI generate -> Generate Angular API services from OpenAPI spec

# TODO
- Move validation-message component from features/rpg to shared/component
- Copy theming from frontend to bootstrap
- Copy frontend menu changes to bootstrap
- Add centralized logging
- Add more Angular features
- Upload to jburditt.com or fullsweb.com
- Implement CI/CD
- Add NgRx hydration for persistence
- Fix VS SPA error in console logs
- Fix or reinstall Storybook
- Integrate Matero component
- Edit user instead of adding new user
- Auth -> On clicking on Admin menu item, you will be redirected to Denied page. On second attempt, it will work
- Auth -> On logging out, it doesn't redirect you back to website

SiteMap
  Home
  Admin
    Dashboard
  User
    Edit
    Search
    New
  Features
    Form
    Upload
    NgRx Store
    Theme Matero

## Prerequisites
Install Node.js

## Windows
Strongly recommended to use NVM. This greatly simplifies working with multiple node/npm versions.
Follow this document to install nvm-windows, node.js, and npm
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows

For example:
`nvm install 21.1.0`
`nvm use 21.1.0`

## OAuth Configuration
- Navigate to portal.azure.com
- In "Search resources" textbox at top, find "Microsoft Entra ID"
- On the top navigation, select "Add" -> "App Registration"
- On the Overview page, record the "Application (client) ID"
  - and the "Directory (tenant) ID"
- Navigate to "Authentication" on the left navigation
- Click on "Add a platform" and add "Single-page application"
  - Add the following redirect uris
    - .NET core application - https://localhost:8080/swagger/oauth2-redirect.html
    - Angular - https://localhost:4200
  - Under "Implicit grant and hybrid flows", check the following options:
    - Access tokens (used for implicit flows)
    - ID tokens (used for implicit and hybrid flows)
- Copy the client id from the overview page and replace the guids in the urls for:
  - frontend/src/assets/config.json
    - issuer (tenant)
    - clientId (client)
  - Api/appsettings.json
    - Authority (tenant)
    - Issuer (tenant)
    - Audiences (client)

To remove/replace Azure OAuth, delete the contents of folder /frontend/src/app/core/auth and /Api/Modules/Auth

## Template

https://github.com/ng-matero/ng-matero

The template is in folder /frontend/src/app/shared/template

Verify if you need to install sub npm packages `npm i` (in folder /frontend/src/app/shared/template)
Verify what I did wrong, I manually deleted template/node_modules/common,router (exists in sub node_modules and root, maybe try using prefix instead of npm i in the sub folder)

To remove the template
- Delete /frontend/src/app/shared/template folder
- Run `npm uninstall @ng-matero/extensions`
- Delete architect/build/styles `"src/app/shared/template/styles.scss"` from angular.json
- Delete ng-matero paths from tsconfig.json

TODO check if there is a way to install package without installing package dependencies, since you will need to delete them from the template/node_modules and install in the root node_modules

## Pull Latest Changes

To install a npm package for ng-matero
- Run `./npm_download.sh photoviewer`
- Copy the package.json values from github ng-matero
NOTE if you run `npm i --prefix src/app/shared/template @ng-matero/extensions` it will install package dependencies in the subfolder node_modules and cause compilation errors

cd /frontend/src/app/shared/template
git checkout blah.git .
TODO main.ts sections

angular.json
    "assets": [
    {
        "glob": "**/*",
        "input": "src/app/shared/template/assets",
        "output": "/assets"
    },