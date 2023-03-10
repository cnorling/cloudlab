import * as gcp from "@pulumi/gcp";
import { ManagedZoneArgs } from "@pulumi/gcp/dns";

interface zone {
  name: string;
  args: ManagedZoneArgs;
}

// create zones
const zones: zone[] = [
  {
    name: "norling-io",
    args: {
      description: "DNS Zone for domain: norling.io",
      dnsName: "norling.io.",
      dnssecConfig: {
        state: "on",
      },
    },
  },
  {
    name: "nuggies-life",
    args: {
      description: "nuggies are life",
      dnsName: "nuggies.life.",
    },
  },
  {
    name: "salinesel-in",
    args: {
      description: "cloud dns zone for salinesel.in domain",
      dnsName: "salinesel.in.",
    },
  },
];

export function CreateGCPInfrastructure() {
  zones.forEach((zone) => {
    new gcp.dns.ManagedZone(zone.name, zone.args);
  });
}
