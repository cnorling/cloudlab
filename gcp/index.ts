import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

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

const config = new pulumi.Config();
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
        ttl: 300,
      },
      {
        dnsname: "norling.io.",
        type: "MX",
        rrdatas: ["10 mx1.titan.email.", "20 mx2.titan.email."],
        ttl: 300,
      },
      {
        dnsname: "norling.io.",
        type: "TXT",
        rrdatas: ['"v=spf1 include:spf.titan.email ~all"'],
        ttl: 300,
      },
      {
        dnsname: "titan1._domainkey.norling.io.",
        type: "TXT",
        rrdatas: [
          '"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMw2YCVyR9M6MWEynk7qRcGqNLxax9rl36f9VWPziAe7cAPdoq9TjIh5o0grIqnpzfb1lUejgZ+rnP5h06FLPOK39gL2Ld6y92emrgYMDApXhW5VR3moStLg5gI60DWLtk4E3Nkk/XpFaaLsLLN4Y1xlOO2tbwyRQRhwqAm49PkwIDAQAB"',
        ],
        ttl: 30,
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
  // create dns records
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

  // create dns serviceaccount for external-dns
  const externalDnsSa = new gcp.serviceaccount.Account(
    "external-dns-serviceaccount",
    {
      accountId: "external-dns",
      displayName: "external-dns",
    }
  );

  // add external-dns serviceaccount to dns admin group
  new gcp.projects.IAMBinding("external-dns-permissions", {
    project: "elite-protocol-319303",
    role: "roles/dns.admin",
    members: [externalDnsSa.email.apply((email) => `serviceAccount:${email}`)],
  });

  // create a key for the external-dns serviceaccount
  new gcp.serviceaccount.Key("external-dns-key", {
    serviceAccountId: externalDnsSa.name,
  });
}
