Run these commands in root folder, not in project folder
NOTE adding --verbose can sometimes help uncover silent errors

Prerequisite
dotnet ef core tool installed `dotnet tool install --global dotnet-ef`

dotnet ef database update --project Database --startup-project Api
dotnet ef migrations add AddUser --project Database --startup-project Api
dotnet ef database update --project Database --startup-project Api

TODO
- Finish BlobStorage
- Update root ReadMe on how to setup project e.g. EF commands above
- Use GlobalUsings
- Fix self-signed certificate