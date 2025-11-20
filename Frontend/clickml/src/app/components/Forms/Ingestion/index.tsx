"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateIngestionForm,
    resetURLVerification,
    updateAlterIngestionForm,
    updateSourceState,
    resetSourceState,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function IngestionForm() {
    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const dispatch = useAppDispatch();
    const alterIngestionFormState = useAppSelector((state) => state.alterIngestion);
    const sourceState = useAppSelector((state) => state.sourceState);

    return (
        <>
            <div className="space-y-3 flex flex-col">
                <h2 className="font-bold text-xl">Ingestion Pipeline</h2>
                <input
                    placeholder="Pipeline Name"
                    value={alterIngestionFormState.pipelineName}
                    onChange={(e) => {
                        dispatch(
                            updateAlterIngestionForm({
                                ...alterIngestionFormState,
                                pipelineName: e.target.value,
                            })
                        );
                    }}
                    className="border p-2 rounded"
                />
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
                    className="border p-2 rounded"
                >
                    <option value="">Select Source</option>
                    <option value="postgres">Postgres SQL</option>
                    <option value="api">API</option>
                    <option value="s3">Amazon S3</option>
                </select>
                
                {/* Ingestion == postgres */}

                {sourceState.sourceType === "postgres" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="url"
                            required
                            pattern="https?://.+"
                            placeholder="apiUrl"
                            value={String(
                                sourceState.sourceConfig.apiUrl ?? ""
                            )}
                            onInvalid={(e) =>
                                (
                                    e.target as HTMLInputElement
                                ).setCustomValidity(
                                    "Please enter a valid URL starting with http:// or https://"
                                )
                            }
                            onInput={(e) =>
                                (
                                    e.target as HTMLInputElement
                                ).setCustomValidity("")
                            }
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
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="Database"
                            value={String(
                                sourceState.sourceConfig.database ?? ""
                            )}
                            onChange={(e) => {
                                dispatch(
                                    updateSourceState({
                                        ...sourceState,
                                        sourceConfig: {
                                            ...sourceState.sourceConfig,
                                            database: e.target.value,
                                        },
                                    })
                                );
                                dispatch(resetURLVerification());
                            }}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
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
                            className="border p-2 rounded"
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
                            className="border p-2 rounded"
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
                            className="border p-2 rounded"
                        />
                    </div>
                )}

                {/* Ingestion == API */}

                {sourceState.sourceType === "api" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="url"
                            pattern="https?://.+"
                            required={true}
                            placeholder="API URL"
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
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="API Key"
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
                            className="border p-2 rounded"
                        />
                    </div>
                )}

                {sourceState.sourceType === "s3" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="text"
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
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
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
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
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
                            className="border p-2 rounded"
                        />
                    </div>
                )}

                <h3 className="font-semibold">Schedule (Cron)</h3>
                <input
                    placeholder="Cron (e.g. 0 * * * *)"
                    value={ingestionFormState.cron}
                    onChange={(e) =>
                        dispatch(
                            updateIngestionForm({
                                ...ingestionFormState,
                                cron: e.target.value,
                            })
                        )
                    }
                    className="border p-2 rounded"
                />
            </div>
        </>
    );
}
