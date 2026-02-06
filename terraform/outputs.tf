# static web app

output "api_key" {
  value = azurerm_static_web_app.static_web_app.default_host_name
}

# sql database

output "connection_string" {
  value = format(
    "Server=tcp:%s.database.windows.net,1433;Initial Catalog=%s;Persist Security Info=False;User ID=%s;Password=%s;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
    azurerm_mssql_server.sql_server.name,
    azurerm_mssql_database.sql_database.name,
    azurerm_mssql_server.sql_server.administrator_login,
    azurerm_mssql_server.sql_server.administrator_login_password
  )
  sensitive = true
}

# custom domain

output "fqdn" {
  value = azurerm_dns_cname_record.dns_zone.fqdn
}

output "record" {
  value = azurerm_dns_cname_record.dns_zone.record
}

output "soa_record" {
  value = azurerm_dns_zone.dns_zone.soa_record
}
