# GamifyWorkout
Gamify Working out and Exercising

# Prerequisites
Install Node.js


# Windows
Strongly recommended to use NVM. This greatly simplifies working with multiple node/npm versions.
Follow this document to install nvm-windows, node.js, and npm
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows

nvm install 21.1.0

nvm use 21.1.0

npm install -g @angular/cli


# OAuth Configuration
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
