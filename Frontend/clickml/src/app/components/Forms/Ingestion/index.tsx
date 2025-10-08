"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateIngestionForm,
    resetSourceConfig,
    resetURLVerification,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function IngestionForm() {
    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="space-y-3 flex flex-col">
                <h2 className="font-bold text-xl">Ingestion Pipeline</h2>
                <input
                    placeholder="Pipeline Name"
                    value={ingestionFormState.pipelineName}
                    onChange={(e) => {
                        dispatch(
                            updateIngestionForm({
                                ...ingestionFormState,
                                pipelineName: e.target.value,
                            })
                        );
                    }}
                    className="border p-2 rounded"
                />
                <select
                    value={ingestionFormState.sourceType}
                    onChange={(e) => {
                        dispatch(
                            updateIngestionForm({
                                ...ingestionFormState,
                                sourceType: e.target.value,
                            })
                        );
                        dispatch(resetSourceConfig());
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

                {ingestionFormState.sourceType === "postgres" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="url"
                            required
                            pattern="https?://.+"
                            placeholder="Host"
                            value={String(
                                ingestionFormState.sourceConfig.host ?? ""
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
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
                                            host: e.target.value,
                                        },
                                    })
                                );
                                dispatch(resetURLVerification());
                            }}
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="Database"
                            onChange={(e) => {
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
                                            tableName: e.target.value,
                                        },
                                    })
                                )
                            }
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="User"
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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

                {ingestionFormState.sourceType === "api" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="url"
                            pattern="https?://.+"
                            required={true}
                            placeholder="API URL"
                            onChange={(e) => {
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
                                            apiKey: e.target.value,
                                        },
                                    })
                                )
                            }
                            className="border p-2 rounded"
                        />
                    </div>
                )}

                {ingestionFormState.sourceType === "s3" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="text"
                            placeholder="Bucket Name"
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
                            onChange={(e) =>
                                dispatch(
                                    updateIngestionForm({
                                        ...ingestionFormState,
                                        sourceConfig: {
                                            ...ingestionFormState.sourceConfig,
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
