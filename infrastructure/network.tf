resource "azurerm_virtual_network" "vnet" {
  name                = module.naming.virtual_network.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = var.vnet.address_space #tbd
  dns_servers         = var.vnet.dns_servers   #tbd

  tags = local.tags
}

module "subnets" {
  source              = "./modules/subnet"
  environment         = var.environment
  for_each            = var.vnet.subnets
  name                = each.key
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  private_link_service_network_policies_enabled = each.value.private_link_service_network_policies_enabled

  vnet = {
    virtual_network_name = azurerm_virtual_network.vnet.name
  }

  address_prefixes = each.value.address_prefixes
  delegations      = each.value.delegations
}
