<!-- BEGIN_TF_DOCS -->

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.21.1 |
| <a name="provider_random"></a> [random](#provider\_random) | 3.7.1 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_backend"></a> [backend](#input\_backend) | n/a | <pre>object({<br>    image        = string<br>    tag          = string<br>    env_vars     = map(string)<br>    app_settings = map(string) # Add this line<br>  })</pre> | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Name of the environment to be deployed | `string` | n/a | yes |
| <a name="input_frontend"></a> [frontend](#input\_frontend) | n/a | <pre>object({<br>    image        = string<br>    tag          = string<br>    env_vars     = map(string)<br>    app_settings = map(string) # Add this line<br>  })</pre> | n/a | yes |
| <a name="input_location"></a> [location](#input\_location) | Azure Region | `string` | n/a | yes |
| <a name="input_postgres_databases"></a> [postgres\_databases](#input\_postgres\_databases) | List of PostgreSQL databases with configuration | <pre>list(object({<br>    name      = string<br>    collation = string<br>    charset   = string<br>  }))</pre> | n/a | yes |
| <a name="input_postgresql_version"></a> [postgresql\_version](#input\_postgresql\_version) | PostgreSQL version | `string` | `"12"` | no |
| <a name="input_private_dns_zones"></a> [private\_dns\_zones](#input\_private\_dns\_zones) | A list of private DNS zones to be created or managed, typically used for internal networking within a cloud environment. | `list(string)` | n/a | yes |
| <a name="input_sku_name"></a> [sku\_name](#input\_sku\_name) | SKU for PostgreSQL Server | `string` | `"B_Standard_B1ms"` | no |
| <a name="input_storage_mb"></a> [storage\_mb](#input\_storage\_mb) | Storage size in MB | `number` | `32768` | no |
| <a name="input_storage_tier"></a> [storage\_tier](#input\_storage\_tier) | Storage tier | `string` | `"P4"` | no |
| <a name="input_vnet"></a> [vnet](#input\_vnet) | Configuration for the Azure Virtual Network. | <pre>object({<br>    address_space = list(string)<br>    dns_servers   = optional(list(string), [])<br>    subnets = map(object({<br>      address_prefixes                              = list(string)<br>      private_link_service_network_policies_enabled = optional(bool)<br>      delegations = optional(list(object({<br>        name = string<br>        service_delegation = object({<br>          name    = string<br>          actions = list(string)<br>        })<br>      })))<br>      security_rules = list(object({<br>        name                       = optional(string)<br>        priority                   = optional(number)<br>        direction                  = optional(string)<br>        access                     = optional(string)<br>        protocol                   = optional(string)<br>        source_port_range          = optional(string)<br>        destination_port_ranges    = optional(list(string))<br>        source_address_prefix      = optional(string)<br>        destination_address_prefix = optional(string)<br>      }))<br>    }))<br>  })</pre> | n/a | yes |
| <a name="input_web_apps"></a> [web\_apps](#input\_web\_apps) | List of Linux Web Apps with configurations including environment variables | <pre>list(object({<br>    name     = string<br>    image    = string<br>    env_vars = map(string) # Map of environment variables (key-value pairs)<br>  }))</pre> | n/a | yes |
## Outputs

| Name | Description |
|------|-------------|
| <a name="output_db_connection_string"></a> [db\_connection\_string](#output\_db\_connection\_string) | n/a |
## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_naming"></a> [naming](#module\_naming) | Azure/naming/azurerm | n/a |
| <a name="module_subnets"></a> [subnets](#module\_subnets) | ./modules/subnet | n/a |
## Resources

| Name | Type |
|------|------|
| [azurerm_container_registry.acr](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_registry) | resource |
| [azurerm_key_vault.vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault) | resource |
| [azurerm_key_vault_secret.dbadmin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_linux_web_app.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app) | resource |
| [azurerm_linux_web_app.frontend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app) | resource |
| [azurerm_postgresql_flexible_server.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server) | resource |
| [azurerm_postgresql_flexible_server_database.databases](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server_database) | resource |
| [azurerm_private_dns_a_record.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_a_record) | resource |
| [azurerm_private_dns_zone.private_dns](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone) | resource |
| [azurerm_private_dns_zone_virtual_network_link.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone_virtual_network_link) | resource |
| [azurerm_private_endpoint.acr_private_endpoint](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_private_endpoint.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_private_endpoint.db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_private_endpoint.vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_resource_group.rg](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_role_assignment.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.frontend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.kv_admin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_service_plan.asp](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan) | resource |
| [azurerm_storage_account.storage](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) | resource |
| [azurerm_storage_container.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_container) | resource |
| [azurerm_subnet.backend](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [azurerm_virtual_network.vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network) | resource |
| [random_password.db](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [azurerm_client_config.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/client_config) | data source |

<!-- END_TF_DOCS -->