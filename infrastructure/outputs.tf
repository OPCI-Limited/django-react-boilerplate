output "resource_group_name" {
  description = "Name of the resoruce group"
  value       = azurerm_resource_group.rg.name
}

output "postgresql_flexible_server_fqdn" {
  description = "Fully Qualified Domain Name (FQDN) of the PostgreSQL Flexible Server"
  value       = azurerm_postgresql_flexible_server.db.fqdn
}

output "frontend_url" {
  description = "Frontend Web App default hostname"
  value       = azurerm_linux_web_app.frontend.default_hostname
}

output "backend_url" {
  description = "Backend Web App default hostname"
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "key_vault_name" {
  description = "Name of the Azure Key Vault"
  value       = azurerm_key_vault.vault.name
}

output "acr_url" {
  description = "Azure Container Registry Login Server"
  value       = azurerm_container_registry.acr.login_server
}
