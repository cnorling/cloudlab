import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

interface zone {
  name: string;
  args: gcp.dns.ManagedZoneArgs;
  opts: pulumi.CustomResourceOptions;
}

// create zones
const zones: zone[] = [
  {
    name: "norling-io",
    args: {
      cloudLoggingConfig: {
        enableLogging: false,
      },
      description: "DNS zone for domain: norling.io",
      name: "norling-io",
      dnsName: "norling.io.",
      dnssecConfig: {
        state: "on",
      },
    },
    opts: {
      protect: true,
    },
  },
  {
    name: "salinesel-in",
    args: {
      description: "cloud dns zone for salinesel.in domain",
      dnsName: "salinesel.in.",
      name: "salinesel-in",
    },
    opts: {
      protect: true,
    },
  },
  {
    name: "nuggies-life",
    args: {
      cloudLoggingConfig: {
        enableLogging: false,
      },
      description: "nuggies are life",
      dnsName: "nuggies.life.",
      name: "nuggies-life",
    },
    opts: {
      protect: true,
    },
  },
];

export function CreateGCPInfrastructure() {
  zones.forEach((zone) => {
    new gcp.dns.ManagedZone(zone.name, zone.args, zone.opts);
  });
}
