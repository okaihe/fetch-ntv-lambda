import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default class S3Uploader {
    constructor() {
        this.s3Client = new S3Client({ region: "eu-central-1" });
    }

    async uploadContent(bucket, key, contentString) {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: contentString,
        });

        try {
            console.log("Uploading", bucket + "/" + key, "...");
            const response = await this.s3Client.send(command);
            console.log("Finished!");
        } catch (err) {
            console.log(err);
        }
    }
}
