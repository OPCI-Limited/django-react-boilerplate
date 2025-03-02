environment = "prod"
location    = "UK South"

postgres_databases = [
  {
    name      = "django_db",
    collation = "en_US.utf8",
    charset   = "UTF8"
  }
]

frontend = {
  image = "frontend",
  tag   = "latest",
  app_settings = {
    # Extra Env Vars here
  }
}

backend = {
  image = "frontend",
  tag   = "latest",
  app_settings = {
    # Extra Env Vars here
  }
}

vnet = {
  address_space = ["10.0.0.0/16"]
  subnets = {
    pe = {
      delegations      = []
      security_rules   = []
      address_prefixes = ["10.0.1.0/24"]
    }
    frontend = {
      delegations = [
        {
          name = "frontend"
          service_delegation = {
            name    = "Microsoft.Web/serverFarms"
            actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
          }
        }
      ]
      security_rules   = []
      address_prefixes = ["10.0.2.0/24"]
    }
    backend = {
      delegations = [
        {
          name = "frontend"
          service_delegation = {
            name    = "Microsoft.Web/serverFarms"
            actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
          }
        }
      ]
      security_rules   = []
      address_prefixes = ["10.0.3.0/24"]
    }
    database = {
      delegations      = []
      security_rules   = []
      address_prefixes = ["10.0.10.0/24"]
    }
  }
}

private_dns_zones = [
  "privatelink.vaultcore.azure.net",
  "privatelink.postgres.database.azure.com",
  "privatelink.azurecr.io",
  "privatelink.azurewebsites.net"
]