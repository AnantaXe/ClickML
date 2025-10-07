"use client";
import { useState } from "react";

export default function MonitoringForm() {
    const [form, setForm] = useState({
        pipeline_name: "",
        cron: "*/10 * * * *",
        targetType: "",
        targetConfig: {} as Record<string, string>,
        metric: "",
        alertEmail: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleNestedChange = (field: string, value: string) =>
        setForm((prev) => ({
            ...prev,
            targetConfig: { ...prev.targetConfig, [field]: value },
        }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify({ scenario: "monitoring", ...form }, null, 2));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 space-y-3"
        >
            <h2 className="font-bold text-xl">Data Monitoring Pipeline</h2>
            <input
                name="pipeline_name"
                placeholder="Pipeline Name"
                value={form.pipeline_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <select
                name="targetType"
                value={form.targetType}
                onChange={(e) =>
                    setForm({ ...form, targetType: e.target.value })
                }
                className="w-full border p-2 rounded"
            >
                <option value="">Select Target</option>
                <option value="postgres">Postgres</option>
                <option value="api">API</option>
            </select>

            {form.targetType === "postgres" && (
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

            <input
                name="metric"
                placeholder="Metric (row_count, latency, null_check)"
                value={form.metric}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="alertEmail"
                placeholder="Alert Email"
                value={form.alertEmail}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                name="cron"
                placeholder="Cron (e.g. */10 * * * *)"
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
