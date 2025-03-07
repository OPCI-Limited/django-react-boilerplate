module "naming" {
  source = "Azure/naming/azurerm"
  suffix = [var.environment]
}

resource "azurerm_subnet" "subnet" {
  name                 = module.naming.subnet.name
  resource_group_name  = var.resource_group_name
  virtual_network_name = var.vnet.virtual_network_name
  address_prefixes     = var.address_prefixes

  private_endpoint_network_policies             = var.private_endpoint_network_policies
  private_link_service_network_policies_enabled = var.private_link_service_network_policies_enabled

  #tags = var.tags

  dynamic "delegation" {
    for_each = var.delegations != null ? var.delegations : []
    content {
      name = delegation.value.name

      service_delegation {
        name    = delegation.value.service_delegation.name
        actions = delegation.value.service_delegation.actions
      }
    }
  }
}

resource "azurerm_network_security_group" "nsg" {
  name                = "${module.naming.network_security_group.name}-${element(split("-", var.vnet.virtual_network_name), 3)}"
  location            = var.location
  resource_group_name = var.resource_group_name

  #tags = var.tags
}

resource "azurerm_subnet_network_security_group_association" "nsg_association" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}
