"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateIngestionForm,
    resetSourceConfig,
    resetURLVerification,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function IngestionForm() {
    // const [ingestionInitialState, setIngestionInitialState] = useState({
    //     pipeline_name: "",
    //     cron: "0 2 * * *",
    //     sourceType: "",
    //     destinationType: "",
    //     sourceConfig: {} as Record<string, string>,
    //     destinationConfig: {} as Record<string, string>,
    // });

    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const dispatch = useAppDispatch();
    type IngestionFormState = typeof ingestionFormState;
    const setIngestionInitialState = (newState: IngestionFormState) => {
        // This function should dispatch an action to update the Redux state
        dispatch(updateIngestionForm(newState));
    };

    return (
        <>
            <div className="space-y-3 flex flex-col">
                <h2 className="font-bold text-xl">Ingestion Pipeline</h2>
                <input
                    placeholder="Pipeline Name"
                    value={ingestionFormState.pipelineName}
                    // onChange={(e) =>
                    //     handleChange(
                    //         "ingestion",
                    //         "pipeline_name",
                    //         e.target.value
                    //     )
                    // }
                    onChange={(e) => {
                        setIngestionInitialState({
                            ...ingestionFormState,
                            pipelineName: e.target.value,
                        });
                        // dispatch()
                    }}
                    className="border p-2 rounded"
                />
                <select
                    value={ingestionFormState.sourceType}
                    // onChange={(e) =>
                    //     handleChange("ingestion", "sourceType", e.target.value)
                    // }
                    onChange={(e) => {
                        setIngestionInitialState({
                            ...ingestionFormState,
                            sourceType: e.target.value,
                        });
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
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        host: e.target.value,
                                    },
                                });
                                dispatch(resetURLVerification());
                            }}
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="Database"
                            onChange={(e) => {
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        database: e.target.value,
                                    },
                                });
                                dispatch(resetURLVerification());
                            }}
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "database",
                            //         e.target.value
                            //     )
                            // }
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Table Name"
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        tableName: e.target.value,
                                    },
                                })
                            }
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "tableName",
                            //         e.target.value
                            //     )
                            // }
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="User"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "user",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        user: e.target.value,
                                    },
                                })
                            }
                            className="border p-2 rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "password",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        password: e.target.value,
                                    },
                                })
                            }
                            className="border p-2 rounded"
                        />
                    </div>
                )}

                {ingestionFormState.sourceType === "api" && (
                    <div className="flex flex-col space-y-2 border p-3 rounded">
                        <input
                            type="url"
                            pattern="https?://.+"
                            required={true}
                            placeholder="API URL"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "apiUrl",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>{
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        apiUrl: e.target.value,
                                    },
                                })
                                dispatch(resetURLVerification());
                            }}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="API Key"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "apiKey",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        apiKey: e.target.value,
                                    },
                                })
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
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "bucketName",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        bucketName: e.target.value,
                                    },
                                })
                            }
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="AWS Access Key"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "awsAccessKey",
                            //         e.target.value
                            //     )
                            // }
                            onChange={(e) =>
                                setIngestionInitialState({
                                    ...ingestionFormState,
                                    sourceConfig: {
                                        ...ingestionFormState.sourceConfig,
                                        awsAccessKey: e.target.value,
                                    },
                                })
                            }
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="AWS Secret Key"
                            // onChange={(e) =>
                            //     handleNestedChange(
                            //         "ingestion",
                            //         "sourceConfig",
                            //         "awsSecretKey",
                            //         e.target.value
                            //     )
                            // }
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
                    // onChange={(e) =>
                    //     handleChange("ingestion", "cron", e.target.value)
                    // }
                    onChange={(e) =>
                        setIngestionInitialState({
                            ...ingestionFormState,
                            cron: e.target.value,
                        })
                    }
                    className="border p-2 rounded"
                />
            </div>
        </>
    );
}
