resource "azurerm_container_registry" "acr" {
  name                          = module.naming.container_registry.name
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  sku                           = "Premium"
  admin_enabled                 = false
  public_network_access_enabled = false
}

resource "azurerm_private_endpoint" "acr_private_endpoint" {
  name                = module.naming.private_endpoint.name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  subnet_id           = module.subnets["pe"].subnet_id

  private_service_connection {
    name                           = "${module.naming.container_registry.name}-sc"
    private_connection_resource_id = azurerm_container_registry.acr.id
    is_manual_connection           = false
    subresource_names = [
      "registry"
    ]
  }
  private_dns_zone_group {
    name                 = "private_dns_zone_group"
    private_dns_zone_ids = [local.dns_zone_map["privatelink.azurecr.io"]]
  }
}