variable "environment" {
  type        = string
  description = "Name of the environment to be deployed"
}

variable "location" {
  description = "Azure Region"
  type        = string
}

variable "vnet" {
  description = "Configuration for the Azure Virtual Network."
  type = object({
    address_space = list(string)
    dns_servers   = optional(list(string), [])
    subnets = map(object({
      address_prefixes                              = list(string)
      private_link_service_network_policies_enabled = optional(bool)
      delegations = optional(list(object({
        name = string
        service_delegation = object({
          name    = string
          actions = list(string)
        })
      })))
      security_rules = list(object({
        name                       = optional(string)
        priority                   = optional(number)
        direction                  = optional(string)
        access                     = optional(string)
        protocol                   = optional(string)
        source_port_range          = optional(string)
        destination_port_ranges    = optional(list(string))
        source_address_prefix      = optional(string)
        destination_address_prefix = optional(string)
      }))
    }))
  })
}

variable "postgresql_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "12"
}

variable "storage_mb" {
  description = "Storage size in MB"
  type        = number
  default     = 32768
}

variable "storage_tier" {
  description = "Storage tier"
  type        = string
  default     = "P4"
}

variable "sku_name" {
  description = "SKU for PostgreSQL Server"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgres_databases" {
  description = "List of PostgreSQL databases with configuration"
  type = list(object({
    name      = string
    collation = string
    charset   = string
  }))
}

variable "private_dns_zones" {
  description = "A list of private DNS zones to be created or managed, typically used for internal networking within a cloud environment."
  type        = list(string)
}
variable "backend" {
  type = object({
    image        = string
    tag          = string
    app_settings = map(string) # Add this line
  })
}

variable "frontend" {
  type = object({
    image        = string
    tag          = string
    app_settings = map(string) # Add this line
  })
}