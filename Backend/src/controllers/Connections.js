const express = require("express");
const {Client} = require("pg");
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

exports.testConnection = async (req, res) => {
    const { destinationType, destinationConfig } = req.body;

    try {
        
        const client = new Client({
            host: destinationConfig.host,
            port: destinationConfig.port || 5432,
            user: destinationConfig.user,
            password: destinationConfig.password,
            database: destinationConfig.database,
        });
        await client.connect();
        console.log("Testing connection for:", destinationType, JSON.stringify(destinationConfig));

        client.query(`CREATE TABLE IF NOT EXISTS ${destinationConfig.tableName} (id SERIAL PRIMARY KEY, name VARCHAR(50));`, (err, result) => {
            if (err) {
                logger.error(`Error creating table ${destinationConfig.tableName}:`, err);
                res.status(500).json({ isConnected: -1, connectionMessage: `Failed to create table ${destinationConfig.tableName}` });
            } else {
                logger.info(`Test table ${destinationConfig.tableName} created`);
                res.status(200).json({ isConnected: 1, connectionMessage: `Connection successful and table ${destinationConfig.tableName} created` });
            }
            client.end();
        });

    }catch (error) {
        
        logger.error("Error testing connection:", error);
        res.status(500).json({ isConnected: -1, connectionMessage: "Error testing connection" });

    }
}

// exports.connectToDestination = async (destination) => {
//     try {
//         console.log("Connecting to destination:", destination);
//         if(destination.destinationType === "postgres") {
//             const client = new Client({
//                 host: destination.destinationConfig.host,
//                 port: destination.destinationConfig.port || 5432,
//                 user: destination.destinationConfig.user,
//                 password: destination.destinationConfig.password,
//                 database: destination.destinationConfig.database,
//             });
//             const res = await client.connect();
//             return res;
//         }
//     }
//     catch (error) {
//         logger.error("Error connecting to destination:", error);
//         throw new Error("Failed to connect to destination");
//         return null;
//     }
// }