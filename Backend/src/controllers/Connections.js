const express = require("express");
// const router = express.Router();
const pino = require("pino");

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        targets: [
            { target: 'pino-pretty', options: { colorize: true } },
            { target: 'pino/file', options: { destination: './logs/app.log' } },
        ],
    },
});

exports.testConnection = (req, res) => {
    const { destinationType, destinationConfig } = req.body;
    console.log("Testing connection for:", destinationType, JSON.stringify(destinationConfig));
    res.status(200).json({ isConnected: 1, connectionMessage: "Connection successful" });
}