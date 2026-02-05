output "api_key" {
  value = azurerm_static_web_app.static_web_app.default_host_name
}

output "fqdn" {
  value = azurerm_dns_cname_record.dns_zone.fqdn
}

output "record" {
  value = azurerm_dns_cname_record.dns_zone.record
}

output "soa_record" {
  value = azurerm_dns_zone.dns_zone.soa_record
}

output "endpoint" {
  value = azurerm_cosmosdb_account.db_account.endpoint
}

output "connection-string" {
  value = azurerm_cosmosdb_account.db_account.primary_sql_connection_string
  sensitive = true
}
