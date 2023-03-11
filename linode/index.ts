import * as pulumi from "@pulumi/pulumi";
import * as linode from "@pulumi/linode";

// globally used variables
const standardName = "cloudlab";
const linodeRegion = "us-west";

export function CreateLinodeInfrastructure() {
  // create a kubernetes cluster
  new linode.LkeCluster(standardName, {
    k8sVersion: "1.25",
    label: standardName,
    region: linodeRegion,
    pools: [
      {
        count: 3,
        type: "g6-standard-1",
      },
    ],
  });
}
