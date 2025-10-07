"use client";

import { useState } from "react";

export default function IngestionForm() {
    const [form, setForm] = useState({
        pipeline_name: "",
        cron: "0 2 * * *",
        sourceType: "",
        destinationType: "",
        // common
        sourceConfig: {} as Record<string, string>,
        destinationConfig: {} as Record<string, string>,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleNestedChange = (
        group: "sourceConfig" | "destinationConfig",
        field: string,
        value: string
    ) =>
        setForm((prev) => ({
            ...prev,
            [group]: { ...prev[group], [field]: value },
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { scenario: "ingestion", ...form };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/create-etl-pipeline`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Data Ingestion Pipeline</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="pipeline_name"
                    placeholder="Pipeline Name"
                    value={form.pipeline_name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <select
                    name="sourceType"
                    value={form.sourceType}
                    onChange={(e) =>
                        setForm({ ...form, sourceType: e.target.value })
                    }
                    className="w-full border rounded p-2"
                >
                    <option value="">Select Source Type</option>
                    <option value="postgres">Postgres</option>
                    <option value="s3">AWS S3</option>
                    <option value="api">REST API</option>
                </select>

                {/* Conditional fields for Postgres */}
                {form.sourceType === "postgres" && (
                    <div className="space-y-2 border p-3 rounded bg-gray-50">
                        <input
                            placeholder="Host"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "host",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Port"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "port",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Database"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
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
                                    "sourceConfig",
                                    "user",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "password",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                {/* Conditional fields for API */}
                {form.sourceType === "api" && (
                    <div className="space-y-2 border p-3 rounded bg-gray-50">
                        <input
                            placeholder="API Endpoint"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "endpoint",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="API Key (optional)"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "apiKey",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                {/* Conditional fields for S3 */}
                {form.sourceType === "s3" && (
                    <div className="space-y-2 border p-3 rounded bg-gray-50">
                        <input
                            placeholder="Bucket Name"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "bucket",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Region"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "region",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Access Key"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "accessKey",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Secret Key"
                            type="password"
                            onChange={(e) =>
                                handleNestedChange(
                                    "sourceConfig",
                                    "secretKey",
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>
                )}

                <input
                    name="cron"
                    placeholder="Cron (e.g. 0 2 * * *)"
                    value={form.cron}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Pipeline
                </button>
            </form>
        </div>
    );
}
