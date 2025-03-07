data "azurerm_client_config" "current" {}
data "azurerm_subscription" "current" {}

module "naming" {
  source = "Azure/naming/azurerm"
  suffix = [var.environment]
}


resource "azurerm_resource_group" "rg" {
  name     = module.naming.resource_group.name
  location = var.location
}