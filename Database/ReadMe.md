Run these commands in root folder, not in project folder
NOTE adding --verbose can sometimes help uncover silent errors

Prerequisite
dotnet ef core tool installed `dotnet tool install --global dotnet-ef`

`dotnet ef database update --project Database --startup-project Api`

To add a new migration:
`dotnet ef migrations add AddUser --project Database --startup-project Api`
`dotnet ef database update --project Database --startup-project Api`

To remove migrations:
`delete from __EFMigrationsHistory; drop table Users;`
- delete all of the files in the Migrations folder
- Run "To add a new migration" command above

TODO
- Finish BlobStorage
- Update root ReadMe on how to setup project e.g. EF commands above
- Use GlobalUsings
- Fix self-signed certificate
- Upgrade .NET
- Upgrade EF
- Upgrade packages