output "subnet_id" {
  description = "The unique identifier of the subnet."
  value       = azurerm_subnet.subnet.id
}

output "subnet_name" {
  description = "The name of the subnet."
  value       = azurerm_subnet.subnet.name
}

output "nsg_id" {
  description = "The unique identifier of the Network Security Group (NSG)."
  value       = azurerm_network_security_group.nsg.id
}

output "nsg_name" {
  description = "The name of the Network Security Group (NSG)."
  value       = azurerm_network_security_group.nsg.name
}
