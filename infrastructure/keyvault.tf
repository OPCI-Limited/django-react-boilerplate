resource "azurerm_key_vault" "vault" {
  name                          = module.naming.key_vault.name_unique # Ensuring unique name due to soft delete.
  location                      = azurerm_resource_group.rg.location
  resource_group_name           = azurerm_resource_group.rg.name
  tenant_id                     = data.azurerm_client_config.current.tenant_id
  sku_name                      = "premium"
  soft_delete_retention_days    = 7
  enable_rbac_authorization     = true
  public_network_access_enabled = false
}

resource "azurerm_role_assignment" "kv_admin" {
  scope                = azurerm_key_vault.vault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_private_endpoint" "vault" {
  name                = module.naming.private_endpoint.name_unique
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.subnets["pe"].subnet_id

  private_service_connection {
    name                           = "vault-private-connection"
    private_connection_resource_id = azurerm_key_vault.vault.id
    is_manual_connection           = false
    subresource_names              = ["vault"]
  }
}

