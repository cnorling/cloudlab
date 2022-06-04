package main

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/storage"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(
		func(ctx *pulumi.Context) error {
			// Create a GCP resource (Storage Bucket)
			_, err := storage.NewBucket(ctx, "my-bucket", &storage.BucketArgs{
				Location: pulumi.String("US"),
			})
			if err != nil {
				return err
			}

			return nil
		})
}
