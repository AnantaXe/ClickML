"use client";
import { useState } from "react";
import { Activity, Bell, Clock, AlertTriangle } from "lucide-react";

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

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses =
        "block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Data Monitoring
                </h1>
                <p className="text-gray-400">
                    Set up alerts and tracking for your data pipelines.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 space-y-6">
                    <div>
                        <label className={labelClasses}>Pipeline Name</label>
                        <input
                            name="pipeline_name"
                            placeholder="e.g. Critical Error Monitor"
                            value={form.pipeline_name}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>Target System</label>
                        <select
                            name="targetType"
                            value={form.targetType}
                            onChange={(e) =>
                                setForm({ ...form, targetType: e.target.value })
                            }
                            className={inputClasses}
                        >
                            <option value="">Select Target</option>
                            <option value="postgres">Postgres Database</option>
                            <option value="api">REST API</option>
                        </select>
                    </div>

                    {form.targetType === "postgres" && (
                        <div className="space-y-4 p-4 border border-[#333333] border-dashed rounded-lg bg-[#0a0a0a]/50">
                            <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">
                                Postgres Target
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>
                                <Activity className="w-4 h-4" />
                                Metric to Monitor
                            </label>
                            <input
                                name="metric"
                                placeholder="e.g. row_count, latency, null_check"
                                value={form.metric}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <Bell className="w-4 h-4" />
                                Alert Email
                            </label>
                            <input
                                name="alertEmail"
                                placeholder="admin@example.com"
                                value={form.alertEmail}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            <Clock className="w-4 h-4" />
                            Check Frequency (Cron)
                        </label>
                        <input
                            name="cron"
                            placeholder="e.g. */10 * * * *"
                            value={form.cron}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-900/20">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Create Monitor
                    </button>
                </div>
            </form>
        </div>
    );
}
