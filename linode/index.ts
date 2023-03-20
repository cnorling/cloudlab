import * as linode from "@pulumi/linode";
import * as k8s from "@pulumi/kubernetes";

export function CreateLinodeInfrastructure() {
  // create a kubernetes cluster
  const k8sCluster = new linode.LkeCluster("cloudlab", {
    k8sVersion: "1.25",
    label: "cloudlab",
    region: "us-west",
    pools: [
      {
        count: 3,
        type: "g6-standard-1",
      },
    ],
  });

  // initialize the provider
  const provider = new k8s.Provider("linode-cluster", {
    kubeconfig: k8sCluster.kubeconfig,
  });

  // install argocd
  const argocd = new k8s.kustomize.Directory("argocd", {
    directory: "https://github.com/cnorling/k8s/tree/main/argocd",
  });

  // install the app of apps
  const appOfApps = new k8s.kustomize.Directory(
    "app-of-apps",
    { directory: "https://github.com/cnorling/k8s/tree/main/app-of-apps" },
    { dependsOn: argocd }
  );
}
