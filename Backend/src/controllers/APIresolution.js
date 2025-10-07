const express = require("express");
const axios = require("axios");
const pino = require("pino");
const { extractFeaturesNames } = require("./featureSelection");

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



exports.APIvalidate = async (APIEndpoint, APIKey = null) => {

    // API handling logic goes here

    try {

        logger.info(`Validating API endpoint: ${APIEndpoint}, API key: ${APIKey}`);
        return { valid: true };
    }
    catch (error) {
        logger.error("Error during API validation", error);
        return { valid: false, error: "Internal server error" };
    }

}

exports.APIFetch = async (APIEndpoint, APIKey = null) => {
    try {

        logger.info(`Fetching data from API endpoint: ${APIEndpoint}, API key: ${APIKey}`);

        const headers = APIKey ? { Authorization: `Bearer ${APIKey}` } : {};
        const response = await axios.get(APIEndpoint, { headers });
        data = extractFeaturesNames(response.data);
        return { success: true, data: data };

    }
    catch (error) {
        logger.error("Error during API fetch", error);
        console.log(error);
        return { success: false, error: "Internal server error" };
    }
}