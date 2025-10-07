"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { spaceGrotesk } from "@/Fonts/font";
// Use a public path string if the image is in the public directory
const NotOk = "/images/notOk.png";
// Use a public path string if the image is in the public directory
const Ok = "/images/ok.png";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/hooks";
import {
    IngestionForm,
    EnrichmentForm,
    MonitoringForm,
    TransformationForm,
} from "@/app/components/Forms";
import {
    resetEnrichmentForm,
    resetIngestionForm,
    resetMonitoringForm,
    resetTransformationForm,
    updateIngestionForm,
    updateURLVerification,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";
import {
    updateFilteredFieldsName,
    updateOriginalFieldsName,
    resetFieldNames,
} from "@/redux/Features/FieldNameSlices/FieldNameSlices";

export default function NewDataPipeline() {
    const Forms = ["Ingestion", "Transformation", "Enrichment", "Monitoring"];
    const [activeForm, setActiveForm] = useState(Forms[0]);

    const ingestionFormState = useAppSelector((state) => state.ingestion);
    // const transformationFormState = useAppSelector(
    //     (state) => state.transformation
    // );
    // const enrichmentFormState = useAppSelector((state) => state.enrichment);
    // const monitoringFormState = useAppSelector((state) => state.monitoring);

    //----------- url verification status -----------//
    const urlVerificationStatus = useAppSelector(
        (state) => state.urlVerification
    );

    //----------- Field Names State -----------//

    // interface FieldNamesState {
    //     OriginalFieldsName: string[];
    //     // add other properties if needed
    // }

    const OriginalFieldNames = useAppSelector(
        (state) => state.fieldnames.OriginalFieldsName
    );
    const FilteredFieldNames = useAppSelector(
        (state) => state.fieldnames.FilteredFieldsName
    );

    // const dispatch = useAppDispatch(resetEnrichmentForm());
    const dispatch = useAppDispatch();

    //----------- handle form Validation -----------//

    function handleValidation(activeForm: string, event: React.FormEvent) {
        event.preventDefault();
        console.log("Active Form:", activeForm);
        // Reset URL verification status
        dispatch(updateURLVerification({ isValid: 0 }));

        if (activeForm === "Ingestion") {
            // formData = JSON.stringify(ingestionFormState);
            if (ingestionFormState.sourceType === "api") {
                const apiUrl = ingestionFormState.sourceConfig.apiUrl;
                const apiKey = ingestionFormState.sourceConfig.apiKey
                    ? ingestionFormState.sourceConfig.apiKey
                    : "";
                const response = fetch(
                    "http://localhost:3002/etl/validateApi",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ apiUrl, apiKey }),
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("API Validation Response:", data);
                        dispatch(
                            updateURLVerification({
                                isValid: data.valid,
                                urlVerificationMessage: data.message,
                            })
                        );
                    })
                    .catch((error) => {
                        console.error("Error validating API:", error);
                        dispatch(
                            updateURLVerification({
                                isValid: -1,
                                urlVerificationMessage:
                                    "Server is not responding !",
                            })
                        );
                    });
                console.log("Response from API:", response);
            }
        } else if (activeForm === "Transformation") {
            // formData = transformationFormState;
        } else if (activeForm === "Enrichment") {
            // formData = enrichmentFormState;
        } else if (activeForm === "Monitoring") {
            // formData = monitoringFormState;
        }
    }

    //----------- handle form Submission -----------//
    const handleSubmit = (activeForm: string) => {
        dispatch(resetFieldNames());
        console.log("Getting Preview...");
        // const apiEndpoint = `http://localhost:3002/etl/api/${activeForm.toLowerCase()}`;
        // const response = fetch(apiEndpoint, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(formData),
        // });
        // console.log("Response from API:", response);

        if (activeForm === "Ingestion") {
            const response = fetch("http://localhost:3002/etl/api/apipreview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ingestionFormState.sourceConfig),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("API Preview Response:", data);
                    dispatch(updateOriginalFieldsName(data));
                })
                .catch((error) => {
                    console.error("Error in API Preview:", error);
                });
            console.log("Response from API Preview:", response);
        }
    };

    const handleFieldNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        const isChecked = e.target.checked;
        let updatedFilteredFields: string[] = [];

        if (isChecked) {
            if (!FilteredFieldNames.includes(field)) {
                updatedFilteredFields = [...FilteredFieldNames, field];
            } else {
                updatedFilteredFields = [...FilteredFieldNames];
            }

        } else {
            updatedFilteredFields = FilteredFieldNames.filter(
                (f) => f !== field
            );
        }

        dispatch(updateFilteredFieldsName(updatedFilteredFields));
        dispatch(
            updateIngestionForm({ selectedFields: updatedFilteredFields })
        );
    };

    return (
        <>
            <div className="flex">
                <div className="border-[1px] flex-1/3">
                    <div className="bg-gray-400 px-10 py-5 mb-5 font-bold">
                        <h1>/ Create a New Data Pipeline</h1>
                    </div>
                    <div className="px-10">
                        <ul
                            className={`flex space-x-4 border-b mb-5 ${spaceGrotesk.className}`}
                        >
                            {Forms.map((form) => (
                                <li
                                    key={form}
                                    className={`cursor-pointer py-2 hover:font-semibold ${
                                        activeForm === form
                                            ? "bg-gray-700 font-semibold text-white"
                                            : ""
                                    } p-2`}
                                    onClick={() => {
                                        setActiveForm(form);
                                        // Reset form state
                                        dispatch(resetEnrichmentForm());

                                        dispatch(resetIngestionForm());

                                        dispatch(resetTransformationForm());

                                        dispatch(resetMonitoringForm());
                                    }}
                                >
                                    {form}
                                </li>
                            ))}
                        </ul>

                        {activeForm === "Ingestion" && <IngestionForm />}
                        {activeForm === "Transformation" && (
                            <TransformationForm />
                        )}
                        {activeForm === "Enrichment" && <EnrichmentForm />}
                        {activeForm === "Monitoring" && <MonitoringForm />}

                        {/* 
                            <div>
                            <h3>Current Form State:</h3>
                            <div>
                            <h4>Ingestion:</h4>
                            <pre>{JSON.stringify(ingestionFormState, null, 2)}</pre>
                            </div>
                            <div>
                            <h4>Transformation:</h4>
                            <pre>
                            {JSON.stringify(transformationFormState, null, 2)}
                            </pre>
                            </div>
                            <div>
                            <h4>Enrichment:</h4>
                            <pre>{JSON.stringify(enrichmentFormState, null, 2)}</pre>
                            </div>
                            <div>
                            <h4>Monitoring:</h4>
                            <pre>{JSON.stringify(monitoringFormState, null, 2)}</pre>
                            </div>
                            </div> 
                        */}
                        <div className="flex justify-between my-10">
                            <div className="flex gap-2 items-center">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white p-3 rounded cursor-pointer hover:bg-gray-800"
                                    onClick={(e) =>
                                        handleValidation(activeForm, e)
                                    }
                                >
                                    Check Pipeline
                                </button>
                                <div
                                    className={`url-verification-box w-5 h-5 border-[1px]`}
                                >
                                    {urlVerificationStatus.isValid !== 0 && (
                                        <Image
                                            src={
                                                urlVerificationStatus.isValid ===
                                                1
                                                    ? Ok
                                                    : NotOk
                                            }
                                            alt=""
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </div>
                                <div
                                    className={`${
                                        urlVerificationStatus.isValid === 1
                                            ? "text-green-700"
                                            : "text-red-500"
                                    } font-bold`}
                                >
                                    <h2>
                                        {
                                            urlVerificationStatus.urlVerificationMessage
                                        }
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className={`bg-green-800 text-white py-3 px-5 rounded cursor-pointer  ${
                                        urlVerificationStatus.isValid === 1
                                            ? "hover:bg-green-900"
                                            : "opacity-50 cursor-not-allowed"
                                    }`}
                                    disabled={
                                        urlVerificationStatus.isValid === 1
                                            ? false
                                            : true
                                    }
                                    onClick={() => handleSubmit(activeForm)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Preview-Container flex flex-1/3 border-b-[1px] border-r-[1px] border-t-[1px] py-5 px-7 flex-col">
                    <h2 className="font-bold mb-5">Filter Fieldnames</h2>
                    <div className="flex gap-5">
                        <div className="">
                            <h3 className="font-semibold mb-3">Field Names:</h3>
                            <ul className="list-disc list-inside space-y-2 h-96 overflow-y-auto border-[1px] p-5">
                                {(Array.isArray(OriginalFieldNames)
                                    ? OriginalFieldNames
                                    : []
                                ).map((field: string, index: number) => (
                                    <li key={index}>
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            value={field}
                                            onChange={(e) =>
                                                handleFieldNameChange(e, field)
                                            }
                                        />
                                        <span>{field}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            
                        </div>
                        <div className="">
                            <h3 className="font-bold mb-3">
                                Selected Field Names:
                            </h3>
                            <ul className="list-disc list-inside space-y-2 h-96 overflow-y-auto border-[1px] p-5">
                                {(Array.isArray(ingestionFormState.selectedFields)
                                    ? ingestionFormState.selectedFields
                                    : []
                                ).map((field: string, index: number) => (
                                    <li key={index}>
                                        <span>{field}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
