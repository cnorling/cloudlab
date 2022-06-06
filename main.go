package main

import (
	"cloudlab/rbac"

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
				},
			})
			if err != nil {
				return err
			}
			return nil
		})
}
