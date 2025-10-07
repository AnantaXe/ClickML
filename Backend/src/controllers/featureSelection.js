const express = require("express");
const axios = require("axios");
const pino = require("pino");
// const router = express.Router();
const fs = require("fs");
// const { testdb } = require("./testdb");
const { etlPush } = require("./etlController");
// const e = require("express");

// const { Client } = require("pg");

if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs", { recursive: true });
}

// const client = new Client({
//     user: "postgres",
//     password: "postgres",
//     host: "localhost",
//     port: 5432,
//     database: "postgres",
// });

// await client.connect();

let etl_configuration_endpoint = ""
let etl_configuration_pipelineName = ""

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

// function extractFeaturesNames(data) {
//     let fields = new Set();

//     if (Array.isArray(data)) {
//         // loop through each object in array
//         data.forEach((item) => {
//             if (typeof item === "object" && item !== null) {
//                 Object.keys(item).forEach((key) => fields.add(key));
//             }
//         });
//     } else if (typeof data === "object" && data !== null) {
//         // single object case
//         Object.keys(data).forEach((key) => fields.add(key));
//     }

//     return Array.from(fields); // return unique keys as array
// }

exports.extractFeaturesNames = function(data, fields = new Set(), prefix = "") {
    if (Array.isArray(data)) {
        data.forEach((item) => exports.extractFeaturesNames(item, fields, prefix));
    } else if (typeof data === "object" && data !== null) {
        Object.keys(data).forEach((key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key; // nested keys in dot notation
            fields.add(fullKey);
            exports.extractFeaturesNames(data[key], fields, fullKey);
        });
    }
    return Array.from(fields);
}

exports.fetchData = async (req, res) => {
    try {
        const { pipelineName, steps } = req.body;
        logger.info({ pipelineName, steps }, "Received pipeline request");

        etl_configuration_pipelineName = pipelineName

        if (!steps || !Array.isArray(steps)) {
            logger.error("Pipeline steps are required");
            return res
                .status(400)
                .json({ error: "Pipeline steps are required" });
        }

        let data = null;
        for (const [index, step] of steps.entries()) {
            logger.info(
                { stepNumber: index + 1, stepType: step.type },
                "Executing step"
            );

            switch (step.type) {
                case "fetch_api":
                    etl_configuration_endpoint = step.config.url
                    const { url, method, headers, params, body } = step.config;
                    logger.info({ url, method }, "Fetching data from API");

                    if (!url || !method) {
                        logger.error({ step }, "Missing API config in step");
                        throw new Error("Missing API config");
                    }
                    try {
                        const response = await axios({
                            url,
                            method,
                            headers,
                            params,
                            data: body,
                        });
                        data = response.data;
                        logger.info(
                            { sample: JSON.stringify(data).slice(0, 100) },
                            "API fetch successful"
                        );
                    } catch (apiErr) {
                        logger.error(
                            { error: apiErr.message },
                            "API fetch failed"
                        );
                        throw new Error("API fetch failed");
                    }
                    break;

                // case "transformation":
                //     if (
                //         step.config.operation === "drop_nulls" &&
                //         Array.isArray(data)
                //     ) {
                //         data = data.filter((item) => item != null);
                //     }
                //     break;

                // later you can add: clean, filter, normalize, save, etc.

                default:
                    logger.warn(
                        { stepType: step.type },
                        "Unknown step type, skipping"
                    );
            }
        }

        logger.info("Pipeline executed successfully");

        const extractedFields = extractFeaturesNames(data);
        logger.info({ extractedFields }, "Extracted feature names");

        res.json({
            message: "Pipeline executed successfully",
            pipelineName,
            resultPreview: extractedFields,
        });
    } catch (err) {
        logger.error({ error: err.message }, "Pipeline execution failed");
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.selectFeatures = async (req, res) => {
    try {
        let { features } = req.body;

        if (!Array.isArray(features)) {
            throw new Error("Expected features as array");
        }

        const cleaned = features.map((f) => f.replace(/^"|"$/g, ""));
        logger.info({ cleaned }, "Incoming cleaned features");

        res.json({
            message: "Transformation successful",
            result: cleaned,
        });

        

        etl_configuration = {
            pipelinename: etl_configuration_pipelineName,
            input_features: cleaned,
            endpoint: etl_configuration_endpoint,
            cron: "*/3 * * * *", // every 3 minutes
        }

        etlPush(etl_configuration);

        logger.info("Transformation process completed", { result: res });


    } catch (error) {
        logger.error({ error: error.message }, "Transformation failed");
        res.status(500).json({ error: error.message });
    }
};
