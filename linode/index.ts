import * as pulumi from "@pulumi/pulumi";
import * as linode from "@pulumi/linode";

export function CreateLinodeInfrastructure() {
  // import config settings
  const config = new pulumi.Config();
  const region = config.get("linode:region")!;
  const resname = config.get("linode:resname")!;

  // create a kubernetes cluster
  new linode.LkeCluster(resname, {
    k8sVersion: "1.25",
    label: resname,
    region: region,
    pools: [
      {
        count: 3,
        type: "g6-standard-1",
      },
    ],
  });
}
