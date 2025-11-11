// import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
const {S3Client, ListBucketsCommand} = require("@aws-sdk/client-s3");
require("dotenv").config();



const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

(async () => {
    try {
        console.log(process.env.AWS_ACCESS_KEY_ID);
        const result = await s3.send(new ListBucketsCommand({}));
        console.log(
            "✅ Connected to AWS successfully. Buckets:",
            result.Buckets
        );
    } catch (e) {
        console.error("❌ AWS credentials invalid:", e);
    }
})();
