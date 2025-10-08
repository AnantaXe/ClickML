const express = require("express");
const router = express.Router();
const pino = require("pino");
const fs = require("fs");
const { etlPush } = require("../controllers/etlController");
const { fetchData, selectFeatures } = require("../controllers/featureSelection");
const { validateData, validateAPI, APIPreview } = require("../controllers/validatation");
const { controlIngestion } = require("../controllers/controlIngestion");
const { testConnection } = require("../controllers/Connections");
const { deployPipeline } = require("../controllers/deployments");


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
// logger.info("Setting up /fetchData route");

router.post("/validateData", validateData)
router.post("/validateApi", validateAPI);

router.post("/fetchData", fetchData);
router.post("/selectfeatures", selectFeatures);
router.post("/etlpush", etlPush);

router.post("/api/apipreview", APIPreview)
router.post("/api/ingestion", controlIngestion);
router.post("/api/testconnection", testConnection)
router.post("/api/deploypipeline", deployPipeline);

// logger.info("Request receive/d for /fetchData");

module.exports = router;
