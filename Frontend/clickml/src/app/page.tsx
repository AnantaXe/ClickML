"use client";

import { Activity, Database, Server, Users } from "lucide-react";
import Link from "next/link";

const stats = [
    {
        name: "Total Pipelines",
        value: "12",
        icon: Activity,
        change: "+2.5%",
        changeType: "positive",
    },
    {
        name: "Active Models",
        value: "4",
        icon: Server,
        change: "+10%",
        changeType: "positive",
    },
    {
        name: "Data Sources",
        value: "8",
        icon: Database,
        change: "0%",
        changeType: "neutral",
    },
    {
        name: "Team Members",
        value: "24",
        icon: Users,
        change: "-1",
        changeType: "negative",
    },
];

export default function Home() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Overview of your ML workflows and infrastructure.
                    </p>
                </div>
                <Link href="/datapipeline">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        New Pipeline
                    </button>
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="p-6 bg-[#111111] border border-[#333333] rounded-xl hover:border-gray-600 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400">
                                {stat.name}
                            </span>
                            <stat.icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-bold text-white">
                                {stat.value}
                            </span>
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    stat.changeType === "positive"
                                        ? "bg-green-500/10 text-green-400"
                                        : stat.changeType === "negative"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-gray-500/10 text-gray-400"
                                }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 bg-[#111111] border border-[#333333] rounded-xl">
                    <h3 className="text-lg font-medium text-white mb-4">
                        Pipeline Activity
                    </h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#333333] rounded-lg">
                        <span className="text-gray-500">
                            Activity Chart Placeholder
                        </span>
                    </div>
                </div>

                <div className="col-span-3 p-6 bg-[#111111] border border-[#333333] rounded-xl">
                    <h3 className="text-lg font-medium text-white mb-4">
                        Recent Runs
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            i % 2 === 0
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    />
                                    <span className="text-sm text-gray-300">
                                        Pipeline_Execution_{i}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    2h ago
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
