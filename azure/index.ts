import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";

export function CreateAzureInfrastructure() {
  // Create an Azure Resource Group
  const rg = new resources.ResourceGroup("cloudlab", {
    location: "eastus",
    resourceGroupName: "cloudlab",
  });
}
