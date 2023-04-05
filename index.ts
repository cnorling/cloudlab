import * as pulumi from "@pulumi/pulumi";
import * as gcp from "./gcp";
import * as linode from "./linode";
import * as azure from "./azure";

linode.CreateLinodeInfrastructure();
gcp.CreateGCPInfrastructure();
azure.CreateAzureInfrastructure();
