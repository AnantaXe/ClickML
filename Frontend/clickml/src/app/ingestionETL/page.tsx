"use client";

import { useState } from "react";
import { Database, Clock, Play } from "lucide-react";

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

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses =
        "block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Data Ingestion
                </h1>
                <p className="text-gray-400">
                    Configure and schedule your data ingestion pipelines from
                    various sources.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 space-y-6">
                    <div>
                        <label className={labelClasses}>Pipeline Name</label>
                        <input
                            name="pipeline_name"
                            placeholder="e.g. Daily User Logs Ingestion"
                            value={form.pipeline_name}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>
                                <Database className="w-4 h-4" />
                                Source Type
                            </label>
                            <select
                                name="sourceType"
                                value={form.sourceType}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sourceType: e.target.value,
                                    })
                                }
                                className={inputClasses}
                            >
                                <option value="">Select Source Type</option>
                                <option value="postgres">
                                    Postgres Database
                                </option>
                                <option value="s3">AWS S3</option>
                                <option value="api">REST API</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional fields for Postgres */}
                    {form.sourceType === "postgres" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                Postgres Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Host (e.g. localhost)"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "host",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Port (e.g. 5432)"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "port",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Database Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "database",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Username"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "user",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
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
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    )}

                    {/* Conditional fields for API */}
                    {form.sourceType === "api" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                API Configuration
                            </h3>
                            <input
                                placeholder="API Endpoint URL"
                                onChange={(e) =>
                                    handleNestedChange(
                                        "sourceConfig",
                                        "endpoint",
                                        e.target.value
                                    )
                                }
                                className={inputClasses}
                            />
                            <input
                                placeholder="API Key (Optional)"
                                onChange={(e) =>
                                    handleNestedChange(
                                        "sourceConfig",
                                        "apiKey",
                                        e.target.value
                                    )
                                }
                                className={inputClasses}
                            />
                        </div>
                    )}

                    {/* Conditional fields for S3 */}
                    {form.sourceType === "s3" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                AWS S3 Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Bucket Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "bucket",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Region (e.g. us-east-1)"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "region",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Access Key ID"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "accessKey",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Secret Access Key"
                                    type="password"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "sourceConfig",
                                            "secretKey",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={labelClasses}>
                            <Clock className="w-4 h-4" />
                            Schedule (Cron Expression)
                        </label>
                        <input
                            name="cron"
                            placeholder="e.g. 0 2 * * *"
                            value={form.cron}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Define when this pipeline should run. Defaults to 2
                            AM daily.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20">
                        <Play className="w-4 h-4 mr-2" />
                        Create Pipeline
                    </button>
                </div>
            </form>
        </div>
    );
}
