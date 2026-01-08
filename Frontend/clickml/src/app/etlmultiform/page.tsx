"use client";
import { useState } from "react";
import {
    Database,
    FileText,
    Activity,
    LayoutList,
    ChevronRight,
    Play,
} from "lucide-react";

export default function PipelineWizard() {
    const [active, setActive] = useState("ingestion");
    const [resultPreview, setResultPreview] = useState<
        Record<string, unknown>[]
    >([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const scenarios = [
        { id: "ingestion", label: "Ingestion", icon: Database },
        { id: "transformation", label: "Transformation", icon: LayoutList },
        { id: "enrichment", label: "Enrichment", icon: FileText },
        { id: "monitoring", label: "Monitoring", icon: Activity },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (scenario: string, field: string, value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({
            ...prev,
            [scenario]: { ...prev[scenario], [field]: value },
        }));
    };

    const handleSubmit = () => {
        const payload = { scenario: active, ...formData[active] };

        fetch("http://localhost:3002/etl/validateData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                const normalized = Array.isArray(data) ? data : [data];
                setResultPreview(normalized);
                alert("Pipeline submitted successfully!");
            })
            .catch((error) => {
                console.error("Error submitting pipeline:", error);
                alert("Error submitting pipeline");
            });
    };

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    ETL Pipeline Wizard
                </h1>
                <p className="text-gray-400">
                    Create complex multi-stage pipelines in a single flow.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-[#111111] border border-[#333333] rounded-xl p-2 space-y-1">
                        {scenarios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActive(s.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                    active === s.id
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-400 hover:bg-[#222222] hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <s.icon className="w-4 h-4" />
                                    {s.label}
                                </div>
                                {active === s.id && (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 space-y-6">
                    <div className="bg-[#111111] border border-[#333333] rounded-xl p-8 space-y-6 min-h-[500px]">
                        {active === "ingestion" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-semibold text-white border-b border-[#333333] pb-4 mb-6">
                                    Ingestion Configuration
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>
                                            Pipeline Name
                                        </label>
                                        <input
                                            value={
                                                formData.ingestion.pipeline_name
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "ingestion",
                                                    "pipeline_name",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClasses}
                                            placeholder="Ingestion Pipeline Name"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>
                                            Cron Schedule
                                        </label>
                                        <input
                                            value={formData.ingestion.cron}
                                            onChange={(e) =>
                                                handleChange(
                                                    "ingestion",
                                                    "cron",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClasses}
                                            placeholder="0 * * * *"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>
                                            Source Type
                                        </label>
                                        <select
                                            value={
                                                formData.ingestion.sourceType
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "ingestion",
                                                    "sourceType",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClasses}
                                        >
                                            <option value="">
                                                Select Source
                                            </option>
                                            <option value="postgres">
                                                Postgres
                                            </option>
                                            <option value="api">API</option>
                                            <option value="s3">S3</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>
                                            Destination Type
                                        </label>
                                        <select
                                            value={
                                                formData.ingestion
                                                    .destinationType
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "ingestion",
                                                    "destinationType",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClasses}
                                        >
                                            <option value="">
                                                Select Destination
                                            </option>
                                            <option value="postgres">
                                                Postgres
                                            </option>
                                            <option value="s3">S3</option>
                                        </select>
                                    </div>
                                </div>

                                {(formData.ingestion.sourceType ===
                                    "postgres" ||
                                    formData.ingestion.sourceType === "api" ||
                                    formData.ingestion.sourceType === "s3") && (
                                    <div className="p-4 bg-[#0a0a0a] border border-[#333333] rounded-lg mt-4">
                                        <p className="text-sm text-gray-500 italic text-center">
                                            Specific configuration fields not
                                            fully replicated for brevity in
                                            wizard view. (Use main Ingestion
                                            page for full details)
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {active === "transformation" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-semibold text-white border-b border-[#333333] pb-4 mb-6">
                                    Transformation Logic
                                </h2>
                                <input
                                    value={
                                        formData.transformation.pipeline_name
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "transformation",
                                            "pipeline_name",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                    placeholder="Pipeline Name"
                                />
                                <textarea
                                    value={
                                        formData.transformation
                                            .transformationLogic
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "transformation",
                                            "transformationLogic",
                                            e.target.value
                                        )
                                    }
                                    className={`${inputClasses} h-48 font-mono`}
                                    placeholder="SELECT * FROM table..."
                                />
                            </div>
                        )}

                        {active === "enrichment" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-semibold text-white border-b border-[#333333] pb-4 mb-6">
                                    Enrichment Sources
                                </h2>
                                <input
                                    value={formData.enrichment.pipeline_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "enrichment",
                                            "pipeline_name",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                    placeholder="Pipeline Name"
                                />
                                <input
                                    value={formData.enrichment.enrichmentApi}
                                    onChange={(e) =>
                                        handleChange(
                                            "enrichment",
                                            "enrichmentApi",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                    placeholder="API Endpoint"
                                />
                            </div>
                        )}

                        {active === "monitoring" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-semibold text-white border-b border-[#333333] pb-4 mb-6">
                                    Monitoring & Alerts
                                </h2>
                                <input
                                    value={formData.monitoring.pipeline_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "monitoring",
                                            "pipeline_name",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                    placeholder="Pipeline Name"
                                />
                                <input
                                    value={formData.monitoring.metric}
                                    onChange={(e) =>
                                        handleChange(
                                            "monitoring",
                                            "metric",
                                            e.target.value
                                        )
                                    }
                                    className={inputClasses}
                                    placeholder="Metric to Track"
                                />
                            </div>
                        )}

                        <div className="pt-6 border-t border-[#333333] flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Run{" "}
                                {active.charAt(0).toUpperCase() +
                                    active.slice(1)}{" "}
                                Step
                            </button>
                        </div>
                    </div>

                    {resultPreview.length > 0 && (
                        <div className="bg-[#111111] border border-[#333333] rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">
                                Result Preview
                            </h3>
                            <div className="h-64 overflow-y-auto bg-[#0a0a0a] rounded-lg p-4 font-mono text-sm text-gray-300 border border-[#333333]">
                                {resultPreview.map((item, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 pb-2 border-b border-[#333333] last:border-0 last:mb-0 last:pb-0"
                                    >
                                        <div className="flex items-start gap-2">
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded border-gray-600 bg-[#222222]"
                                            />
                                            <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(item, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
