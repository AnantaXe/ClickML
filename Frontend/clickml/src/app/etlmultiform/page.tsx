"use client";
import { useState } from "react";

const scenarios = ["ingestion", "transformation", "enrichment", "monitoring"];

export default function PipelineWizard() {
    const [active, setActive] = useState("ingestion");

    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [resultPreview, setResultPreview] = useState<
        Record<string, unknown>[]
    >([]);

    const [formData, setFormData] = useState<any>({
        ingestion: {
            pipeline_name: "",
            cron: "0 * * * *",
            sourceType: "",
            sourceConfig: {},
            destinationType: "",
            destinationConfig: {},
        },
        transformation: {
            pipeline_name: "",
            cron: "0 1 * * *",
            sourceType: "",
            sourceConfig: {},
            transformationLogic: "",
        },
        enrichment: {
            pipeline_name: "",
            cron: "0 */6 * * *",
            enrichmentApi: "",
            apiKey: "",
            joinField: "",
        },
        monitoring: {
            pipeline_name: "",
            cron: "*/10 * * * *",
            targetType: "",
            targetConfig: {},
            metric: "",
            alertEmail: "",
        },
    });

    const handleChange = (scenario: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [scenario]: { ...prev[scenario], [field]: value },
        }));
    };

    function toggleFeature(key: string) {
        setSelectedFeatures((prev) =>
            prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
        );
    }

    const handleNestedChange = (
        scenario: string,
        configKey: string,
        field: string,
        value: string
    ) => {
        setFormData((prev: any) => ({
            ...prev,
            [scenario]: {
                ...prev[scenario],
                [configKey]: { ...prev[scenario][configKey], [field]: value },
            },
        }));
    };

    const handleSubmit = () => {
        alert(
            JSON.stringify({ scenario: active, ...formData[active] }, null, 2)
        );
        fetch("http://localhost:3002/etl/validateData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scenario: active, ...formData[active] }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Pipeline response:", data);
                // const json = data;
                const normalized = Array.isArray(data) ? data : [data];
                setResultPreview(normalized);
                alert("Pipeline submitted successfully!");
            })
            .catch((error) => {
                console.error("Error submitting pipeline:", error);
                alert("Error submitting pipeline");
            });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Navbar */}
            <div className="flex space-x-4 border-b mb-6">
                {scenarios.map((s) => (
                    <button
                        key={s}
                        onClick={() => setActive(s)}
                        className={`px-4 py-2 capitalize ${
                            active === s
                                ? "border-b-2 border-emerald-700 font-bold"
                                : "text-gray-500"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Sliding Window */}
            <div className="transition-all duration-500">
                {active === "ingestion" && (
                    <div className="space-y-3">
                        <h2 className="font-bold text-xl">
                            Ingestion Pipeline
                        </h2>
                        <input
                            placeholder="Pipeline Name"
                            value={formData.ingestion.pipeline_name}
                            onChange={(e) =>
                                handleChange(
                                    "ingestion",
                                    "pipeline_name",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <select
                            value={formData.ingestion.sourceType}
                            onChange={(e) =>
                                handleChange(
                                    "ingestion",
                                    "sourceType",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Source</option>
                            <option value="postgres">Postgres</option>
                            <option value="api">API</option>
                            <option value="s3">S3</option>
                        </select>

                        {formData.ingestion.sourceType === "postgres" && (
                            <div className="space-y-2 border p-3 rounded">
                                <input
                                    type="url"
                                    required
                                    pattern="https?://.+"
                                    placeholder="Host"
                                    value={formData.ingestion.sourceConfig.host}
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "host",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    placeholder="Database"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "database",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Table Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "tableName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    placeholder="User"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "user",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        {formData.ingestion.sourceType === "api" && (
                            <div className="space-y-2 border p-3 rounded">
                                <input
                                    type="text"
                                    placeholder="API URL"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "apiUrl",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="API Key"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "apiKey",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        {formData.ingestion.sourceType === "s3" && (
                            <div className="space-y-2 border p-3 rounded">
                                <input
                                    type="text"
                                    placeholder="Bucket Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "bucketName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="AWS Access Key"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "awsAccessKey",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="AWS Secret Key"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "sourceConfig",
                                            "awsSecretKey",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        <select
                            value={formData.ingestion.destinationType}
                            onChange={(e) =>
                                handleChange(
                                    "ingestion",
                                    "destinationType",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Destination</option>
                            <option value="postgres">Postgres</option>
                            <option value="s3">S3</option>
                        </select>

                        {formData.ingestion.destinationType === "postgres" && (
                            <div className="space-y-2 border p-3 rounded">
                                <input
                                    placeholder="Host"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "host",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    placeholder="Database"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "database",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    placeholder="User"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "user",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        {formData.ingestion.destinationType === "s3" && (
                            <div className="space-y-2 border p-3 rounded">
                                <input
                                    type="text"
                                    placeholder="Bucket Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "bucket",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="AWS Access Key"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "aws_access_key",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />

                                <input
                                    type="text"
                                    placeholder="AWS Secret Key"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "ingestion",
                                            "destinationConfig",
                                            "aws_secret_key",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        <h3 className="font-semibold">Schedule (Cron)</h3>
                        <input
                            placeholder="Cron (e.g. 0 * * * *)"
                            value={formData.ingestion.cron}
                            onChange={(e) =>
                                handleChange(
                                    "ingestion",
                                    "cron",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                {active === "transformation" && (
                    <div className="space-y-3">
                        <h2 className="font-bold text-xl">
                            Transformation Pipeline
                        </h2>
                        <input
                            placeholder="Pipeline Name"
                            value={formData.transformation.pipeline_name}
                            onChange={(e) =>
                                handleChange(
                                    "transformation",
                                    "pipeline_name",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="SQL or Pandas logic"
                            value={formData.transformation.transformationLogic}
                            onChange={(e) =>
                                handleChange(
                                    "transformation",
                                    "transformationLogic",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded h-32"
                        />
                    </div>
                )}

                {active === "enrichment" && (
                    <div className="space-y-3">
                        <h2 className="font-bold text-xl">
                            Enrichment Pipeline
                        </h2>
                        <input
                            placeholder="Pipeline Name"
                            value={formData.enrichment.pipeline_name}
                            onChange={(e) =>
                                handleChange(
                                    "enrichment",
                                    "pipeline_name",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Enrichment API"
                            value={formData.enrichment.enrichmentApi}
                            onChange={(e) =>
                                handleChange(
                                    "enrichment",
                                    "enrichmentApi",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="API Key"
                            value={formData.enrichment.apiKey}
                            onChange={(e) =>
                                handleChange(
                                    "enrichment",
                                    "apiKey",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                {active === "monitoring" && (
                    <div className="space-y-3">
                        <h2 className="font-bold text-xl">
                            Monitoring Pipeline
                        </h2>
                        <input
                            placeholder="Pipeline Name"
                            value={formData.monitoring.pipeline_name}
                            onChange={(e) =>
                                handleChange(
                                    "monitoring",
                                    "pipeline_name",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Metric (row_count, latency)"
                            value={formData.monitoring.metric}
                            onChange={(e) =>
                                handleChange(
                                    "monitoring",
                                    "metric",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Alert Email"
                            value={formData.monitoring.alertEmail}
                            onChange={(e) =>
                                handleChange(
                                    "monitoring",
                                    "alertEmail",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-emerald-800 text-white px-4 py-2 rounded"
                >
                    Save {active} Pipeline
                </button>
            </div>

            {/* Result Preview */}
            <div>
                <h2></h2>
                <h3>Result Preview</h3>
                <ul>
                    {Array.isArray(resultPreview) &&
                        resultPreview.map((item, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFeatures.includes(
                                        JSON.stringify(item)
                                    )}
                                    onChange={() =>
                                        toggleFeature(JSON.stringify(item))
                                    }
                                />
                                <span>{JSON.stringify(item)}</span>
                            </label>
                        ))}
                </ul>
            </div>
        </div>
    );
}
