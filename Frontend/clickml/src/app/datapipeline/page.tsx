"use client";
// import { pipeline } from "stream";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function DataPipeline() {
    const [pipelineName, setPipelineName] = useState("");
    const [resultPreview, setResultPreview] = useState<
        Record<string, unknown>[]
    >([]);

    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [initialData, setInitialData] = useState({
        pipelineName: "Initial Pipeline",
        steps: [
            {
                type: "fetch_api",
                config: {
                    url: "https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&validFrom=2023-01-01&validTo=2023-12-31&languageIsoCode=DE&subdivisionCode=DE-BE",
                    method: "GET",
                    headers: { Authorization: "Bearer token123" },
                    params: { limit: 100 },
                },
            },
        ],
    });

    function sendPipelineData() {
        fetch("http://localhost:3002/etl/fetchData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
        })
            .then((res) => res.json())
            .then((data) => {
                setPipelineName(data.pipelineName || "");
                const json = data.resultPreview.json
                setResultPreview(data.resultPreview || []);
                alert(data.message || "Pipeline sent successfully!");
            })
            .catch(() => {
                alert("Error sending pipeline");
            });
    }

    // function sendPipelineData() {
    //     fetch("http://localhost:3002/etl/extractData", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(initialData),
    //     })
    //         .then((res) => async () => {
    //             const json = await res.json();
    //             await setResultPreview(json);
    //             alert("Pipeline sent successfully!");
    //         })
    //         .catch((err) => {
    //             alert(`Error sending pipeline: ${err}`);
    //         });
    //     // const json = await res.json();
    //     // setResultPreview(json);
    // }

    // Utility: Get all unique keys (including nested)
    // function extractKeys(data: Record<string, unknown>[]): string[] {
    //     const keys = new Set<string>();

    //     function recurse(obj: Record<string, unknown>, prefix = "") {
    //         for (const key in obj) {
    //             const value = obj[key];
    //             const path = prefix ? `${prefix}.${key}` : key;
    //             keys.add(path);

    //             if (
    //                 value &&
    //                 typeof value === "object" &&
    //                 !Array.isArray(value)
    //             ) {
    //                 recurse(value as Record<string, unknown>, path);
    //             }
    //         }
    //     }

    //     data.forEach((row) => recurse(row));
    //     return Array.from(keys);
    // }

    // Toggle feature selection
    function toggleFeature(key: string) {
        setSelectedFeatures((prev) =>
            prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
        );
    }

    // Send selected features to server for transformation
    function sendSelectedFeatures() {

        const cleanedFeatures = selectedFeatures.map(
            (f) => f.replace(/^"|"$/g, "") // removes surrounding quotes
        );

        fetch("http://localhost:3002/etl/selectfeatures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ features: cleanedFeatures }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Transformation response:", data);
                alert("Transformation complete!");
            })
            .catch(() => {
                alert("Error transforming features");
            });
    }

    return (
        <>
            <Navbar />
            {/* 
      {
        "pipelineName": "My First Pipeline",
        "steps": [
        {
            "type": "fetch_api",
            "config": {
                "url": "https://www.datafuel.dev?ref=publicapis",
                "method": "GET",
                "headers": { "Authorization": "Bearer token123" },
                "params": { "limit": 100 }
            }
        }
        ]
      } 
*/}

            <div style={{ margin: "20px 0" }}>
                <label>
                    Pipeline Name:{" "}
                    <input
                        type="text"
                        value={initialData.pipelineName}
                        onChange={(e) =>
                            setInitialData((prev) => ({
                                ...prev,
                                pipelineName: e.target.value,
                            }))
                        }
                    />
                </label>
                <br />
                <label>
                    API URL:{" "}
                    <input
                        type="text"
                        value={initialData.steps[0].config.url}
                        onChange={(e) =>
                            setInitialData((prev) => ({
                                ...prev,
                                steps: [
                                    {
                                        ...prev.steps[0],
                                        config: {
                                            ...prev.steps[0].config,
                                            url: e.target.value,
                                        },
                                    },
                                ],
                            }))
                        }
                    />
                </label>
                <br />
                <label>
                    Method:{" "}
                    <input
                        type="text"
                        value={initialData.steps[0].config.method}
                        onChange={(e) =>
                            setInitialData((prev) => ({
                                ...prev,
                                steps: [
                                    {
                                        ...prev.steps[0],
                                        config: {
                                            ...prev.steps[0].config,
                                            method: e.target.value,
                                        },
                                    },
                                ],
                            }))
                        }
                    />
                </label>
                <br />
                <label>
                    Authorization Header:{" "}
                    <input
                        type="text"
                        value={
                            initialData.steps[0].config.headers.Authorization
                        }
                        onChange={(e) =>
                            setInitialData((prev) => ({
                                ...prev,
                                steps: [
                                    {
                                        ...prev.steps[0],
                                        config: {
                                            ...prev.steps[0].config,
                                            headers: {
                                                ...prev.steps[0].config.headers,
                                                Authorization: e.target.value,
                                            },
                                        },
                                    },
                                ],
                            }))
                        }
                    />
                </label>
                <br />
                <label>
                    Limit Param:{" "}
                    <input
                        type="number"
                        value={initialData.steps[0].config.params.limit}
                        onChange={(e) =>
                            setInitialData((prev) => ({
                                ...prev,
                                steps: [
                                    {
                                        ...prev.steps[0],
                                        config: {
                                            ...prev.steps[0].config,
                                            params: {
                                                ...prev.steps[0].config.params,
                                                limit: Number(e.target.value),
                                            },
                                        },
                                    },
                                ],
                            }))
                        }
                    />
                </label>
            </div>

            <div>
                <button onClick={sendPipelineData}>Send Pipeline Data</button>
            </div>

            <div>
                <h2>{pipelineName}</h2>
                {/* <h3>Result Preview</h3> */}
                <ul>
                    {(resultPreview ?? []).map((item, index) => (
                        // <li key={index}>{JSON.stringify(item)}</li>
                        
                            <label
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFeatures.includes(JSON.stringify(item))}
                                    onChange={() => toggleFeature(JSON.stringify(item))}
                                />
                                <span>{JSON.stringify(item)}</span>
                            </label>
                        
                    ))}
                </ul>
            </div>

            {/* <h2 className="font-bold mt-4">Select Features to Transform</h2> */}
            {/* {resultPreview.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.keys(resultPreview || {}).map((key, item) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFeatures.includes(key)}
                                onChange={() => toggleFeature(key)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            )} */}

            {/* {resultPreview.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {extractKeys(resultPreview).map((key, string) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFeatures.includes(key)}
                                onChange={() => toggleFeature(key)}
                            />
                            <span>{string}</span>
                        </label>
                    ))}
                </div>
            )} */}

            {/*
                <div>
                {selectedFeatures.length > 0 ? (
                    <ul>
                        {selectedFeatures.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No features selected</p>
                )}
            </div> */
            }

            <div>
                <button onClick={sendSelectedFeatures}>
                    Transform Selected Features
                </button>
            </div>

            {console.log(selectedFeatures)}

            <h2 className="font-bold mt-4">Filtered Preview</h2>
            <pre className="p-2 rounded">
                {JSON.stringify(
                    selectedFeatures.map((item) => {
                        console.log(item);
                        return item;
                    }),
                    null
                )}
            </pre>
        </>
    );
}
