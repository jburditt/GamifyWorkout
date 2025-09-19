# Generate SSL Certificate

openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout localhost.key -days 3560 -out localhost.crt -config cert.cnf

# Install Certificate

## Windows 10/11

- Double click on the certificate (server.crt)
- Click on the button “Install Certificate …”
- Select whether you want to store it on user level or on machine level
- Click “Next”
- Select “Place all certificates in the following store”
- Click “Browse”
- Select “Trusted Root Certification Authorities”
- Click “Ok”
- Click “Next”
- Click “Finish”
- If you get a prompt, click “Yes”
- Restart browser

## For OS X

- Double click on the certificate (server.crt)
- Select your desired keychain (login should suffice)
- Add the certificate
- Open Keychain Access if it isn’t already open
- Select the keychain you chose earlier
- You should see the certificate localhost
- Double click on the certificate
- Expand Trust
- Select the option Always Trust in When using this certificate
- Close the certificate window

## Angular

Reference: https://stackoverflow.com/questions/39210467/get-angular-cli-to-ng-serve-over-https

To add HTTPS and use the certificate generated above, add the following to Angular.json:
```json
{
  "projects": {
    "<PROJECT_NAME>": {
      "architect": {
        "options": {
          "ssl": true,
          "sslKey": "./ssl/localhost.key",
          "sslCert": "./ssl/localhost.crt"
        }
        ...
}
```
