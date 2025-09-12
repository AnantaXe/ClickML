import cron from "node-cron";
import { Client } from "pg";
import axios from "axios";

const db = new Client({
    user: "postgres",
    host: "localhost",
    database: "etl_db",
    password: "yourpassword",
    port: 5432,
});

await db.connect();

// Fetch all pipelines from DB
async function loadPipelines() {
    const res = await db.query("SELECT * FROM pipelines");
    res.rows.forEach(schedulePipeline);
}

// Schedule pipeline
function schedulePipeline(pipeline) {
    console.log(`Scheduling pipeline: ${pipeline.name} (${pipeline.schedule})`);

    cron.schedule(pipeline.schedule, async () => {
        console.log(`Running pipeline: ${pipeline.name}`);
        try {
            const steps = pipeline.steps;
            for (let step of steps) {
                if (step.type === "fetch_api") {
                    const response = await axios({
                        method: step.config.method,
                        url: step.config.url,
                        headers: step.config.headers,
                        params: step.config.params,
                    });
                    console.log("Fetched Data:", response.data.slice(0, 2)); // preview
                    // 👉 here you can add transformation + saving to DB
                }
            }
        } catch (err) {
            console.error(
                `Error running pipeline ${pipeline.name}:`,
                err.message
            );
        }
    });
}

// Start scheduler
loadPipelines();
