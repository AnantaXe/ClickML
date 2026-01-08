"use client";
import React, { useCallback, useReducer, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    ChevronDown,
    ChevronUp,
    Play,
    RotateCcw,
    Database,
    Settings,
} from "lucide-react";
import {
    updateModelDataSourceState,
    resetModelDataSourceState,
} from "@/redux/Model_Config/SourceSlices/SourceSlices";
import {
    updateDecisionTreeRegressorConfig,
    resetDecisionTreeRegressorConfig,
} from "@/redux/Model_Config/DecisionTreeRegressorSlices/DTRSlices";

type MaxFeatures = "auto" | "sqrt" | "log2" | null;

interface DecisionTreeRegressorState {
    criterion: string;
    splitter: string;
    maxDepth: number | null;
    minSamplesSplit: number;
    minSamplesLeaf: number;
    maxFeatures: MaxFeatures;
}

type Action =
    | {
          type: "SET";
          key: keyof DecisionTreeRegressorState;
          value: DecisionTreeRegressorState[keyof DecisionTreeRegressorState];
      }
    | { type: "RESET"; payload?: Partial<DecisionTreeRegressorState> };

const initialDecisionTreeRegressorState: DecisionTreeRegressorState = {
    criterion: "squared_error",
    splitter: "best",
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
};

function reducer(
    state: DecisionTreeRegressorState,
    action: Action
): DecisionTreeRegressorState {
    switch (action.type) {
        case "SET":
            return {
                ...state,
                [action.key]: action.value,
            } as DecisionTreeRegressorState;
        case "RESET":
            return { ...initialDecisionTreeRegressorState, ...action.payload };
        default:
            return state;
    }
}

export default function DecisionTreeRegressorForm() {
    const dispatch = useAppDispatch();
    const modelDataSource = useAppSelector((s) => s.modelDataSourceConfig);

    const [open, setOpen] = useState(true);
    const [modelName, setModelName] = useState("");
    const [state, localDispatch] = useReducer(
        reducer,
        initialDecisionTreeRegressorState
    );

    const setField = useCallback(
        <K extends keyof DecisionTreeRegressorState>(
            key: K,
            value: DecisionTreeRegressorState[K]
        ) => {
            localDispatch({ type: "SET", key, value });
        },
        []
    );

    const parseNullableNumber = useCallback((val: string) => {
        if (val === "" || val.toLowerCase() === "null") return null;
        const n = parseInt(val, 10);
        return Number.isNaN(n) ? null : n;
    }, []);

    const handleSave = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault?.();
            dispatch(updateDecisionTreeRegressorConfig(state));
            // Example submission...
            alert(
                "Configuration saved (Redux updated). Ready for training call."
            );
        },
        [dispatch, state]
    );

    const handleReset = useCallback(() => {
        localDispatch({ type: "RESET" });
        dispatch(resetDecisionTreeRegressorConfig());
        dispatch(resetModelDataSourceState());
        setModelName("");
    }, [dispatch]);

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";
    const sectionClasses =
        "bg-[#0a0a0a]/50 border border-[#333333] rounded-lg p-4 space-y-4";

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className={sectionClasses}>
                <div>
                    <label className={labelClasses}>Model Name</label>
                    <input
                        placeholder="e.g. House Price Estimator"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>
                        <Database className="w-4 h-4 inline mr-2" />
                        Data Source
                    </label>
                    <select
                        value={modelDataSource.sourceType}
                        onChange={(e) => {
                            dispatch(
                                updateModelDataSourceState({
                                    ...modelDataSource,
                                    sourceType: e.target.value,
                                })
                            );
                        }}
                        className={inputClasses}
                    >
                        <option value="">Select Source</option>
                        <option value="postgres">Postgres SQL</option>
                        <option value="api">API</option>
                    </select>
                </div>

                {/* Simplified Source Fields (Reuse generic logic or full fields if needed) */}
                {modelDataSource.sourceType === "postgres" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <input
                            placeholder="Host"
                            value={String(
                                modelDataSource.sourceDetails.host ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            host: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            placeholder="Database"
                            value={String(
                                modelDataSource.sourceDetails.database ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            database: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        {/* Other DB fields... */}
                    </div>
                )}
            </div>

            <div className="border border-[#333333] rounded-lg overflow-hidden">
                <div
                    className="flex justify-between items-center p-4 bg-[#1a1a1a] cursor-pointer select-none hover:bg-[#222222] transition-colors"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Decision Tree Parameters
                    </h3>
                    {open ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>

                {open && (
                    <div className="p-4 space-y-4 bg-[#111111]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>
                                    Criterion
                                </label>
                                <select
                                    value={state.criterion}
                                    onChange={(e) =>
                                        setField("criterion", e.target.value)
                                    }
                                    className={inputClasses}
                                >
                                    <option value="squared_error">
                                        squared_error
                                    </option>
                                    <option value="friedman_mse">
                                        friedman_mse
                                    </option>
                                    <option value="absolute_error">
                                        absolute_error
                                    </option>
                                    <option value="poisson">poisson</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Splitter</label>
                                <select
                                    value={state.splitter}
                                    onChange={(e) =>
                                        setField("splitter", e.target.value)
                                    }
                                    className={inputClasses}
                                >
                                    <option value="best">best</option>
                                    <option value="random">random</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClasses}>
                                    Max Depth
                                </label>
                                <input
                                    type="number"
                                    placeholder="null (unlimited)"
                                    value={
                                        state.maxDepth === null
                                            ? ""
                                            : String(state.maxDepth)
                                    }
                                    onChange={(e) =>
                                        setField(
                                            "maxDepth",
                                            parseNullableNumber(e.target.value)
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Min Samples Split
                                </label>
                                <input
                                    type="number"
                                    min={2}
                                    value={String(state.minSamplesSplit)}
                                    onChange={(e) =>
                                        setField(
                                            "minSamplesSplit",
                                            Math.max(
                                                2,
                                                parseInt(
                                                    e.target.value || "2",
                                                    10
                                                )
                                            )
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Min Samples Leaf
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={String(state.minSamplesLeaf)}
                                    onChange={(e) =>
                                        setField(
                                            "minSamplesLeaf",
                                            Math.max(
                                                1,
                                                parseInt(
                                                    e.target.value || "1",
                                                    10
                                                )
                                            )
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#222222] text-gray-300 hover:bg-[#333333] hover:text-white transition-all border border-[#333333]"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </button>
                <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Train Decision Tree Regressor
                </button>
            </div>
        </form>
    );
}
