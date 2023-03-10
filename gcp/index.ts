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
      description: "DNS Zone for domain: norling.io",
      dnsName: "norling.io.",
      dnssecConfig: {
        state: "on",
        nonExistence: "nsec3",
        defaultKeySpecs: [
          {
            algorithm: "rsasha256",
            keyLength: 2048,
            keyType: "keySigning",
          },
          {
            algorithm: "rsasha256",
            keyLength: 1024,
            keyType: "zoneSigning",
          },
        ],
      },
    },
    opts: {
      protect: true,
    },
  },
  {
    name: "nuggies-life",
    args: {
      description: "nuggies are life",
      dnsName: "nuggies.life.",
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
