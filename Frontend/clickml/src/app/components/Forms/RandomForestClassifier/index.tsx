"use client";
import React, { useCallback, useReducer, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    updateModelDataSourceState,
    // resetModelDataSourceState,
} from "@/redux/Model_Config/SourceSlices/SourceSlices";

// Adjust these imports to match your actual Redux slice paths/names
import {
    updateRandomForestClassifierConfig,
    resetRandomForestClassifierConfig,
} from "@/redux/Model_Config/RandomForestClassifierSlices/RFCSlices";

type MaxFeatures = "auto" | "sqrt" | "log2" | null ;

interface RandomForestClassifierState {
    nEstimators: number;
    criterion: string; // e.g. "gini" | "entropy"
    maxDepth: number | null;
    minSamplesSplit: number;
    minSamplesLeaf: number;
    maxFeatures: MaxFeatures;
    bootstrap: boolean;
    oobScore: boolean;
    nJobs: number | null;
}

type Action =
    | {
          type: "SET";
          key: keyof RandomForestClassifierState;
          value: RandomForestClassifierState[keyof RandomForestClassifierState];
      }
    | { type: "RESET"; payload?: Partial<RandomForestClassifierState> };

const initialState: RandomForestClassifierState = {
    nEstimators: 100,
    criterion: "gini",
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
    bootstrap: true,
    oobScore: false,
    nJobs: null,
};

function reducer(
    state: RandomForestClassifierState,
    action: Action
): RandomForestClassifierState {
    switch (action.type) {
        case "SET":
            return {
                ...state,
                [action.key]: action.value,
            } as RandomForestClassifierState;
        case "RESET":
            return { ...initialState, ...action.payload };
        default:
            return state;
    }
}

export default function RandomForestClassifierForm() {
    const dispatch = useAppDispatch();
    const modelDataSource = useAppSelector((s) => s.modelDataSourceConfig);

    const [open, setOpen] = useState(false);
    const [modelName, setModelName] = useState("");
    const [state, localDispatch] = useReducer(reducer, initialState);

    /* ---------- helpers ---------- */
    const setField = useCallback(
        <K extends keyof RandomForestClassifierState>(
            key: K,
            value: RandomForestClassifierState[K]
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

            if (state.nEstimators < 1) {
                alert("nEstimators must be >= 1");
                return;
            }
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

            // Dispatch to Redux slice
            dispatch(
                updateRandomForestClassifierConfig({
                    nEstimators: state.nEstimators,
                    criterion: state.criterion,
                    maxDepth: state.maxDepth,
                    minSamplesSplit: state.minSamplesSplit,
                    minSamplesLeaf: state.minSamplesLeaf,
                    maxFeatures: state.maxFeatures,
                    bootstrap: state.bootstrap,
                    oobScore: state.oobScore,
                    nJobs: state.nJobs,
                })
            );

            console.log("RandomForestClassifierForm - submit payload:", {
                modelName,
                randomForestClassifier: {
                    nEstimators: state.nEstimators,
                    criterion: state.criterion,
                    maxDepth: state.maxDepth,
                    minSamplesSplit: state.minSamplesSplit,
                    minSamplesLeaf: state.minSamplesLeaf,
                    maxFeatures: state.maxFeatures,
                    bootstrap: state.bootstrap,
                    oobScore: state.oobScore,
                    nJobs: state.nJobs,
                },
                // include modelDataSource if you want to submit together
            });
        },
        [dispatch, state, modelName]
    );

    const handleReset = useCallback(() => {
        localDispatch({ type: "RESET" });
        dispatch(resetRandomForestClassifierConfig());
    }, [dispatch]);

    /* ---------- render ---------- */
    return (
        <form onSubmit={handleSave} className="space-y-3 flex flex-col">
            {/* Model name + shared data source UI */}
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

            {/* postgres or api details */}
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

            {/* Random Forest configuration */}
            <div className="border p-3 rounded space-y-3 transition-all">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-lg">
                        Random Forest Classifier Configuration
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
                        <label className="min-w-[140px]">nEstimators</label>
                        <input
                            type="number"
                            min={1}
                            value={String(state.nEstimators)}
                            onChange={(e) =>
                                setField(
                                    "nEstimators",
                                    Math.max(
                                        1,
                                        parseInt(e.target.value || "1", 10)
                                    )
                                )
                            }
                            className="border p-2 rounded w-36"
                        />
                        <span className="text-sm text-gray-500">
                            number of trees
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[140px]">Criterion</label>
                        <select
                            value={state.criterion}
                            onChange={(e) =>
                                setField("criterion", e.target.value)
                            }
                            className="border p-2 rounded"
                        >
                            <option value="gini">gini</option>
                            <option value="entropy">entropy</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            impurity measure
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[140px]">maxDepth</label>
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
                        <label className="min-w-[140px]">minSamplesSplit</label>
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
                        <label className="min-w-[140px]">minSamplesLeaf</label>
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
                        <label className="min-w-[140px]">maxFeatures</label>
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

                    <div className="flex items-center gap-6">
                        <label className="flex items-center space-x-2 min-w-[140px]">
                            <input
                                type="checkbox"
                                checked={state.bootstrap}
                                onChange={(e) =>
                                    setField("bootstrap", e.target.checked)
                                }
                                className="rounded"
                            />
                            <span>Bootstrap</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={state.oobScore}
                                onChange={(e) =>
                                    setField("oobScore", e.target.checked)
                                }
                                className="rounded"
                            />
                            <span>oobScore</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="min-w-[140px]">nJobs</label>
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
                        />
                        <span className="text-sm text-gray-500">
                            parallel jobs
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
                        Note: `Save` updates the Random Forest Classifier Redux
                        slice. Replace the console.log in{" "}
                        <code>handleSave</code> with your actual submit/API call
                        to send the full payload.
                    </div>
                </div>
            </div>
        </form>
    );
}
