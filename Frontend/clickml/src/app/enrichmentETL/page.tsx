"use client";
import { useState } from "react";

export default function EnrichmentForm() {
    const [form, setForm] = useState({
        pipeline_name: "",
        cron: "0 */6 * * *",
        sourceType: "",
        sourceConfig: {} as Record<string, string>,
        enrichmentApi: "",
        apiKey: "",
        joinField: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleNestedChange = (field: string, value: string) =>
        setForm((prev) => ({
            ...prev,
            sourceConfig: { ...prev.sourceConfig, [field]: value },
        }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify({ scenario: "enrichment", ...form }, null, 2));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 space-y-3"
        >
            <h2 className="font-bold text-xl">Data Enrichment Pipeline</h2>
            <input
                name="pipeline_name"
                placeholder="Pipeline Name"
                value={form.pipeline_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                placeholder="Enrichment API Endpoint"
                name="enrichmentApi"
                value={form.enrichmentApi}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                placeholder="API Key"
                name="apiKey"
                value={form.apiKey}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />
            <input
                placeholder="Join Field"
                name="joinField"
                value={form.joinField}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                name="cron"
                placeholder="Cron (e.g. 0 */6 * * *)"
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
