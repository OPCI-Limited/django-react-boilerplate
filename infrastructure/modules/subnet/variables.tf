variable "environment" {
  description = "The base name for resources, used in naming convention"
  type        = string
}

variable "name" {
  description = "The base name for resources, used in naming convention"
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group where resources will be deployed"
  type        = string
}

variable "vnet" {
  description = "Object containing virtual network details"
  type = object({
    virtual_network_name = string
  })
}

variable "address_prefixes" {
  description = "List of address prefixes for the subnet"
  type        = list(string)
}

variable "location" {
  description = "The Azure region where resources will be deployed"
  type        = string
}

variable "delegations" {
  description = "Optional delegations for the subnet"
  type        = list(any)
  default     = []
}

variable "private_endpoint_network_policies" {
  description = "Enable or Disable network policies for the private endpoint on the subnet."
  type        = string
  default     = "Disabled"
}

variable "private_link_service_network_policies_enabled" {
  description = "Enable or Disable network policies for the private link service on the subnet."
  type        = bool
  default     = true
}

