package main

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/dns"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(
		func(ctx *pulumi.Context) error {

			// this section is used to manage the pulumi serviceaccount with pulumi itself
			// it namely makes adding permissions trivial

			// manage the pulumi serviceaccount permissions
			serviceaccountName := "pulumi"
			pulumiServiceaccount, err := serviceaccount.NewAccount(ctx, serviceaccountName, &serviceaccount.AccountArgs{
				AccountId:   pulumi.String(serviceaccountName),
				DisplayName: pulumi.String(serviceaccountName),
			}, pulumi.Protect(true))
			if err != nil {
				return err
			}

			// give the pulumi serviceaccount the dns admin role
			_, err = serviceaccount.NewIAMBinding(ctx, "dns admin", &serviceaccount.IAMBindingArgs{
				ServiceAccountId: pulumiServiceaccount.Name,
				Role:             pulumi.String("roles/dns.admin"),
				Members: pulumi.StringArray{
					pulumiServiceaccount.Email.ApplyT(func(Email string) string {
						return "serviceAccount:" + Email
					}).(pulumi.StringOutput),
				},
			})
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
