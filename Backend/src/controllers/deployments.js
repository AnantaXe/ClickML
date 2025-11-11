const express = require("express");
const pino = require("pino");
const axios = require("axios");
const nunjucks = require("nunjucks");
const { generate_db_to_db_ingestion } = require("./GenerateIngestionForm/dbTodb");
const fs = require("fs");
require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

nunjucks.configure("src/templates", {
    autoescape: false,
});


const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const logger = pino({   
    level: process.env.LOG_LEVEL || "info",
    transport: {
        targets: [
            {
                target: "pino-pretty", // pretty print in console
                options: { colorize: true },
            },
            {
                target: "pino/file", // save to file
                options: { destination: "./logs/app.log" }, // relative to project root
            },
        ],
    },
});

exports.deployIngestionPipeline = async (req, res) => {

    // Deploy ETL pipeline logic here
    // return { isDeployed: 1, deploymentMessage: "Deployed !" };

    try {

        const { ingestionForm, source, transform, destination } = req.body;
        console.log("Deploying ETL pipeline to:", destination, ingestionForm);

        logger.info("Connecting to source...");

        if(source.sourceType === "postgres" || source.sourceType === "mysql") {

            const rendered = generate_db_to_db_ingestion(ingestionForm, source, transform, destination);

            logger.info("Ingestion deployment initiated:", rendered)

            // Save rendered DAG to S3

            try {
                const command = new PutObjectCommand({
                    Bucket: "clickml-etl-storage", 
                    Key: `clickml-etl-dags/${ingestionForm.pipelineName}.py`,
                    Body: rendered,
                    ContentType: "text/x-python",
                });

                await s3.send(command);
                console.log("✅ Uploaded DAG file to S3 successfully");
                logger.info("Uploaded DAG file to S3 successfully");
                res.status(200).json({ isDeployed: 1, deploymentMessage: "ETL pipeline deployed successfully" });
            } catch (err) {
                console.error("❌ S3 Upload failed:", err);
                logger.error("S3 Upload failed:[deployment.js:80]", err);
                res.status(500).json({ isDeployed: -1, deploymentMessage: "ETL pipeline deployment failed" });
            }
        }
        if(source.sourceType === "api") {
            // Postgres connection and data fetch logic here
            res.status(200).json({ isDeployed: 1, deploymentMessage: "sourceType = api (no implementation yet)" });
            logger.info("sourceType = api (no implementation yet)");
        }
        if(source.sourceType === "s3") {
            // S3 connection and data fetch logic here
            res.status(200).json({ isDeployed: 1, deploymentMessage: "sourceType = s3 (no implementation yet)" });
            logger.info("sourceType = s3 (no implementation yet)");
        }

        console.log("Check pipeline in Saved Pipelines section.");

        // res.status(200).json({ isDeployed: 1, deploymentMessage: "Deployed !" });
    } catch (error) {
        logger.error("Error deploying ETL pipeline: (deployment.js:49:67)", error);
        console.error("Error deploying ETL pipeline:", error);
        res.status(500).json({ isDeployed: -1, deploymentMessage: "Deployment failed" });
    }
}