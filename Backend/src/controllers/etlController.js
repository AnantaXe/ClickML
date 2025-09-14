const express = require("express")
const pino = require("pino")
const axios = require("axios")

exports.etlPush = (configuration) => {
    const logger = pino({
        level: configuration.logLevel || "info",
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        }
    })

    logger.info("ETL push started")

    // ETL push logic here

    axios
        .post("http://localhost:8000/create-etl-pipeline", configuration, {
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
            logger.info("ETL push successful", res.data);
        })
        .catch((err) => {
            logger.error("ETL push failed", err);
        });

    logger.info("ETL push completed");
}