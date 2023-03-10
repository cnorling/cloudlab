import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

interface zone {
  name: string;
  args: gcp.dns.ManagedZoneArgs;
  opts: pulumi.CustomResourceOptions;
}

// create zones
// const zones: zone[] = [
//   {
//     name: "norling-io",
//     args: {
//       description: "DNS Zone for domain: norling.io",
//       dnsName: "norling.io.",
//       dnssecConfig: {
//         state: "on",
//         nonExistence: "nsec3",
//         defaultKeySpecs: [
//           {
//             algorithm: "rsasha256",
//             keyLength: 2048,
//             keyType: "keySigning",
//           },
//           {
//             algorithm: "rsasha256",
//             keyLength: 1024,
//             keyType: "zoneSigning",
//           },
//         ],
//       },
//     },
//     opts: {
//       protect: false,
//     },
//   },
//   {
//     name: "nuggies-life",
//     args: {
//       description: "nuggies are life",
//       dnsName: "nuggies.life.",
//     },
//     opts: {
//       protect: false,
//     },
//   },
//   {
//     name: "salinesel-in",
//     args: {
//       description: "cloud dns zone for salinesel.in domain",
//       dnsName: "salinesel.in.",
//     },
//     opts: {
//       protect: false,
//     },
//   },
// ];

const zones: zone[] = [
  {
    name: "norling-io",
    args: {
      cloudLoggingConfig: {
        enableLogging: false,
      },
      description: "DNS zone for domain: norling.io",
      dnsName: "norling.io.",
      dnssecConfig: {
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
        nonExistence: "nsec3",
        state: "on",
      },
      name: "norling-io",
      project: "elite-protocol-319303",
    },
    opts: {
      protect: true,
    },
  },
  {
    name: "salinesel-in",
    args: {
      cloudLoggingConfig: {
        enableLogging: false,
      },
      description: "cloud dns zone for salinesel.in domain",
      dnsName: "salinesel.in.",
      name: "salinesel-in",
      project: "elite-protocol-319303",
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
      project: "elite-protocol-319303",
    },
    opts: {
      protect: true,
    },
  },
];

export function CreateGCPInfrastructure() {
  //   zones.forEach((zone) => {
  //     new gcp.dns.ManagedZone(zone.name, zone.args, zone.opts);
  //   });

  zones.forEach((zone) => {
    new gcp.dns.ManagedZone(zone.name, zone.args, zone.opts);
  });
  //   new gcp.dns.ManagedZone(
  //     "norling-io",
  //     {
  //       cloudLoggingConfig: {
  //         enableLogging: false,
  //       },
  //       description: "DNS zone for domain: norling.io",
  //       dnsName: "norling.io.",
  //       dnssecConfig: {
  //         defaultKeySpecs: [
  //           {
  //             algorithm: "rsasha256",
  //             keyLength: 2048,
  //             keyType: "keySigning",
  //           },
  //           {
  //             algorithm: "rsasha256",
  //             keyLength: 1024,
  //             keyType: "zoneSigning",
  //           },
  //         ],
  //         nonExistence: "nsec3",
  //         state: "on",
  //       },
  //       name: "norling-io",
  //       project: "elite-protocol-319303",
  //     },
  //     {
  //       protect: true,
  //     }
  //   );

  //   new gcp.dns.ManagedZone(
  //     "salinesel-in",
  //     {
  //       cloudLoggingConfig: {
  //         enableLogging: false,
  //       },
  //       description: "cloud dns zone for salinesel.in domain",
  //       dnsName: "salinesel.in.",
  //       name: "salinesel-in",
  //       project: "elite-protocol-319303",
  //     },
  //     {
  //       protect: true,
  //     }
  //   );

  //   new gcp.dns.ManagedZone(
  //     "nuggies-life",
  //     {
  //       cloudLoggingConfig: {
  //         enableLogging: false,
  //       },
  //       description: "nuggies are life",
  //       dnsName: "nuggies.life.",
  //       name: "nuggies-life",
  //       project: "elite-protocol-319303",
  //     },
  //     {
  //       protect: true,
  //     }
  //   );
}
