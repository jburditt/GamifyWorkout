# Gamify Workout Project
This demo focuses on two pages, see the menu items [Gym](/inventory/gym) and [Weekly Schedule](/schedule/week).

~~A workout application to track exercises and create workout schedules. Progression is gamified by earning experience points and leveling up.~~

# Tech Stack
- .NET 9 OData API 
- EntityFramework 8
- Angular 20

# Features
- OAuth authentication
- Dependency Injection
- NgRx -> Observables, Behavioural Subject, etc
- OpenAPI generate -> Generate Angular API services and models from OpenAPI spec
- Angular Material -> Datatable, tabs, form components, dialogs, drag and drop, slide toggle, etc
- Entity Framework -> Seeding, API, migrations, CRUD entities, etc
- Angular Features -> Dynamic Routing, Content Projection, Form Controls/Group, etc
- Axure Wireframes

# TODO
- Gym page bugs and missing features
  - Add new gym without reload the equipment is wrong and delete doesn't have the gymId
  - Move Save button beside name and rename to "Change Name"
  - Add a remove gym button
  - Add a "Select All Equipment" button
  - Hide "Add Equipment" button if gym already has all equipment
  - Change sync to async and verify the UI is less glitchy
- Move textbox.component to bootstrap repo
- Move validation-message component from features/rpg to shared/component
- Add centralized logging
- Upload to gamifyworkout.com
- Implement CI/CD
- Add NgRx hydration for persistence
- Fix VS SPA error in console logs
- Remove Storybook
- Add OAuth to API
- Auth -> On clicking on Admin menu item, you will be redirected to Denied page. On second attempt, it will work
- Auth -> On logging out, it doesn't redirect you back to website

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
