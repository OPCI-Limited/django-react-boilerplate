# Infrastructure Deployment - Web Application on Azure

This folder contains the Infrastructure as Code (IaC) configuration to provision the web application environment on Azure. The infrastructure includes all required resources for the application to function effectively, including compute, networking, a database, and a storage container. 

## Deployment Steps
### Prerequisites
Before deploying the infrastructure, ensure you have the following installed and configured:

* Azure CLI (az login)
* Terraform Installed
* Access to an Azure subscription with the necessary permissions
* Azure storage account & container for state storage

## Deployment Process

Clone this repository :

```sh
git clone <repository-url>
cd infrastructure
```

Authenticate to Azure:
```sh
az login
az account set --subscription "<SUBSCRIPTION_ID>"
```

Initialize the deployment:
```sh
terraform init
```

Preview the infrastructure changes:
```sh
terraform plan
```

Apply the configuration to deploy resources:
```sh
terraform apply
```

## Validation
The chosen approach ensures a secure and private deployment, consisting of:

* 2 web apps (within a single app service plan)
* PostgreSQL flexible server
* 1 database (django_db)
* Key Vault
* Container registry
* VNet/subnets
* Private DNS
* Private endpoints

### Rationale:
* The frontend should be publicly accessible.
* The backend should only accept traffic from the frontend (internally, not via the internet).
* The database should only accept traffic from the backend.

### Configuration Details:
* Web apps have default environment variables set, but these can be extended using `var.backend.app_settings` and `var.frontend.app_settings` variables.
* Any secrets generated or required by the application are stored in the Key Vault and accessed securely via private endpoints and RBAC, using system-assigned identities.

### Dockerfile Changes
The backend Dockerfile has been updated to:
* Expose port 8000 instead of 8001.
* Use Gunicorn instead of the built-in development server.

### Validation of resources

The provided Terraform was deployed to an Azure subscription and tested to ensure proper resource configuration. Due to time constraints, the actual web app container build/start process was not fully validated. However, this setup provides a solid foundation for securely hosting the application, with minimal additional configuration required.

# Future Enhancements

## Multi-Environment Support
To make thsi deployment adaptable for different environments (e.g., dev, staging, production):

* Use Terraform separate state files for each environment.
* Implement environment-specific configuration using variables (var.environment, var.backend.config, var.frontend.config).
* Use Azure DevOps Pipelines or GitHub Actions for CI/CD, with environment/path-based deployment triggers.

2. Network Security & Segmentation (Hub-Spoke Topology)
Currently, everything sits in a single VNet, but introducing a Hub-Spoke model improves security and scalability:

Hub VNet
Houses shared resources like firewall, Bastion, VPN Gateway, and monitoring/logging services (e.g., Azure Monitor, Log Analytics, Security Center).
Controls outbound/inbound traffic via Azure Firewall or a third-party NGFW.
Can integrate with an on-premises network via ExpressRoute or VPN Gateway.
Spoke VNets
Separate spokes for web apps, backend services, and database.
Use NSGs (Network Security Groups) and UDRs (User-Defined Routes) to control traffic flow.
Limit exposure with Private Link and Private Endpoints (as you're already doing).
Firewall & Route Tables Enhancements
Implement Azure Firewall with threat intelligence-based filtering.
Enforce traffic flow control using UDRs, ensuring:
Web apps only communicate with the backend.
The backend only reaches the database over a private endpoint.
Internet egress is restricted, allowing only approved destinations (e.g., package registries).
