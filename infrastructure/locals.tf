locals {
  tags = {
    Environment = "Production"
    Owner       = "DevOps Team"
    Project     = "CodingTest"
    CostCenter  = "IT-001"
    ManagedBy   = "Terraform"
    Application = "Django-React-Boilerplate"
    Department  = "IT"
    Compliance  = "ISO27001"
  }

  dns_zone_map = {
    for zone, dns in azurerm_private_dns_zone.private_dns : zone => dns.id
  }
}