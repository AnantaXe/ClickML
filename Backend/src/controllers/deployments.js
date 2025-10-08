const express = require("express");
const pino = require("pino");

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

exports.deployPipeline = async (req, res) => {

    try {
        const { destination, ingestionForm} = req.body;
        console.log("Deploying ETL pipeline to:", destination, ingestionForm);

        res.status(200).json({ isDeployed: 1, deploymentMessage: "Deployed !" });
    } catch (error) {
        logger.error("Error deploying ETL pipeline:", error);
        res.status(500).json({ error: "Failed to deploy ETL pipeline" });
    }
}