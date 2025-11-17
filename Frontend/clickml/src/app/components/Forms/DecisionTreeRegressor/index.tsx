"use client";
import React, { useCallback, useReducer, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    updateModelDataSourceState,
    // resetModelDataSourceState,
} from "@/redux/Model_Config/SourceSlices/SourceSlices";

// Adjust this import to match your Decision Tree Regressor slice path/names
import {
    updateDecisionTreeRegressorConfig,
    resetDecisionTreeRegressorConfig,
} from "@/redux/Model_Config/DecisionTreeRegressorSlices/DTRSlices";

type MaxFeatures = "auto" | "sqrt" | "log2" | null;

interface DecisionTreeRegressorState {
    criterion: string; // e.g. "squared_error" | "friedman_mse" | "absolute_error" | "poisson"
    splitter: string; // "best" | "random"
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

    const [open, setOpen] = useState(false);
    const [modelName, setModelName] = useState("");
    const [state, localDispatch] = useReducer(
        reducer,
        initialDecisionTreeRegressorState
    );

    /* ---------- helpers ---------- */
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

            // basic validation
            if (state.minSamplesSplit < 2) {
                alert("minSamplesSplit must be >= 2");
                return;
            }
            if (state.minSamplesLeaf < 1) {
                alert("minSamplesLeaf must be >= 1");
                return;
            }
            if (state.maxDepth !== null && state.maxDepth < 1) {
                alert("maxDepth must be null or >= 1");
                return;
            }

            // Dispatch to Decision Tree Regressor slice
            dispatch(
                updateDecisionTreeRegressorConfig({
                    criterion: state.criterion,
                    splitter: state.splitter,
                    maxDepth: state.maxDepth,
                    minSamplesSplit: state.minSamplesSplit,
                    minSamplesLeaf: state.minSamplesLeaf,
                    maxFeatures: state.maxFeatures,
                })
            );

            console.log("DecisionTreeRegressorForm - submit payload:", {
                modelName,
                decisionTreeRegressor: {
                    criterion: state.criterion,
                    splitter: state.splitter,
                    maxDepth: state.maxDepth,
                    minSamplesSplit: state.minSamplesSplit,
                    minSamplesLeaf: state.minSamplesLeaf,
                    maxFeatures: state.maxFeatures,
                },
            });
        },
        [dispatch, state, modelName]
    );

    const handleReset = useCallback(() => {
        localDispatch({ type: "RESET" });
        dispatch(resetDecisionTreeRegressorConfig());
    }, [dispatch]);

    /* ---------- render ---------- */
    return (
        <form onSubmit={handleSave} className="space-y-3 flex flex-col">
            {/* Model name + shared data source UI (same pattern as your LR form) */}
            <div className="space-y-3">
                <input
                    placeholder="Model Name"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
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

            {/* postgres or api details (copied pattern) */}
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
                        className="border p-2 rounded"
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

            {/* Decision Tree Regressor configuration */}
            <div className="border p-3 rounded space-y-3 transition-all">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-lg">
                        Decision Tree Regressor Configuration
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
                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">Criterion</label>
                        <select
                            value={state.criterion}
                            onChange={(e) =>
                                setField("criterion", e.target.value)
                            }
                            className="border p-2 rounded"
                        >
                            <option value="squared_error">squared_error</option>
                            <option value="friedman_mse">friedman_mse</option>
                            <option value="absolute_error">
                                absolute_error
                            </option>
                            <option value="poisson">poisson</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            loss / impurity
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">Splitter</label>
                        <select
                            value={state.splitter}
                            onChange={(e) =>
                                setField("splitter", e.target.value)
                            }
                            className="border p-2 rounded"
                        >
                            <option value="best">best</option>
                            <option value="random">random</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            split strategy
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">maxDepth</label>
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
                            className="border p-2 rounded w-36"
                        />
                        <span className="text-sm text-gray-500">
                            max tree depth
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">minSamplesSplit</label>
                        <input
                            type="number"
                            min={2}
                            value={String(state.minSamplesSplit)}
                            onChange={(e) =>
                                setField(
                                    "minSamplesSplit",
                                    Math.max(
                                        2,
                                        parseInt(e.target.value || "2", 10)
                                    )
                                )
                            }
                            className="border p-2 rounded w-36"
                        />
                        <span className="text-sm text-gray-500">
                            min samples to split
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">minSamplesLeaf</label>
                        <input
                            type="number"
                            min={1}
                            value={String(state.minSamplesLeaf)}
                            onChange={(e) =>
                                setField(
                                    "minSamplesLeaf",
                                    Math.max(
                                        1,
                                        parseInt(e.target.value || "1", 10)
                                    )
                                )
                            }
                            className="border p-2 rounded w-36"
                        />
                        <span className="text-sm text-gray-500">
                            min samples per leaf
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[120px]">maxFeatures</label>
                        <select
                            value={
                                state.maxFeatures === null
                                    ? "null"
                                    : String(state.maxFeatures)
                            }
                            onChange={(e) => {
                                const v = e.target.value;
                                if (v === "null") setField("maxFeatures", null);
                                else if (
                                    v === "auto" ||
                                    v === "sqrt" ||
                                    v === "log2"
                                )
                                    setField("maxFeatures", v as MaxFeatures);
                                else {
                                    // const n = parseInt(v, 10);
                                    setField(
                                        "maxFeatures",
                                        v as unknown as MaxFeatures
                                    );
                                }
                            }}
                            className="border p-2 rounded"
                        >
                            <option value="null">null (all features)</option>
                            <option value="auto">auto</option>
                            <option value="sqrt">sqrt</option>
                            <option value="log2">log2</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            features considered
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-2 rounded bg-red-500 text-white hover:opacity-90"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-2 rounded bg-blue-600 text-white hover:opacity-90"
                        >
                            Save
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        Note: `Save` updates the Decision Tree Regressor Redux
                        slice. Replace the console.log in{" "}
                        <code>handleSave</code> with your actual submit/API call
                        to send the combined payload.
                    </div>
                </div>
            </div>
        </form>
    );
}
