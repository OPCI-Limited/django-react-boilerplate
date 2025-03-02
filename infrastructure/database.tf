resource "random_password" "db" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_key_vault_secret" "dbadmin" {
  name         = "dbadmin"
  value        = random_password.db.result
  key_vault_id = azurerm_key_vault.vault.id
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                          = module.naming.postgresql_server.name
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  version                       = var.postgresql_version
  delegated_subnet_id           = module.subnets["database"].subnet_id
  private_dns_zone_id           = azurerm_private_dns_zone.private_dns["privatelink.postgres.database.azure.com"].id
  public_network_access_enabled = false
  administrator_login           = "dbadmin"
  administrator_password        = random_password.db.result
  zone                          = "1"

  storage_mb   = var.storage_mb
  storage_tier = var.storage_tier

  sku_name = var.sku_name
}

resource "azurerm_private_endpoint" "db" {
  name                = module.naming.private_endpoint.name_unique
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.subnets["pe"].subnet_id

  private_service_connection {
    name                           = "pg-private-connection"
    private_connection_resource_id = azurerm_postgresql_flexible_server.db.id
    is_manual_connection           = false
    subresource_names              = ["postgresqlServer"]
  }
}

resource "azurerm_postgresql_flexible_server_database" "databases" {
  for_each = { for db in var.postgres_databases : db.name => db }

  name      = each.value.name
  server_id = azurerm_postgresql_flexible_server.db.id
  collation = each.value.collation
  charset   = each.value.charset
}