"use client";
import React, { useState, useCallback, useReducer } from "react";
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
    updateLinearRegressionConfig,
    resetLinearRegressionConfig,
} from "@/redux/Model_Config/LinearRegressionSlices/LRSlices";

interface ModelState {
    fitIntercept: boolean;
    copyX: boolean;
    nJobs: number | null;
}

type Action =
    | {
          type: "SET";
          key: keyof ModelState;
          value: ModelState[keyof ModelState];
      }
    | { type: "RESET"; payload?: Partial<ModelState> };

const initialModelState: ModelState = {
    fitIntercept: true,
    copyX: true,
    nJobs: null,
};

function reducer(state: ModelState, action: Action): ModelState {
    switch (action.type) {
        case "SET":
            return { ...state, [action.key]: action.value } as ModelState;
        case "RESET":
            return { ...initialModelState, ...action.payload };
        default:
            return state;
    }
}

export default function LinearRegressionForm() {
    const dispatch = useAppDispatch();
    const [state, localDispatch] = useReducer(reducer, initialModelState);
    const modelDataSource = useAppSelector(
        (state) => state.modelDataSourceConfig
    );
    const [modelResponse, setModelResponse] = useState(null);
    const [modelName, setModelName] = React.useState("");
    const [open, setOpen] = useState(true);
    const [targetColumn, setTargetColumn] = useState("");
    const [featureColumns, setFeatureColumns] = useState("");

    const setField = useCallback(
        <K extends keyof ModelState>(key: K, value: ModelState[K]) => {
            localDispatch({ type: "SET", key, value });
        },
        []
    );

    const handleFeatureColumnsChange = useCallback(
        (v: string) => {
            const cleaned = v.replace(/\s*,\s*/g, ",").replace(/\s+/g, " ");
            setFeatureColumns(cleaned);
        },
        [setFeatureColumns]
    );

    const parseFeatureColumns = useCallback(() => {
        return featureColumns
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
    }, [featureColumns]);

    const handleTrain = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault?.();
            dispatch(
                updateLinearRegressionConfig({
                    fitIntercept: state.fitIntercept,
                    copyX: state.copyX,
                    nJobs: state.nJobs,
                })
            );

            const payload = {
                DBSource: {
                    modelDataSource,
                    features: {
                        targetf: targetColumn,
                        featuref: parseFeatureColumns(),
                    },
                },
                modelConfig: {
                    modelName,
                    modelParams: state,
                    modelType: "Linear Regression",
                },
            };

            console.log("Submitting training payload:", payload);

            try {
                const res = await fetch(
                    "http://localhost:8000/linear_regression",
                    {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) {
                    await res.text().catch(() => null);
                    alert(`Server returned ${res.status}`);
                    return;
                }

                setModelResponse(await res.json().catch(() => null));
            } catch (err) {
                console.error("Network / fetch error:", err);
                alert("Network or CORS error — check console.");
            }
        },
        [
            dispatch,
            state,
            parseFeatureColumns,
            targetColumn,
            modelDataSource,
            modelName,
        ]
    );

    const handleReset = useCallback(() => {
        localDispatch({ type: "RESET" });
        dispatch(resetLinearRegressionConfig());
        dispatch(resetModelDataSourceState());
        setModelName("");
        setTargetColumn("");
        setFeatureColumns("");
    }, [dispatch]);

    // Styles
    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-600";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";
    const sectionClasses =
        "bg-[#0a0a0a]/50 border border-[#333333] rounded-lg p-4 space-y-4";

    return (
        <form onSubmit={handleTrain} className="space-y-6">
            <div className={sectionClasses}>
                <div>
                    <label className={labelClasses}>Model Name</label>
                    <input
                        placeholder="e.g. Sales Predictor v1"
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

                {/* Source-specific fields */}
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
                        <input
                            placeholder="Table Name"
                            value={String(
                                modelDataSource.sourceDetails.tableName ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            tableName: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            placeholder="User"
                            value={String(
                                modelDataSource.sourceDetails.user ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            user: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={String(
                                modelDataSource.sourceDetails.password ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            password: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                    </div>
                )}

                {modelDataSource.sourceType === "api" && (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2">
                        <input
                            placeholder="API URL"
                            value={String(
                                modelDataSource.sourceDetails.apiUrl ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            apiUrl: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            placeholder="API Key"
                            value={String(
                                modelDataSource.sourceDetails.apiKey ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateModelDataSourceState({
                                        ...modelDataSource,
                                        sourceDetails: {
                                            ...modelDataSource.sourceDetails,
                                            apiKey: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                    </div>
                )}
            </div>

            {/* Model configuration */}
            <div className="border border-[#333333] rounded-lg overflow-hidden">
                <div
                    className="flex justify-between items-center p-4 bg-[#1a1a1a] cursor-pointer select-none hover:bg-[#222222] transition-colors"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Hyperparameters & Features
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
                                    Target Column
                                </label>
                                <input
                                    placeholder="e.g. price"
                                    value={targetColumn}
                                    onChange={(e) =>
                                        setTargetColumn(e.target.value)
                                    }
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    Feature Columns
                                </label>
                                <input
                                    placeholder="e.g. age, sqft, location"
                                    value={featureColumns}
                                    onChange={(e) => {
                                        handleFeatureColumnsChange(
                                            e.target.value
                                        );
                                        setFeatureColumns(e.target.value);
                                    }}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#333333]">
                            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={state.fitIntercept}
                                    onChange={(e) =>
                                        setField(
                                            "fitIntercept",
                                            e.target.checked
                                        )
                                    }
                                    className="rounded border-gray-600 bg-[#222222] text-blue-600 focus:ring-blue-600"
                                />
                                <span>Fit Intercept</span>
                            </label>

                            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={state.copyX}
                                    onChange={(e) =>
                                        setField("copyX", e.target.checked)
                                    }
                                    className="rounded border-gray-600 bg-[#222222] text-blue-600 focus:ring-blue-600"
                                />
                                <span>Copy X</span>
                            </label>
                        </div>

                        <div>
                            <label className={labelClasses}>
                                nJobs (Parallelism)
                            </label>
                            <input
                                type="number"
                                placeholder="null (auto) or -1 for all cores"
                                value={
                                    state.nJobs === null
                                        ? ""
                                        : String(state.nJobs)
                                }
                                onChange={(e) =>
                                    setField(
                                        "nJobs",
                                        e.target.value === ""
                                            ? null
                                            : parseInt(e.target.value, 10)
                                    )
                                }
                                className={inputClasses}
                            />
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
                    Train Linear Regression Model
                </button>
            </div>

            {modelResponse && (
                <div className="mt-6 p-4 bg-[#111111] border border-green-900/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">
                        Training Request Sent
                    </h4>
                    <pre className="text-xs text-gray-400 overflow-x-auto">
                        {JSON.stringify(modelResponse, null, 2)}
                    </pre>
                </div>
            )}
        </form>
    );
}
