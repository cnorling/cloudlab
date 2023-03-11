import * as pulumi from "@pulumi/pulumi";
import * as gcp from "./gcp";
import * as linode from "./linode";

linode.CreateLinodeInfrastructure();
gcp.CreateGCPInfrastructure();
