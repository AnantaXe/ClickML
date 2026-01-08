"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateIngestionForm,
    resetURLVerification,
    updateAlterIngestionForm,
    updateSourceState,
    //    resetSourceState,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function IngestionForm() {
    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const dispatch = useAppDispatch();
    const alterIngestionFormState = useAppSelector(
        (state) => state.alterIngestion
    );
    const sourceState = useAppSelector((state) => state.sourceState);

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="font-semibold text-xl text-white border-b border-[#333333] pb-2">
                Ingestion Pipeline
            </h2>

            <div className="space-y-4">
                <div>
                    <label className={labelClasses}>Pipeline Name</label>
                    <input
                        placeholder="e.g., Daily Sales Data"
                        value={alterIngestionFormState.pipelineName}
                        onChange={(e) =>
                            dispatch(
                                updateAlterIngestionForm({
                                    ...alterIngestionFormState,
                                    pipelineName: e.target.value,
                                })
                            )
                        }
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Source Type</label>
                    <select
                        value={sourceState.sourceType}
                        onChange={(e) => {
                            dispatch(
                                updateSourceState({
                                    ...sourceState,
                                    sourceType: e.target.value,
                                })
                            );
                            dispatch(resetURLVerification());
                        }}
                        className={inputClasses}
                    >
                        <option value="">Select Source</option>
                        <option value="postgres">Postgres SQL</option>
                        <option value="api">API</option>
                        <option value="s3">Amazon S3</option>
                    </select>
                </div>

                {/* Ingestion == postgres */}
                {sourceState.sourceType === "postgres" && (
                    <div className="space-y-4 p-4 border border-[#333333] rounded-lg bg-[#111111]">
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            Postgres Configuration
                        </h3>
                        <div>
                            <input
                                type="url"
                                required
                                pattern="https?://.+"
                                placeholder="Connection URL (http:// or https://)"
                                value={String(
                                    sourceState.sourceConfig.apiUrl ?? ""
                                )}
                                onChange={(e) => {
                                    dispatch(
                                        updateSourceState({
                                            ...sourceState,
                                            sourceConfig: {
                                                ...sourceState.sourceConfig,
                                                apiUrl: e.target.value,
                                            },
                                        })
                                    );
                                    dispatch(resetURLVerification());
                                }}
                                className={inputClasses}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Database"
                                value={String(
                                    sourceState.sourceConfig.database ?? ""
                                )}
                                onChange={(e) =>
                                    dispatch(
                                        updateSourceState({
                                            ...sourceState,
                                            sourceConfig: {
                                                ...sourceState.sourceConfig,
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
                                    sourceState.sourceConfig.tableName ?? ""
                                )}
                                onChange={(e) =>
                                    dispatch(
                                        updateSourceState({
                                            ...sourceState,
                                            sourceConfig: {
                                                ...sourceState.sourceConfig,
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
                                    sourceState.sourceConfig.user ?? ""
                                )}
                                onChange={(e) =>
                                    dispatch(
                                        updateSourceState({
                                            ...sourceState,
                                            sourceConfig: {
                                                ...sourceState.sourceConfig,
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
                                    sourceState.sourceConfig.password ?? ""
                                )}
                                onChange={(e) =>
                                    dispatch(
                                        updateSourceState({
                                            ...sourceState,
                                            sourceConfig: {
                                                ...sourceState.sourceConfig,
                                                password: e.target.value,
                                            },
                                        })
                                    )
                                }
                                className={inputClasses}
                            />
                        </div>
                    </div>
                )}

                {/* Ingestion == API */}
                {sourceState.sourceType === "api" && (
                    <div className="space-y-4 p-4 border border-[#333333] rounded-lg bg-[#111111]">
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            API Configuration
                        </h3>
                        <input
                            type="url"
                            pattern="https?://.+"
                            required={true}
                            placeholder="API Endpoint URL"
                            value={String(
                                sourceState.sourceConfig.apiUrl ?? ""
                            )}
                            onChange={(e) => {
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            apiUrl: e.target.value,
                                        },
                                    })
                                );
                                dispatch(resetURLVerification());
                            }}
                            className={inputClasses}
                        />
                        <input
                            type="text"
                            placeholder="API Key (Optional)"
                            value={String(
                                sourceState.sourceConfig.apiKey ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            apiKey: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                    </div>
                )}

                {sourceState.sourceType === "s3" && (
                    <div className="space-y-4 p-4 border border-[#333333] rounded-lg bg-[#111111]">
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            S3 Configuration
                        </h3>
                        <input
                            placeholder="Bucket Name"
                            value={String(
                                sourceState.sourceConfig.bucketName ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            bucketName: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            placeholder="AWS Access Key"
                            value={String(
                                sourceState.sourceConfig.awsAccessKey ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            awsAccessKey: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                        <input
                            placeholder="AWS Secret Key"
                            value={String(
                                sourceState.sourceConfig.awsSecretKey ?? ""
                            )}
                            onChange={(e) =>
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            awsSecretKey: e.target.value,
                                        },
                                    })
                                )
                            }
                            className={inputClasses}
                        />
                    </div>
                )}

                <div>
                    <label className={labelClasses}>
                        Schedule (Cron Expression)
                    </label>
                    <input
                        placeholder="e.g. 0 * * * *"
                        value={ingestionFormState.cron}
                        onChange={(e) =>
                            dispatch(
                                updateIngestionForm({
                                    ...ingestionFormState,
                                    cron: e.target.value,
                                })
                            )
                        }
                        className={inputClasses}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Leave empty for manual execution.
                    </p>
                </div>
            </div>
        </div>
    );
}
