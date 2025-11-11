const {generate_db_to_db_ingestion} = require("../src/controllers/GenerateIngestionForm/dbTodb");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

// Load dummy input data
const dummyDataPath = path.join(__dirname, "dummyjson.json");
const rawData = fs.readFileSync(dummyDataPath);
const JsonData = JSON.parse(rawData);
const dbTodb = JsonData[1];

const { ingestionForm, source, transform, destination } = dbTodb;
// Generate the ingestion template
const renderedTemplate = generate_db_to_db_ingestion(ingestionForm, source, transform, destination);

// Write the generated template to a file
const outputPath = path.join(__dirname, "output", "generated_dag.py");
fs.writeFileSync(outputPath, renderedTemplate);

// Run assertions to verify the generated template
assert.ok(renderedTemplate.includes("from airflow import DAG"), "DAG import missing");
assert.ok(renderedTemplate.includes("def extract(**context):"), "Extract function missing");
assert.ok(renderedTemplate.includes("def transform(**context):"), "Transform function missing");
assert.ok(renderedTemplate.includes("def load(**context):"), "Load function missing");
console.log("All assertions passed. Generated template is valid.");