const express = require("express");
const { extractData } = require("../controllers/fetchData");
const router = express.Router();
const pino = require("pino");
const fs = require("fs");
const { log } = require("console");

if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs", { recursive: true });
}

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

// POST /ETL - execute ETL pipeline
logger.info("Setting up /extractData route");

router.post("/extractData", extractData);

logger.info("Request received for /extractData");

module.exports = router;
