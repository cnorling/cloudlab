package rbac

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/projects"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type Sa struct {
	// the name of the desired serviceaccount to create
	ServiceaccountName string
	// an array of project roles to be assigned to the serviceaccount
	ProjectRoles []string
	// the project id the service account resides in
	ProjectId string
}

func CreateAndRoleSa(ctx *pulumi.Context, sa Sa) (*serviceaccount.Account, error) {
	// create the service account
	createdServiceAccount, err := serviceaccount.NewAccount(ctx, sa.ServiceaccountName, &serviceaccount.AccountArgs{
		AccountId:   pulumi.String(sa.ServiceaccountName),
		DisplayName: pulumi.String(sa.ServiceaccountName),
	}, pulumi.Protect(true))
	if err != nil {
		return nil, err
	}

	// for each projectRole, add it to the sa
	for _, role := range sa.ProjectRoles {
		_, err = projects.NewIAMBinding(ctx, role, &projects.IAMBindingArgs{
			Project: pulumi.String(sa.ProjectId),
			Role:    pulumi.String(role),
			Members: pulumi.StringArray{
				createdServiceAccount.Email.ApplyT(func(Email string) string {
					return "serviceAccount:" + Email
				}).(pulumi.StringOutput),
			},
		})
	}
	if err != nil {
		return nil, err
	}
	return createdServiceAccount, nil
}
