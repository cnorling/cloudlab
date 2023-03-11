import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";

interface zone {
  name: string;
  args: gcp.dns.ManagedZoneArgs;
  opts?: pulumi.CustomResourceOptions;
}

interface record {
  dnsname: string;
  type: string;
  rrdatas: string[];
  ttl?: number;
  opts?: pulumi.CustomResourceOptions;
}

interface domain {
  zone: zone;
  records: record[];
}

const domains: domain[] = [
  {
    zone: {
      name: "norling-io",
      args: {
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
    records: [
      {
        dnsname: "norling.io.",
        type: "A",
        rrdatas: [
          "185.199.108.153",
          "185.199.109.153",
          "185.199.110.153",
          "185.199.111.153",
        ],
      },
      {
        dnsname: "norling.io.",
        type: "MX",
        rrdatas: ["10 mx1.titan.email.", "20 mx2.titan.email."],
      },
      {
        dnsname: "norling.io.",
        type: "TXT",
        rrdatas: ['"v=spf1 include:spf.titan.email ~all"'],
      },
      {
        dnsname: "titan1._domainkey.norling.io.",
        type: "TXT",
        rrdatas: [
          '"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMw2YCVyR9M6MWEynk7qRcGqNLxax9rl36f9VWPziAe7cAPdoq9TjIh5o0grIqnpzfb1lUejgZ+rnP5h06FLPOK39gL2Ld6y92emrgYMDApXhW5VR3moStLg5gI60DWLtk4E3Nkk/XpFaaLsLLN4Y1xlOO2tbwyRQRhwqAm49PkwIDAQAB"',
        ],
      },
    ],
  },
  {
    zone: {
      name: "nuggies-life",
      args: {
        description: "nuggies are life",
        name: "nuggies-life",
        dnsName: "nuggies.life.",
      },
      opts: {
        protect: true,
      },
    },
    records: [],
  },
  {
    zone: {
      name: "salinesel-in",
      args: {
        description: "cloud dns zone for salinesel.in domain",
        name: "salinesel-in",
        dnsName: "salinesel.in.",
      },
      opts: {
        protect: true,
      },
    },
    records: [],
  },
];

export function CreateGCPInfrastructure() {
  domains.forEach((domain) => {
    // create the zone
    const zone = new gcp.dns.ManagedZone(
      domain.zone.name,
      domain.zone.args,
      domain.zone.opts
    );

    // create the records
    domain.records.forEach((record) => {
      const resourceName = `${record.dnsname}${record.type}`;
      new gcp.dns.RecordSet(
        resourceName,
        {
          managedZone: zone.name,
          rrdatas: record.rrdatas,
          type: record.type,
          name: record.dnsname,
          ttl: record.ttl,
        },
        record.opts
      );
    });
  });
}
