"use client";
import { useState } from "react";

export default function TransformationForm() {
    const [form, setForm] = useState({
        pipeline_name: "",
        cron: "0 1 * * *",
        sourceType: "",
        sourceConfig: {} as Record<string, string>,
        transformationLogic: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleNestedChange = (field: string, value: string) =>
        setForm((prev) => ({
            ...prev,
            sourceConfig: { ...prev.sourceConfig, [field]: value },
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { scenario: "transformation", ...form };
        alert(JSON.stringify(payload, null, 2));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 max-w-xl mx-auto p-6"
        >
            <h2 className="font-bold text-xl">Data Transformation Pipeline</h2>
            <input
                name="pipeline_name"
                placeholder="Pipeline Name"
                value={form.pipeline_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <select
                name="sourceType"
                value={form.sourceType}
                onChange={(e) =>
                    setForm({ ...form, sourceType: e.target.value })
                }
                className="w-full border p-2 rounded"
            >
                <option value="">Select Source</option>
                <option value="postgres">Postgres</option>
                <option value="s3">S3</option>
            </select>

            {form.sourceType === "postgres" && (
                <div className="space-y-2 border p-3 rounded">
                    <input
                        placeholder="Host"
                        onChange={(e) =>
                            handleNestedChange("host", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                    <input
                        placeholder="Database"
                        onChange={(e) =>
                            handleNestedChange("database", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                    <input
                        placeholder="User"
                        onChange={(e) =>
                            handleNestedChange("user", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        onChange={(e) =>
                            handleNestedChange("password", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>
            )}

            {form.sourceType === "s3" && (
                <div className="space-y-2 border p-3 rounded">
                    <input
                        placeholder="Bucket"
                        onChange={(e) =>
                            handleNestedChange("bucket", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                    <input
                        placeholder="Path"
                        onChange={(e) =>
                            handleNestedChange("path", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>
            )}

            <textarea
                name="transformationLogic"
                placeholder="Write SQL or transformation code here"
                value={form.transformationLogic}
                onChange={handleChange}
                className="w-full border p-2 rounded h-32"
            />

            <input
                name="cron"
                placeholder="Cron (e.g. 0 1 * * *)"
                value={form.cron}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Create Pipeline
            </button>
        </form>
    );
}
