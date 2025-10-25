const express = require("express");
const pino = require("pino");
const axios = require("axios");

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
        const { destination, ingestionForm } = req.body;
        console.log("Deploying ETL pipeline to:", destination, ingestionForm);

        // Connecting to Source 
        logger.info("Connecting to source...");

        if(ingestionForm.sourceType === "api") {
            const configuration = {ingestionForm, destination};
            const result = axios.post("http://localhost:8000/api/deployetl/ingestion",  configuration, {
                headers: { "Content-Type": "application/json" }
            }).then((result)=> {
                logger.info("Ingestion deployed successfully:", result.data);
                res.status(200).json({ isDeployed: 1, deploymentMessage: "Deployed !" });
            }).catch((err) => {
                logger.error("ETL push failed (deployment.js:40:105)", err);
                res.status(500).json({ isDeployed: -1, deploymentMessage: "ETL push failed" });
            })
            logger.info("Ingestion deployment initiated:", result);
        }
        if(ingestionForm.sourceType === "postgres") {
            // Postgres connection and data fetch logic here
            res.status(200).json({ isDeployed: 1, deploymentMessage: "sourceType = postgres (no implementation yet)" });
            logger.info("sourceType = postgres (no implementation yet)");
        }
        if(ingestionForm.sourceType === "s3") {
            // S3 connection and data fetch logic here
            res.status(200).json({ isDeployed: 1, deploymentMessage: "sourceType = s3 (no implementation yet)" });
            logger.info("sourceType = s3 (no implementation yet)");
        }

        console.log("Check pipeline in Saved Pipelines section.");
        logger.info("ETL pipeline deployed successfully.");



        // res.status(200).json({ isDeployed: 1, deploymentMessage: "Deployed !" });
    } catch (error) {
        logger.error("Error deploying ETL pipeline: (deployment.js:49:67)", error);
        res.status(500).json({ isDeployed: -1, deploymentMessage: "Deployment failed" });
    }
}