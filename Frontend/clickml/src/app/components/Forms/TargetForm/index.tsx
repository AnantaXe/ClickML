"use client";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateDestination,
    resetDestinationConfig,
    updateConnectionStatus,
    updateDeploymentStatus,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function TargetForm() {
    const dispatch = useAppDispatch();
    const destination = useAppSelector((state) => state.destination);
    const alterIngestionFormState = useAppSelector(
        (state) => state.alterIngestion
    );
    const transformationConfigState = useAppSelector(
        (state) => state.transformationConfig
    );
    const sourceState = useAppSelector((state) => state.sourceState);
    const deployment = useAppSelector((state) => state.deployment);
    const destinationConnection = useAppSelector(
        (state) => state.destinationConnection
    );

    const inputClasses =
        "w-full bg-[#0a0a0a] border border-[#333333] text-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all";

    function handleTestConnection() {
        try {
            if (!destination.destinationConfig.host) {
                dispatch(
                    updateConnectionStatus({
                        isConnected: -1,
                        connectionMessage: "Host is required",
                    })
                );
                return;
            }
            dispatch(
                updateConnectionStatus({
                    isConnected: 2,
                    connectionMessage: "Testing connection...",
                })
            );

            fetch("http://localhost:3002/etl/api/testconnection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(destination),
            })
                .then(async (res) => await res.json())
                .then((data) => {
                    dispatch(
                        updateConnectionStatus({
                            isConnected: data.isConnected,
                            connectionMessage: data.connectionMessage,
                        })
                    );
                })
                .catch((error) => {
                    console.error("Error in Test Connection:", error);
                    dispatch(
                        updateConnectionStatus({
                            isConnected: -1,
                            connectionMessage: "Error testing connection",
                        })
                    );
                });
        } catch (error) {
            console.error("Error testing connection:", error);
            dispatch(
                updateConnectionStatus({
                    isConnected: -1,
                    connectionMessage: "Error testing connection",
                })
            );
        }
    }

    function handlePipelineDeployment() {
        dispatch(
            updateDeploymentStatus({
                isDeployed: 2,
                deploymentMessage: "Deploying pipeline...",
            })
        );

        fetch("http://localhost:3002/etl/api/deploypipeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source: sourceState,
                ingestion: alterIngestionFormState,
                transform: transformationConfigState,
                destination: destination,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(
                    updateDeploymentStatus({
                        isDeployed: data.isDeployed,
                        deploymentMessage: data.deploymentMessage,
                    })
                );
            })
            .catch((error) => {
                console.error("Error in Deploy Pipeline:", error);
                dispatch(
                    updateDeploymentStatus({
                        isDeployed: -1,
                        deploymentMessage: "Error deploying pipeline",
                    })
                );
            });
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header removed as it is now handled by the parent component */}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Destination Type
                    </label>
                    <select
                        value={destination.destinationType}
                        onChange={(e) => {
                            dispatch(
                                updateDestination({
                                    ...destination,
                                    destinationType: e.target.value,
                                })
                            );
                            dispatch(resetDestinationConfig());
                        }}
                        className={inputClasses}
                    >
                        <option value="">Select Destination</option>
                        <option value="postgres">Postgres SQL</option>
                        <option value="s3">Amazon S3</option>
                    </select>
                </div>

                {destination.destinationType === "postgres" && (
                    <div className="space-y-4 p-4 border border-[#333333] rounded-lg bg-[#111111]">
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            Postgres Configuration
                        </h3>
                        <input
                            type="url"
                            required
                            pattern="https?://.+"
                            placeholder="Host URL"
                            value={String(
                                destination.destinationConfig.host ?? ""
                            )}
                            onChange={(e) => {
                                dispatch(
                                    updateDestination({
                                        ...destination,
                                        destinationConfig: {
                                            ...destination.destinationConfig,
                                            host: e.target.value,
                                        },
                                    })
                                );
                            }}
                            className={inputClasses}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Database"
                                onChange={(e) =>
                                    dispatch(
                                        updateDestination({
                                            ...destination,
                                            destinationConfig: {
                                                ...destination.destinationConfig,
                                                database: e.target.value,
                                            },
                                        })
                                    )
                                }
                                className={inputClasses}
                            />
                            <input
                                type="text"
                                placeholder="New Table Name"
                                onChange={(e) =>
                                    dispatch(
                                        updateDestination({
                                            ...destination,
                                            destinationConfig: {
                                                ...destination.destinationConfig,
                                                tableName: e.target.value,
                                            },
                                        })
                                    )
                                }
                                className={inputClasses}
                            />
                            <input
                                placeholder="User"
                                onChange={(e) =>
                                    dispatch(
                                        updateDestination({
                                            ...destination,
                                            destinationConfig: {
                                                ...destination.destinationConfig,
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
                                onChange={(e) =>
                                    dispatch(
                                        updateDestination({
                                            ...destination,
                                            destinationConfig: {
                                                ...destination.destinationConfig,
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

                {destination.destinationType !== "" && (
                    <div className="flex flex-col gap-4 pt-4 border-t border-[#333333]">
                        {/* Test Connection */}
                        <div className="flex items-center justify-between bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">
                                    Test Connection
                                </h4>
                                <p
                                    className={`text-xs ${
                                        destinationConnection.isConnected === 1
                                            ? "text-green-500"
                                            : destinationConnection.isConnected ===
                                              -1
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {destinationConnection.connectionMessage ||
                                        "Verify credentials before deploying."}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {destinationConnection.isConnected === 2 && (
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                )}
                                <button
                                    className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-md text-sm transition-colors"
                                    onClick={() => handleTestConnection()}
                                >
                                    Test
                                </button>
                            </div>
                        </div>

                        {/* Deploy */}
                        <div className="flex items-center justify-between bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1">
                                    Deploy Pipeline
                                </h4>
                                <p
                                    className={`text-xs ${
                                        deployment.isDeployed === 1 ||
                                        deployment.isDeployed === 2
                                            ? "text-green-500"
                                            : deployment.isDeployed === -1
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {deployment.deploymentMessage ||
                                        "Ready to deploy?"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {deployment.isDeployed === 2 && (
                                    <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                                )}
                                <button
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        destinationConnection.isConnected === 1
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-[#2A2A2A] text-gray-600 cursor-not-allowed"
                                    }`}
                                    disabled={
                                        destinationConnection.isConnected !== 1
                                    }
                                    onClick={() => handlePipelineDeployment()}
                                >
                                    Deploy Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
