package main

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/dns"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

func main() {
	pulumi.Run(
		func(ctx *pulumi.Context) error {
			// get existing configuration
			conf := config.New(ctx, "")
			project := conf.Require("gcp:project")
			ctx.Export("project", pulumi.String(project))

			// manage the pulumi serviceaccount permissions
			serviceaccountName := "pulumi"
			_, err := serviceaccount.NewAccount(ctx, serviceaccountName, &serviceaccount.AccountArgs{
				AccountId:   pulumi.String(serviceaccountName),
				DisplayName: pulumi.String(serviceaccountName),
				Project:     pulumi.String(project),
			}, pulumi.Protect(true))
			if err != nil {
				return err
			}

			// get pre-existing managed zone
			managedZone, err := dns.LookupManagedZone(ctx, &dns.LookupManagedZoneArgs{
				Name: "nuggies-life",
			}, nil)
			if err != nil {
				return err
			}

			// create a single dns record
			domain := "foo.nuggies.life"
			_, err = dns.NewRecordSet(ctx, domain, &dns.RecordSetArgs{
				Name:        pulumi.String(domain + "."),
				Type:        pulumi.String("A"),
				Ttl:         pulumi.Int(1),
				ManagedZone: pulumi.String(managedZone.Name),
				Rrdatas:     pulumi.StringArray{pulumi.String("1.2.3.4")},
			})
			if err != nil {
				return err
			}
			return nil
		})
}
