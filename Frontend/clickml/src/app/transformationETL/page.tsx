"use client";
import { useState } from "react";
import { Database, Code, Clock, Play } from "lucide-react";

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

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses =
        "block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Data Transformation
                </h1>
                <p className="text-gray-400">
                    Apply SQL or Pandas-based transformations to your datasets.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 space-y-6">
                    <div>
                        <label className={labelClasses}>Pipeline Name</label>
                        <input
                            name="pipeline_name"
                            placeholder="e.g. Monthly Revenue Aggregation"
                            value={form.pipeline_name}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Database className="w-4 h-4" />
                            Source Type
                        </label>
                        <select
                            name="sourceType"
                            value={form.sourceType}
                            onChange={(e) =>
                                setForm({ ...form, sourceType: e.target.value })
                            }
                            className={inputClasses}
                        >
                            <option value="">Select Source</option>
                            <option value="postgres">Postgres Database</option>
                            <option value="s3">AWS S3</option>
                        </select>
                    </div>

                    {form.sourceType === "postgres" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                                Postgres Source
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Host"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "host",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="Database"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "database",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="User"
                                    onChange={(e) =>
                                        handleNestedChange(
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
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    )}

                    {form.sourceType === "s3" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                                S3 Source
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Bucket Name"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "bucket",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                />
                                <input
                                    placeholder="File Path / Prefix"
                                    onChange={(e) =>
                                        handleNestedChange(
                                            "path",
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
                            <Code className="w-4 h-4" />
                            Transformation Logic
                        </label>
                        <textarea
                            name="transformationLogic"
                            placeholder="SELECT * FROM table WHERE ..."
                            value={form.transformationLogic}
                            onChange={handleChange}
                            className={`${inputClasses} h-48 font-mono text-sm`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Supported: SQL (for DB sources) or Python/Pandas
                            script (for text sources).
                        </p>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Clock className="w-4 h-4" />
                            Schedule (Cron Expression)
                        </label>
                        <input
                            name="cron"
                            placeholder="e.g. 0 1 * * *"
                            value={form.cron}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-green-900/20">
                        <Play className="w-4 h-4 mr-2" />
                        Create Transformation
                    </button>
                </div>
            </form>
        </div>
    );
}
