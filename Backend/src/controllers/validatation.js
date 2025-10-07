const express = require("express");
const pino = require("pino");
const { APIvalidate, APIFetch } = require("./APIresolution");
const { extractFeaturesNames } = require("./featureSelection");
const { default: axios } = require("axios");

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

exports.validateData = async (req, res) => {
    const { scenario, sourceType, sourceConfig } = req.body;
    const { apiUrl, apiKey } = sourceConfig || {};
    if (!scenario) {
        logger.error("Configuration is required");
        return res.status(400).json({ error: "Configuration is required" });
    }

    try {
        // const scenario = config.scenario;
        if(scenario === "ingestion"){

            console.log(`scenario is : `, scenario);
            await logger.info(`Validating data for scenario type: ${scenario}`);
            switch (sourceType) {
                case "api":
                    await logger.info("API source type selected");
                    if (!apiUrl) {
                        await logger.error(`API URL ${apiUrl} is required for API source`);
                        return res.status(400).json({ error: "API URL is required for API source" });
                    }
                    const { valid } = await APIvalidate(apiUrl, apiKey);
                    if (!valid) {
                        await logger.error("API validation failed");
                        return res.status(400).json({ error: "API validation failed" });
                    }
                    const { success, data, error } = await APIFetch(apiUrl, apiKey);
                    if (!success) {
                        await logger.error("API fetch failed");
                        return res.status(400).json({ error: "API fetch failed", details: error });
                    }
                    // Process the fetched data
                    await logger.info("API data fetched successfully");
                    await logger.info("Fetched data:", JSON.stringify(data));
                    return res.status(200).json(data);
                
                    break;

                case "file":
                    logger.info("File source type selected");
                    // filehandler
                    break;

                case "database":
                    logger.info("Database source type selected");
                    // dbhandler
                    break;
                    
                case "stream":
                    logger.info("Stream source type selected");
                    // streamhandler
                    break;

                default:
                    return res.status(400).json({ error: "Invalid source type" });
                }
                
            } else if(scenario === "transformation"){
                // transformation validation logic
            } else if(scenario === "loading"){
                // loading validation logic
            } else {
                return res.status(400).json({ error: "Invalid scenario" });
            }
    }
    catch (error) {
        logger.error("Error during data validation", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

exports.validateAPI = async (req, res) => {
    const { apiUrl, apiKey } = req.body;
    if (!apiUrl) {
        logger.error("API URL is required");
        return res.status(400).json({ error: "API URL is required", message: "API URL is required", valid: -1 });
    }
    try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
        });
        if (!response.ok) {
            const error = await response.json();
            logger.error("API validation failed", error);
            return res.status(400).json({ error: "API validation failed", details: error, message: "API is not Valid", valid: -1 });
        }
        logger.info("API validated successfully");
        return res.status(200).json({ message: "API validated successfully", valid: 1 });
    } catch (error) {
        logger.error("Error during API validation", error);
        console.log(error);
        return res.status(500).json({ error: "Internal server error", message: "Invalid API", valid: -1 });
    }
}

exports.APIPreview = async (req, res) => {
    const { apiUrl, apiKey } = req.body;
    if (!apiUrl) {
        logger.error("API URL is required");
        return res.status(400).json({ error: "API URL is required" });
    }
    try {
        // const { success, data, error } = await APIFetch(apiUrl, apiKey);
        const fetch = (...args) =>
            import("node-fetch").then(({ default: fetch }) => fetch(...args));
        const response = await fetch(apiUrl, {
            headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
        });
        if (!response.ok) {
            logger.error("API fetch failed");
            return res.status(400).json({ error: "API fetch failed"});
        }
        const data = await response.json();
        const extractedFeatures = extractFeaturesNames(data);
        logger.info("API data fetched successfully");
        // console.log("data", data);
        console.log("extractedFeatures", extractedFeatures);
        return res.status(200).json(extractedFeatures);
    } catch (error) {
        logger.error("Error during API fetch", error);
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}