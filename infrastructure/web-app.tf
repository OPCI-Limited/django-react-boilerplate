resource "azurerm_service_plan" "asp" {
  name                = module.naming.app_service_plan.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "frontend" {
  name                = "frontend"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    always_on                               = true
    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name = "${azurerm_container_registry.acr.login_server}:${var.frontend.image}:${var.frontend.tag}"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = merge({ "WEBSITES_PORT" = "3000" }, var.frontend.app_settings)

  virtual_network_subnet_id = module.subnets["frontend"].subnet_id
}

resource "azurerm_linux_web_app" "backend" {

  name                = "backend"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    always_on                               = true
    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name = "${azurerm_container_registry.acr.login_server}:${var.backend.image}:${var.backend.tag}"
    }
  }

  identity {
    type = "SystemAssigned"
  }
  app_settings = merge(
    {
      "POSTGRES_DB"            = "django_db"
      "POSTGRES_USER"          = "dbadmin"
      "POSTGRES_PASSWORD"      = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.dbadmin.id})"
      "POSTGRES_HOST"          = azurerm_postgresql_flexible_server.db.fqdn
      "POSTGRES_PORT"          = "5432"
      "AZURE_ACCOUNT_NAME"     = azurerm_storage_account.storage.name
      "AZURE_ACCOUNT_KEY"      = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.primary_access_key.id})"
      "AZURE_STATIC_CONTAINER" = "backend",
      "WEBSITES_PORT"          = "8000"
    },
    var.backend.app_settings
  )

  virtual_network_subnet_id = module.subnets["backend"].subnet_id
}

resource "azurerm_role_assignment" "frontend" {
  scope                = azurerm_key_vault.vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

resource "azurerm_role_assignment" "backend" {
  scope                = azurerm_key_vault.vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}

resource "azurerm_subnet" "backend" {
  name                 = module.naming.private_endpoint.name_unique
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/28"]

  # Disable Private Link Service Network Policies
  private_link_service_network_policies_enabled = false
}

resource "azurerm_private_endpoint" "backend" {
  name                = module.naming.private_endpoint.name_unique
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = module.subnets["pe"].subnet_id

  private_service_connection {
    name                           = module.naming.private_endpoint.name_unique
    private_connection_resource_id = azurerm_linux_web_app.backend.id
    subresource_names              = ["sites"]
    is_manual_connection           = false
  }
}

resource "azurerm_private_dns_a_record" "backend" {
  name                = "backend"
  zone_name           = azurerm_private_dns_zone.private_dns["privatelink.azurewebsites.net"].name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.backend.private_service_connection.0.private_ip_address]
}