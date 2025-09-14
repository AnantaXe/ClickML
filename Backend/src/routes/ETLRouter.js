const express = require("express");
const { fetchData, selectFeatures } = require("../controllers/featureSelection");
const { etlPush } = require("../controllers/etlController");
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
logger.info("Setting up /fetchData route");

router.post("/fetchData", fetchData);
router.post("/selectfeatures", selectFeatures);
router.post("/etlpush", etlPush);

logger.info("Request received for /fetchData");

module.exports = router;
