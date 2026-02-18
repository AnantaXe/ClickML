"use client";

import { useState } from "react";
import SavedDataPipelines from "./saved";
import NewDataPipeline from "./new";
import { PlusCircle, LayoutList } from "lucide-react";

export default function DataPipeline() {
    const [activeTab, setActiveTab] = useState<"new" | "saved">("new");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Data Pipeline
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Manage and create your ETL workflows.
                    </p>
                </div>

                <div className="flex bg-[#111111] p-1 rounded-lg border border-[#333333]">
                    <button
                        onClick={() => setActiveTab("new")}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === "new"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-[#222222]"
                        }`}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Pipeline
                    </button>
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === "saved"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-[#222222]"
                        }`}
                    >
                        <LayoutList className="w-4 h-4 mr-2" />
                        Saved Pipelines
                    </button>
                </div>
            </div>

            <div className="bg-[#111111] rounded-xl border border-[#333333] p-6 min-h-[600px]">
                {activeTab === "new" ? (
                    <NewDataPipeline />
                ) : (
                    <SavedDataPipelines />
                )}
            </div>
        </div>
    );
}
