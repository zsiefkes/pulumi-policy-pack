import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

new PolicyPack("aws-typescript", {
    policies: [
        {
            name: "windows-server-base-image",
            description: "Ensures base image for any image recipe in AMI pipeline is of type Windows",
            enforcementLevel: "mandatory",
            validateResource: validateResourceOfType(aws.imagebuilder.ImageRecipe, (imageRecipe, args, reportViolation) => {
                if (imageRecipe.parentImage.toLowerCase().indexOf("windows") < 0) {
                    reportViolation(
                        "Server images must be based on the Windows Server platform. " +
                        "The PAMS build will not run successfully on Linux-based images."
                    );
                }
            })
        },
        {
            name: "s3-no-public-read",
            description: "Prohibits setting the publicRead or publicReadWrite permission on AWS S3 buckets.",
            enforcementLevel: "mandatory",
            validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
                if (bucket.acl === "public-read" || bucket.acl === "public-read-write") {
                    reportViolation(
                        "You cannot set public-read or public-read-write on an S3 bucket. " +
                        "Read more about ACLs here: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html");
                }
            }),
        }
    ]
});
