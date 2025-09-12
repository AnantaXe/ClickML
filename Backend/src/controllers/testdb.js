const express = require("express");
const axios = require("axios");
const pino = require("pino");
const { Pool, Client } = require("pg");

const pool = new Pool({
    user: "postgres1",
    password: "postgres2",
    host: "localhost",
    port: 5432,
    database: "postgres1",
});

exports.testdb = async () => {
    try {
        // 1. Create table if not exists
        //     await pool.query(`
        //     CREATE TABLE pipelines (
        //         id SERIAL PRIMARY KEY,
        //         name VARCHAR(255),
        //         schedule VARCHAR(50), -- cron expression
        //         steps JSONB NOT NULL, -- stores pipeline config (API, headers, etc.)
        //         created_at TIMESTAMP DEFAULT NOW(),
        //         updated_at TIMESTAMP DEFAULT NOW()
        //     )
        // `);

        console.log("✅ Table created");

        // 2. Insert sample data
        //     const insertQuery = `
        //     INSERT INTO pipelines (name, schedule, steps)
        //     VALUES ($1, $2, $3)
        //     RETURNING *
        // `;

        await pool.query(`
            INSERT INTO pipelines (name, schedule, steps)
            VALUES 
            ('Daily Data Sync', '0 2 * * *', 
            '[{"type": "extract", "api": "https://api.example.com/data", "headers": {"Authorization": "Bearer token"}}]'
        )`);

        console.log("✅ Sample data inserted");
        const res = await pool.query("SELECT * FROM pipelines");
        console.log("Table data:", res.rows);
    } catch (err) {
        console.error("❌ DB Error:", err);
    } finally {
        await pool.end();
    }
};
