"use client";
import { useState } from "react";
import { Terminal, Key, Link2, Clock, Play } from "lucide-react";

export default function EnrichmentForm() {
    const [form, setForm] = useState({
        pipeline_name: "",
        enrichmentApi: "",
        apiKey: "",
        joinField: "",
        cron: "0 */6 * * *",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify({ scenario: "enrichment", ...form }, null, 2));
    };

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses =
        "block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Data Enrichment
                </h1>
                <p className="text-gray-400">
                    Enhance your datasets by connecting to external enrichment
                    APIs.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 space-y-6">
                    <div>
                        <label className={labelClasses}>Pipeline Name</label>
                        <input
                            name="pipeline_name"
                            placeholder="e.g. Customer Data Enrichment"
                            value={form.pipeline_name}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>
                                <Terminal className="w-4 h-4" />
                                Enrichment API Endpoint
                            </label>
                            <input
                                placeholder="https://api.enrichment.com/v1/..."
                                name="enrichmentApi"
                                value={form.enrichmentApi}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <Key className="w-4 h-4" />
                                API Key
                            </label>
                            <input
                                placeholder="Your Secure API Key"
                                name="apiKey"
                                value={form.apiKey}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Link2 className="w-4 h-4" />
                            Join Field
                        </label>
                        <input
                            placeholder="e.g. email_address, user_id"
                            name="joinField"
                            value={form.joinField}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The field used to match your local data with the
                            external API.
                        </p>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Clock className="w-4 h-4" />
                            Schedule (Cron Expression)
                        </label>
                        <input
                            name="cron"
                            placeholder="e.g. 0 */6 * * *"
                            value={form.cron}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20">
                        <Play className="w-4 h-4 mr-2" />
                        Create Enrichment Job
                    </button>
                </div>
            </form>
        </div>
    );
}
