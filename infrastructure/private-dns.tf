resource "azurerm_private_dns_zone" "private_dns" {
  for_each            = toset(var.private_dns_zones)
  name                = each.key
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "this" {
  for_each = azurerm_private_dns_zone.private_dns

  name                  = each.value.name
  resource_group_name   = azurerm_resource_group.rg.name
  private_dns_zone_name = each.value.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}