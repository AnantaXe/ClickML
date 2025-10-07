const express = require("express");
const router = express.Router();
const pino = require("pino");

const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    }
});

/* req.body should contain:
{
    pipelineName: "name_of_pipeline",
    cron: "cron_expression", // optional, if not provided, run once immediately
    source_type: "api" | "database" | "s3" // type of data source
    source_config: { ... }, // config specific to source_type
}
*/

exports.controlIngestion = async (req, res) => {
    const { pipelineName, cron, sourceType, sourceConfig } = req.body;
    logger.info(`Received ingestion request for pipeline: ${pipelineName}`);

    if (!pipelineName || !sourceType || !sourceConfig) {
        logger.error("Missing required fields in request body");
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        logger.info(`Configuration for sourceType: ${sourceType} - ${JSON.stringify(sourceConfig)}`);
        res.status(200).json({ message: `Ingestion for pipeline ${pipelineName} scheduled` });
    } catch (error) {
        logger.error(`Error processing ingestion request: ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}