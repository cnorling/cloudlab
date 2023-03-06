import * as pulumi from "@pulumi/pulumi";
import * as linode from "@pulumi/linode";

// globally used variables
const standardName = "cloudlab"
const region = "us-west"

// create a kubernetes cluster
const cluster = new linode.LkeCluster(standardName, {
    k8sVersion: "1.25",
    label: standardName,
    region: region,
    pools: [{
        count: 3,
        type: "g6-standard-1"
    }]
})

export const clusterLabel = cluster.label
