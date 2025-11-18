"use client";
import React, { useState, useCallback, useReducer } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    updateModelDataSourceState,
    resetModelDataSourceState,
} from "@/redux/Model_Config/SourceSlices/SourceSlices";
import {
    updateLinearRegressionConfig,
    resetLinearRegressionConfig,
} from "@/redux/Model_Config/LinearRegressionSlices/LRSlices";

type Regularization = "none" | "ridge" | "lasso";

interface ModelState {
    targetColumn: string;
    featureColumns: string; // comma separated in UI
    testSize: number;
    fitIntercept: boolean;
    normalize: boolean;
    copyX: boolean;
    regularization: Regularization;
    regStrength: number;
    randomState: number | "";
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
    targetColumn: "",
    featureColumns: "",
    testSize: 0.2,
    fitIntercept: true,
    normalize: false,
    copyX: true,
    regularization: "none",
    regStrength: 1.0,
    randomState: "",
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
    const [modelName, setModelName] = React.useState("");
    const [open, setOpen] = useState(false);
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
            setField("featureColumns", cleaned);
        },
        [setField]
    );

    const parseFeatureColumns = useCallback(() => {
        return state.featureColumns
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
    }, [state.featureColumns]);

    const clampTestSize = useCallback((v: number) => {
        if (Number.isNaN(v)) return 0.2;
        return Math.max(0, Math.min(1, v));
    }, []);

    const handleTrain = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault?.();

            // validate minimal constraints
            if (state.testSize < 0 || state.testSize > 1) {
                alert("Test size must be between 0 and 1");
                return;
            }
            if (state.regStrength < 0) {
                alert("Regularization strength must be >= 0");
                return;
            }

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
                        targetf: state.targetColumn,
                        featuref: parseFeatureColumns(),
                    },
                },
                modelConfig: {
                    modelName,
                    modelParams: state,
                    modelType: "Linear Regression",
                },
            };

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

                const data = await res.json().catch(() => null);
                console.log("Training response:", data);
                // do UI updates, notify user, etc.
            } catch (err) {
                console.error("Network / fetch error:", err);
                alert(
                    "Network or CORS error — check console and server CORS settings."
                );
            }
        },
        [dispatch, state, parseFeatureColumns, modelDataSource, modelName]
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
                        type="url"
                        required
                        pattern="https?://.+"
                        placeholder="Host"
                        value={String(modelDataSource.sourceDetails.host ?? "")}
                        onInvalid={(e) =>
                            (e.target as HTMLInputElement).setCustomValidity(
                                "Please enter a valid URL starting with http:// or https://"
                            )
                        }
                        onInput={(e) =>
                            (e.target as HTMLInputElement).setCustomValidity("")
                        }
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
                            value={state.targetColumn}
                            onChange={(e) =>
                                setField("targetColumn", e.target.value)
                            }
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
                            value={state.featureColumns}
                            onChange={(e) =>
                                handleFeatureColumnsChange(e.target.value)
                            }
                            className="border p-2 rounded w-full mt-1"
                            aria-label="Feature Columns"
                        />
                    </label>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[90px]">Test Size</label>
                        <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={1}
                            value={state.testSize}
                            onChange={(e) =>
                                setField(
                                    "testSize",
                                    clampTestSize(parseFloat(e.target.value))
                                )
                            }
                            className="border p-2 rounded w-28"
                            aria-label="Test Size"
                        />
                        <span className="text-sm text-gray-500">
                            fraction (0 to 1)
                        </span>
                    </div>

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
                        <label className="min-w-[120px]">Regularization</label>
                        <select
                            value={state.regularization}
                            onChange={(e) =>
                                setField(
                                    "regularization",
                                    e.target.value as Regularization
                                )
                            }
                            className="border p-2 rounded"
                        >
                            <option value="none">None (OLS)</option>
                            <option value="ridge">Ridge (L2)</option>
                            <option value="lasso">Lasso (L1)</option>
                        </select>

                        {state.regularization !== "none" && (
                            <input
                                type="number"
                                min={0}
                                step="0.1"
                                value={state.regStrength}
                                onChange={(e) =>
                                    setField(
                                        "regStrength",
                                        Math.max(
                                            0,
                                            parseFloat(e.target.value) || 0
                                        )
                                    )
                                }
                                className="border p-2 rounded w-32"
                                placeholder="Alpha"
                                aria-label="Regularization Strength"
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">Random State</label>
                        <input
                            type="number"
                            placeholder="optional"
                            value={state.randomState}
                            onChange={(e) =>
                                setField(
                                    "randomState",
                                    e.target.value === ""
                                        ? ""
                                        : parseInt(e.target.value, 10)
                                )
                            }
                            className="border p-2 rounded w-32"
                            aria-label="Random State"
                        />
                        <span className="text-sm text-gray-500">
                            seed for reproducibility
                        </span>
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
