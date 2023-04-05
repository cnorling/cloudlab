import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as containerservice from "@pulumi/azure-native/containerservice";

export function CreateAzureInfrastructure() {
  // Create an Azure Resource Group
  const rg = new resources.ResourceGroup("cloudlab", {
    location: "eastus",
    resourceGroupName: "cloudlab",
  });

  // create kubernetes cluster
  const k8s = new containerservice.ManagedCluster("k8s-cluster", {
    resourceGroupName: rg.name,
    kubernetesVersion: "1.25.0",
  });
}
