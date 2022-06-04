package main

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/dns"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(
		func(ctx *pulumi.Context) error {
			// get pre-existing managed zone
			managedZone, err := dns.LookupManagedZone(ctx, &dns.LookupManagedZoneArgs{
				Name: "nuggies-life",
			}, nil)
			if err != nil {
				return err
			}

			// create a single dns record
			domain := "foo"
			record, err := dns.NewRecordSet(ctx, domain, &dns.RecordSetArgs{
				Name:        pulumi.String(domain),
				Type:        pulumi.String("A"),
				Ttl:         pulumi.IntPtr(1),
				ManagedZone: pulumi.String(managedZone.Name),
				Rrdatas:     pulumi.StringArray{pulumi.String("1.2.3.4")},
			})
			if err != nil {
				return err
			}

			// log the dns record's name
			ctx.Export("dns records created:", record.Name)
			return nil
		})
}
