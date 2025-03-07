resource "azurerm_storage_account" "storage" {
  name                     = module.naming.storage_account.name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

resource "azurerm_storage_container" "backend" {
  name                  = "backend"
  storage_account_id    = azurerm_storage_account.storage.id
  container_access_type = "private"
}

resource "azurerm_key_vault_secret" "primary_access_key" {
  name         = "primary-access-key"
  value        = azurerm_storage_account.storage.primary_access_key
  key_vault_id = azurerm_key_vault.vault.id
}
