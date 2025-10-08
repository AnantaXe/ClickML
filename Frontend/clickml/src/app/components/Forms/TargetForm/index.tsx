"use client";
// import { useState } from "react";
import Image from "next/image";
const Loading = "/images/Loading.gif";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
    updateDestination,
    resetDestination,
    resetDestinationConfig,
    updateConnectionStatus,
    updateDeploymentStatus
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function TargetForm() {
    const dispatch = useAppDispatch();
    const destination = useAppSelector((state) => state.destination);
    const ingestionFormState = useAppSelector((state) => state.ingestion);

    const deployment = useAppSelector((state) => state.deployment);

    const destinationConnection = useAppSelector(
        (state) => state.destinationConnection
    );

    function handleTestConnection() {
        try {
            if (!destination.destinationConfig.host) {
                dispatch(
                    updateConnectionStatus({
                        isConnected: -1,
                        connectionMessage: "Host is required",
                    })
                );
                // throw new Error("Host is required");
                return;
            }
            dispatch(
                updateConnectionStatus({
                    isConnected: 2,
                    connectionMessage: "Testing connection...",
                })
            );

            const response = fetch(
                "http://localhost:3002/etl/api/testconnection",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(destination),
                }
            )
                .then(async (res) => await res.json())
                .then((data) => {
                    console.log("Response from Test Connection:", data);
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
            console.log("Response from Test Connection:", response);
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
        dispatch(updateDeploymentStatus({
            isDeployed: 2,
            deploymentMessage: "Deploying pipeline...",
        }));
        // alert("Deploying Pipeline...");
        const response = fetch("http://localhost:3002/etl/api/deploypipeline", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destination: destination,
                ingestionForm: ingestionFormState,
            })
        }).then((res) => res.json())
        .then((data) => {
            console.log("Response from Deploy Pipeline:", data);
            dispatch(updateDeploymentStatus({
                isDeployed: data.isDeployed,
                deploymentMessage: data.deploymentMessage,
            }));

        })
        .catch((error) => {
            console.error("Error in Deploy Pipeline:", error);
            dispatch(updateDeploymentStatus({
                isDeployed: -1,
                deploymentMessage: "Error deploying pipeline",
            }));
        });
        console.log("Response from Deploy Pipeline:", response);
        
    }

    return (
        <>
            <div className="border-[1px] border-gray-600">
                <div className="bg-gray-400 px-10 py-5 font-bold">
                    <h1>/ Target Form Component</h1>
                </div>
                <div className="relative flex justify-start items-center h-full w-full px-10 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-4 focus-visible:outline-none">
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
                                className="p-2 border-[1px] rounded focus-visible:outline-none"
                            >
                                <option value="">Select Destination</option>
                                <option value="postgres">Postgres SQL</option>
                                <option value="s3">Amazon S3</option>
                            </select>

                            {destination.destinationType === "postgres" && (
                                <div className="flex gap-3 border p-3 rounded">
                                    <input
                                        type="url"
                                        required
                                        pattern="https?://.+"
                                        placeholder="Host"
                                        value={String(
                                            destination.destinationConfig
                                                .host ?? ""
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
                                                updateDestination({
                                                    ...destination,
                                                    destinationConfig: {
                                                        ...destination.destinationConfig,
                                                        host: e.target.value,
                                                    },
                                                })
                                            );
                                        }}
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        placeholder="Database"
                                        onChange={(e) => {
                                            dispatch(
                                                updateDestination({
                                                    ...destination,
                                                    destinationConfig: {
                                                        ...destination.destinationConfig,
                                                        database:
                                                            e.target.value,
                                                    },
                                                })
                                            );
                                        }}
                                        className="border p-2 rounded"
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
                                                        tableName:
                                                            e.target.value,
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
                                                updateDestination({
                                                    ...destination,
                                                    destinationConfig: {
                                                        ...destination.destinationConfig,
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
                                                updateDestination({
                                                    ...destination,
                                                    destinationConfig: {
                                                        ...destination.destinationConfig,
                                                        password:
                                                            e.target.value,
                                                    },
                                                })
                                            )
                                        }
                                        className="border p-2 rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className={`flex flex-col gap-4 ${
                                destination.destinationType === ""
                                    ? "hidden cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <div className={`flex gap-3 items-center`}>
                                <button
                                    type="submit"
                                    className={`bg-gray-700 text-white p-2 px-4 rounded cursor-pointer hover:bg-gray-800 border border-gray-700`}
                                    disabled={
                                        destination.destinationType === ""
                                    }
                                    onClick={() => handleTestConnection()}
                                >
                                    Test
                                </button>
                                <div>
                                    {destinationConnection.isConnected ===
                                        2 && (
                                        <Image
                                            src={Loading}
                                            alt="Loading..."
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                </div>
                                <div
                                    className={`${
                                        destinationConnection.isConnected ===
                                            1 ||
                                        destinationConnection.isConnected === 2
                                            ? "text-green-700"
                                            : "text-red-500"
                                    } font-bold`}
                                >
                                    <p className="text-sm">
                                        {
                                            destinationConnection.connectionMessage
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 flex-col`}>
                                <button
                                    type="submit"
                                    className={`bg-green-800 text-white py-5 px-5 rounded cursor-pointer border ${
                                        destinationConnection.isConnected === 1
                                            ? "hover:bg-green-900 border-green-900"
                                            : "cursor-not-allowed border-green-800 opacity-50"
                                    }`}
                                    disabled={
                                        destinationConnection.isConnected === 1
                                            ? false
                                            : true
                                    }
                                    onClick={() => handlePipelineDeployment()}
                                >
                                    Deploy Pipeline
                                </button>
                                <div>
                                    {deployment.isDeployed === 2 && (
                                        <Image
                                            src={Loading}
                                            alt="Loading..."
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                </div>
                                <div className={`${
                                    deployment.isDeployed === 1 || deployment.isDeployed === 2
                                        ? "text-green-700"
                                        : "text-red-500"
                                } font-bold `}>
                                    <p className="text-sm">
                                        {deployment.deploymentMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
