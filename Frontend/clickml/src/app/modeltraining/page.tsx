"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Activity,
    GitBranch,
    GitGraph,
    BarChart,
} from "lucide-react";
import {
    LinearRegressionForm,
    DecisionTreeRegressorForm,
    DecisionTreeClassifierForm,
    RandomForestClassifierForm,
    RandomForestRegressorForm,
} from "../components/Forms";

/*
 * NOTE: Using Lucide icons as placeholders for the original PNGs to ensure style consistency.
 * If original images are strictly required, they can be swapped back, but icons usually look cleaner in this theme.
 */

const models = [
    {
        name: "Linear Regression",
        icon: Activity,
        description: "Predict continuous values using linear relationships.",
    },
    {
        name: "Random Forest Classifier",
        icon: GitGraph,
        description: "Ensemble learning method for classification.",
    },
    {
        name: "Decision Tree Classifier",
        icon: GitBranch,
        description: "Classification based on decision rules.",
    },
    {
        name: "Random Forest Regressor",
        icon: BarChart,
        description: "Ensemble learning method for regression.",
    },
    {
        name: "Decision Tree Regressor",
        icon: GitBranch,
        description: "Regression based on decision rules.",
    },
];

export default function ModelTraining() {
    const [activeModel, setActiveModel] = useState<string | null>(null);

    const renderForm = () => {
        switch (activeModel) {
            case "Linear Regression":
                return <LinearRegressionForm />;
            case "Decision Tree Classifier":
                return <DecisionTreeClassifierForm />;
            case "Random Forest Classifier":
                return <RandomForestClassifierForm />;
            case "Random Forest Regressor":
                return <RandomForestRegressorForm />;
            case "Decision Tree Regressor":
                return <DecisionTreeRegressorForm />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 min-h-screen">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Model Training
                </h1>
                <p className="text-gray-400">
                    Select a model architecture to configure and train your
                    machine learning models.
                </p>
            </div>

            {activeModel ? (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <button
                        onClick={() => setActiveModel(null)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Models
                    </button>

                    <div className="bg-[#111111] border border-[#333333] rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333333] pb-4">
                            {activeModel}
                        </h2>
                        {renderForm()}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map((model) => (
                        <div
                            key={model.name}
                            onClick={() => setActiveModel(model.name)}
                            className="group bg-[#111111] border border-[#333333] p-8 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-[#1a1a1a] transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <model.icon className="w-24 h-24" />
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className="p-4 bg-[#222222] rounded-full group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600/20">
                                    <model.icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {model.name}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {model.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
