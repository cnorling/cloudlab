# ABOUT CLOUDLAB

This is a personal repository I use to publicly illustrate how I setup infrastructure as code in pulumi. If gitops, kubernetes, and infrastructure as code interests you, this repository is worth looking at.

## How can I minimize cloud homelabbing costs (in gke)?

Labbing in the cloud can be expensive, but there are tricks and things you can do in a kubernetes ecosystem that make working in a cloud provider like GCP a lot cheaper than you would think. My homelab costs me around $60 a month. That doesn't include one-time related costs like buying domain names. The best place to start is the [cost calculator](https://cloud.google.com/products/calculator). It does a good job at illustrating how much what you want to do will cost you. The next best thing you can do is use the free cloud credits they give you.

If you use compute resources, another good place to start is using [preemptible/spot nodes/vms](https://cloud.google.com/compute/docs/instances/preemptible). They're roughly 1/3 the cost of regular nodes/vms with the caveat that they may go down at any time. If your workloads are inherently fault tolerant, this is a great way to save money. All associated storage and addresses attached to these nodes/vms get the discount as well.
