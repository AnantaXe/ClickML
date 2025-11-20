"use client";
import React, { useState, useCallback, useReducer } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import { updateModelDataSourceState } from "@/redux/Model_Config/SourceSlices/SourceSlices";
import {
    updateLinearRegressionConfig,
    resetLinearRegressionConfig,
} from "@/redux/Model_Config/LinearRegressionSlices/LRSlices";

interface ModelState {
    fitIntercept: boolean;
    copyX: boolean;
    // regularization: Regularization;
    // regStrength: number;
    // randomState: number | "";
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
    // regularization: "none",
    // regStrength: 1.0,
    // randomState: "",
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
    const [open, setOpen] = useState(false);
    const [targetColumn, setTargetColumn] = useState("");
    const [featureColumns, setFeatureColumns] = useState("");
    /* ---------- handlers ---------- */

    const setField = useCallback(
        <K extends keyof ModelState>(key: K, value: ModelState[K]) => {
            localDispatch({ type: "SET", key, value });
        },
        []
    );

    const handleFeatureColumnsChange = useCallback(
        (v: string) => {
            // normalize whitespace and commas
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

    // const clampTestSize = useCallback((v: number) => {
    //     if (Number.isNaN(v)) return 0.2;
    //     return Math.max(0, Math.min(1, v));
    // }, []);

    const handleTrain = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault?.();

            // validate minimal constraints

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
                        mode: "cors", // optional
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) {
                    const text = await res.text().catch(() => null);
                    console.error("Server error:", res.status, text);
                    alert(`Server returned ${res.status}`);
                    return;
                }

                setModelResponse(await res.json().catch(() => null));
                console.log("Training response:", modelResponse);
                // do UI updates, notify user, etc.
            } catch (err) {
                console.error("Network / fetch error:", err);
                alert(
                    "Network or CORS error — check console and server CORS settings."
                );
            }
        },
        [
            dispatch,
            state,
            parseFeatureColumns,
            modelResponse,
            targetColumn,
            modelDataSource,
            modelName,
        ]
    );

    const handleReset = useCallback(() => {
        localDispatch({ type: "RESET" });
        dispatch(resetLinearRegressionConfig());
    }, [dispatch]);

    /* ---------- render ---------- */

    return (
        <form onSubmit={handleTrain} className="space-y-3 flex flex-col">
            {/* Ingestion / Pipeline section (kept from original) */}
            <div className="space-y-3">
                <input
                    placeholder="Model Name"
                    value={modelName}
                    onChange={(e) => {
                        setModelName(e.target.value);
                    }}
                    className="border p-2 rounded"
                />
                <h3 className="font-semibold">Data Source</h3>
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
                    className="border p-2 rounded"
                    aria-label="Source Type"
                >
                    <option value="">Select Source</option>
                    <option value="postgres">Postgres SQL</option>
                    <option value="api">API</option>
                </select>
            </div>

            {/* Source-specific fields (unchanged behavior) */}
            {modelDataSource.sourceType === "postgres" && (
                <div className="flex flex-col space-y-2 border p-3 rounded">
                    <input
                        type="text"
                        required
                        // pattern="https?://.+"
                        placeholder="Host"
                        value={String(modelDataSource.sourceDetails.host ?? "")}
                        // onInvalid={(e) =>
                        //     (e.target as HTMLInputElement).setCustomValidity(
                        //         "Please enter a valid URL starting with http:// or https://"
                        //     )
                        // }
                        // onInput={(e) =>
                        //     (e.target as HTMLInputElement).setCustomValidity("")
                        // }
                        onChange={(e) => {
                            dispatch(
                                updateModelDataSourceState({
                                    ...modelDataSource,
                                    sourceDetails: {
                                        ...modelDataSource.sourceDetails,
                                        host: e.target.value,
                                    },
                                })
                            );
                        }}
                        className="border p-2 rounded"
                    />
                    <input
                        placeholder="Database"
                        value={String(
                            modelDataSource.sourceDetails.database ?? ""
                        )}
                        onChange={(e) => {
                            dispatch(
                                updateModelDataSourceState({
                                    ...modelDataSource,
                                    sourceDetails: {
                                        ...modelDataSource.sourceDetails,
                                        database: e.target.value,
                                    },
                                })
                            );
                        }}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
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
                        className="border p-2 rounded"
                    />
                    <input
                        placeholder="User"
                        value={String(modelDataSource.sourceDetails.user ?? "")}
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
                        className="border p-2 rounded"
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
                        className="border p-2 rounded"
                    />
                </div>
            )}

            {modelDataSource.sourceType === "api" && (
                <div className="flex flex-col space-y-2 border p-3 rounded">
                    <input
                        type="url"
                        pattern="https?://.+"
                        required={true}
                        placeholder="API URL"
                        value={String(
                            modelDataSource.sourceDetails.apiUrl ?? ""
                        )}
                        onChange={(e) => {
                            dispatch(
                                updateModelDataSourceState({
                                    ...modelDataSource,
                                    sourceDetails: {
                                        ...modelDataSource.sourceDetails,
                                        apiUrl: e.target.value,
                                    },
                                })
                            );
                        }}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
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
                        className="border p-2 rounded"
                    />
                </div>
            )}

            {/* Model configuration */}
            <div className="border p-3 rounded space-y-3 transition-all">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-lg">
                        Model Configuration
                    </h3>
                    {open ? (
                        <ChevronUp className="w-5 h-5 transition-transform" />
                    ) : (
                        <ChevronDown className="w-5 h-5 transition-transform" />
                    )}
                </div>
                <div
                    className={`transition-all flex-col flex overflow-hidden gap-3 ${
                        open
                            ? "max-h-[1000px] opacity-100 mt-3"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <label className="block">
                        <span className="text-sm">Target Column</span>
                        <input
                            placeholder="Target Column"
                            value={targetColumn}
                            onChange={(e) => {
                                setTargetColumn(e.target.value);
                            }}
                            className="border p-2 rounded w-full mt-1"
                            aria-label="Target Column"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm">
                            Feature Columns (comma separated)
                        </span>
                        <input
                            placeholder="col1, col2, col3"
                            value={featureColumns}
                            onChange={(e) => {
                                handleFeatureColumnsChange(e.target.value);
                                setFeatureColumns(e.target.value);
                            }}
                            className="border p-2 rounded w-full mt-1"
                            aria-label="Feature Columns"
                        />
                    </label>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={state.fitIntercept}
                                onChange={(e) =>
                                    setField("fitIntercept", e.target.checked)
                                }
                                className="rounded"
                            />
                            <span>Fit Intercept</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={state.copyX}
                                onChange={(e) =>
                                    setField("copyX", e.target.checked)
                                }
                                className="rounded"
                            />
                            <span>Copy X</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">nJobs</label>
                        <input
                            type="number"
                            placeholder="null (auto) or -1 for all cores"
                            value={
                                state.nJobs === null ? "" : String(state.nJobs)
                            }
                            onChange={(e) =>
                                setField(
                                    "nJobs",
                                    e.target.value === ""
                                        ? null
                                        : parseInt(e.target.value, 10)
                                )
                            }
                            className="border p-2 rounded w-36"
                            aria-label="nJobs"
                        />
                        <span className="text-sm text-gray-500">
                            parallel jobs
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-700 text-white p-3 px-4 rounded cursor-pointer hover:bg-gray-800"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="bg-green-800 text-white py-3 px-5 rounded cursor-pointer hover:bg-green-900"
                        >
                            Train Model
                        </button>
                    </div>
                    <div>
                        {modelResponse && (
                            <pre>{JSON.stringify(modelResponse, null, 2)}</pre>
                        )}
                    </div>
                    <div className="text-sm text-gray-600">
                        Note: In this component `Save` updates the Linear
                        Regression Redux slice (fitIntercept, normalize, copyX,
                        nJobs). Replace the console.log in
                        <code>handleTrain</code> with your server/parent submit
                        action to send the full model + ingestion payload.
                    </div>
                </div>
            </div>
        </form>
    );
}
