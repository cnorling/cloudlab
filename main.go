package main

import (
	"cloudlab/rbac"

	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/dns"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/organizations"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(
		func(ctx *pulumi.Context) error {
			// get high level objects used by everything
			project, err := organizations.LookupProject(ctx, nil, nil)
			if err != nil {
				return err
			}

			// homemade function to create sa and give it the roles
			_, err = rbac.CreateAndRoleSa(ctx, rbac.Sa{
				ProjectId:          project.Id,
				ServiceaccountName: "pulumi",
				ProjectRoles: []string{
					"roles/dns.admin",
					"roles/container.admin",
					"roles/resourcemanager.projectIamAdmin",
					"roles/compute.admin",
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
