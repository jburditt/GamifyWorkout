resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project}"
  location = var.location
}

# Static Web App

resource "azurerm_static_web_app" "static_web_app" {
  name                = "stapp-${var.project}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  app_settings = {
    "SqlDbConnectionString" = format(
      "Server=tcp:%s.database.windows.net,1433;Initial Catalog=%s;Persist Security Info=False;User ID=%s;Password=%s;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
      azurerm_mssql_server.sql_server.name,
      azurerm_mssql_database.sql_database.name,
      azurerm_mssql_server.sql_server.administrator_login,
      azurerm_mssql_server.sql_server.administrator_login_password
    )
  }
}

# Sql Database

resource "random_password" "sql_password" {
  length              = 16
  special             = true
  upper               = true
  lower               = true
  numeric             = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_mssql_server" "sql_server" {
  name                         = "sql-${var.project}"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladminuser"
  administrator_login_password = random_password.sql_password.result
}

resource "azurerm_mssql_database" "sql_database" {
  name                = "sqldb-${var.project}"
  server_id           = azurerm_mssql_server.sql_server.id
  sku_name            = "Free"
}

# Custom Domain

resource "azurerm_dns_zone" "dns_zone" {
  name = var.domain
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_dns_cname_record" "dns_zone" {
  name                = var.subdomain
  zone_name           = azurerm_dns_zone.dns_zone.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  record              = azurerm_static_web_app.static_web_app.default_host_name
}

# NOTE currently does not work for me, theory is because my domain is hosted on AWS and requires validation
# manually add the CNAME record to AWS Route53 to verify domain ownership and add custom domain to Static Web App on Azure
# TODO move AWS Route53 domains to Azure
# resource "azurerm_static_web_app_custom_domain" "gamifyworkout" {
#   static_web_app_id = azurerm_static_web_app.static_web_app.id
#   domain_name       = "${azurerm_dns_cname_record.gamifyworkout.name}.${azurerm_dns_cname_record.gamifyworkout.zone_name}"
#   validation_type   = "cname-delegation"
# }
