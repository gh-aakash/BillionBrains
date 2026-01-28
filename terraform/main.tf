terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "bb_rg" {
  name     = "billion-brains-rg"
  location = "East US 2"
}

resource "azurerm_kubernetes_cluster" "bb_aks" {
  name                = "billion-brains-aks"
  location            = azurerm_resource_group.bb_rg.location
  resource_group_name = azurerm_resource_group.bb_rg.name
  dns_prefix          = "billionbrains"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2s_v3" # More generally available
  }

  identity {
    type = "SystemAssigned"
  }
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.bb_aks.kube_config_raw
  sensitive = true
}

output "resource_group_name" {
    value = azurerm_resource_group.bb_rg.name
}

output "cluster_name" {
    value = azurerm_kubernetes_cluster.bb_aks.name
}
