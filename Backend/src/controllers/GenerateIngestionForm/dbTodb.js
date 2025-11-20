const pino = require("pino");
const nunjucks = require("nunjucks");
const fs = require("fs");

nunjucks.configure("src/templates", {
    autoescape: false,
});

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

exports.generate_db_to_db_ingestion = (ingestionForm, source, transform, destination) => {
    const rendered = nunjucks.render("dbTodb.njk", {
        dag_id: ingestionForm.pipelineName,
        description: ingestionForm.description || "Ingestion ETL DAG generated",
        schedule: ingestionForm.cron || "@once",
        sourceType: source.sourceType,
        // host: source.sourceConfig.host,
        // port: source.sourceConfig.port,
        // database: source.sourceConfig.database,
        // username: source.sourceConfig.user,
        // password: source.sourceConfig.password,
        // table: source.sourceConfig.table,
        sourceConfig: JSON.stringify(source.sourceConfig, null, 2),
        sourceQuery: source.sourceQuery,
        transform_cleaningRules: transform.transformLogic.cleaningRules,
        transform_featureList: transform.transformLogic.featureList,
        transform_pythonFunction: transform.transformLogic.pythonFunction,
        destType: destination.destinationType,
        // dest_host: destination.destinationConfig.host,
        // dest_port: destination.destinationConfig.port,
        // dest_database: destination.destinationConfig.database,
        // dest_username: destination.destinationConfig.user,
        // dest_password: destination.destinationConfig.password,
        destConfig: JSON.stringify(destination.destinationConfig, null, 2),
        destTable: destination.destinationTable,
    });

    logger.info("Ingestion DAG generated:", rendered);
    return rendered;
}

exports.generate_api_to_db_ingestion = (ingestionForm, source, transform, destination) => {
    const rendered = nunjucks.render("apiTodb.njk", {
        dag_id: ingestionForm.pipelineName,
        description: ingestionForm.description || "Ingestion ETL DAG generated",
        schedule: ingestionForm.cron || "@once",
        sourceType: source.sourceType,
        sourceConfig: JSON.stringify(source.sourceConfig, null, 2),
        selectedFields: transform.transformationLogic.selectedFields,
        transform_pythonFunction: null,
        transform_featureList: null,
        cleaning_rules: null,
        destinationType: destination.destinationType,
        destinationConfig: JSON.stringify(destination.destinationConfig, null, 2),
        destinationTable: destination.destinationTable,
    });
    logger.info("Ingestion DAG generated:", rendered);
    return rendered;
}
