"use client";
import { useState } from "react";
import Image from "next/image";
const NotOk = "/images/notOk.png";
const Ok = "/images/ok.png";
const Arrow = "/images/arrow.png";
const Loading = "/images/loading.gif";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/hooks";
import {
    IngestionForm,
    EnrichmentForm,
    MonitoringForm,
    TransformationForm,
    TargetForm,
} from "@/app/components/Forms";
import {
    resetEnrichmentForm,
    resetIngestionForm,
    resetMonitoringForm,
    resetTransformationForm,
    updateURLVerification,
    updateSourceState,
    resetSelectedFields,
    resetURLVerification,
    updateTransformationConfig,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";
import {
    updateFilteredFieldsName,
    updateOriginalFieldsName,
    resetFieldNames,
} from "@/redux/Features/FieldNameSlices/FieldNameSlices";

export default function NewDataPipeline() {
    const Forms = ["Ingestion", "Transformation", "Enrichment", "Monitoring"];
    const [activeForm, setActiveForm] = useState(Forms[0]);

    const [filterPreview, setFilterPreview] = useState(false);

    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const sourceState = useAppSelector((state) => state.sourceState);
    // const transformationFormState = useAppSelector(
    //     (state) => state.transformation
    // );
    // const enrichmentFormState = useAppSelector((state) => state.enrichment);
    // const monitoringFormState = useAppSelector((state) => state.monitoring);

    //----------- url verification status -----------//

    const urlVerificationStatus = useAppSelector(
        (state) => state.urlVerification
    );

    //----------- Field Names -----------//

    const OriginalFieldNames = useAppSelector(
        (state) => state.fieldnames.OriginalFieldsName
    );
    const FilteredFieldNames = useAppSelector(
        (state) => state.fieldnames.FilteredFieldsName
    );

    //----------- Step Two Handler -----------//
    // const [stepThreeLoading, setStepThreeLoading] = useState(false);
    const [filtering, setFiltering] = useState(false);
    const [stepThreeLoaded, setStepThreeLoaded] = useState(false);
    const [filterMessage, setFilterMessage] = useState("");
    // const handleStepTwo = () => {
    //     setStepTwoLoading(true); // temporary Setting please remove later
    // }

    function handleFilterationAndLoadDestinationForm() {
        setFiltering(true);
        setFilterMessage("Filtering...");
        if (
            !(
                urlVerificationStatus.isValid === 1 &&
                FilteredFieldNames?.length !== 0
            )
        ) {
            setFilterMessage("Unable to proceed, Please check above !");
            return;
        }
        // setStepThreeLoading(true); // temporary Setting please remove later
        setFilterMessage("Filtered Successfully !");
        setFiltering(false);
        setStepThreeLoaded(true);
    }

    // const dispatch = useAppDispatch(resetEnrichmentForm());
    const dispatch = useAppDispatch();

    //----------- handle form Validation -----------//

    function handleValidation(activeForm: string, event: React.FormEvent) {
        event.preventDefault();
        console.log("Active Form:", activeForm);
        // Reset URL verification status

        dispatch(resetURLVerification());

        console.log(sourceState)
        if (activeForm === "Ingestion") {
            // formData = JSON.stringify(ingestionFormState);
            console.log(sourceState)
            if (sourceState.sourceType === "api") {
                console.log(sourceState)
                if (!sourceState.sourceConfig.apiUrl) {
                    dispatch(
                        updateURLVerification({
                            isValid: -1,
                            urlVerificationMessage: "Please enter API URL",
                        })
                    );
                    return;
                }
                dispatch(
                    updateURLVerification({
                        isValid: 2,
                        urlVerificationMessage: "Validating...",
                    })
                );
                const apiUrl = sourceState.sourceConfig.apiUrl;
                const apiKey = sourceState.sourceConfig.apiKey
                    ? sourceState.sourceConfig.apiKey
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
        setFilterMessage("");
        setStepThreeLoaded(false);
        dispatch(resetFieldNames());
        dispatch(resetSelectedFields());
        // setStepThreeLoading(false); // temporary Setting please remove later
        console.log(sourceState)
        if (activeForm === "Ingestion") {
            const response = fetch("http://localhost:3002/etl/api/apipreview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sourceState.sourceConfig),
            })
                .then((res) => res.json())
                .then((data) => {
                    setFilterPreview(true);
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
            // updateIngestionForm({ selectedFields: updatedFilteredFields })
            updateTransformationConfig({
                transformationLogic: { selectedFields: updatedFilteredFields },
            })
        );
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className={`border-[1px] flex-1/2`}>
                        <div className="bg-gray-400 px-10 py-5 mb-5 font-bold">
                            <h1>/ Create a New Data Pipeline</h1>
                        </div>
                        <div className="px-10">
                            <ul className={`flex space-x-4 border-b mb-5`}>
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

                                            dispatch(resetURLVerification());
                                            dispatch(resetFieldNames());
                                            dispatch(resetSelectedFields());
                                            setFilterPreview(false);
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

                            <div className="flex justify-between my-10">
                                <div className="flex gap-2 items-center">
                                    <button
                                        type="submit"
                                        className="bg-gray-700 text-white p-3 px-4 rounded cursor-pointer hover:bg-gray-800"
                                        onClick={(e) =>
                                            handleValidation(activeForm, e)
                                        }
                                    >
                                        Validate API
                                    </button>
                                    <div
                                        className={`url-verification-box w-5 h-5 ${
                                            urlVerificationStatus.isValid !== 2
                                                ? "border-[1px]"
                                                : ""
                                        }`}
                                    >
                                        {urlVerificationStatus.isValid !== 0 &&
                                            urlVerificationStatus.isValid !==
                                                2 && (
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
                                        {urlVerificationStatus.isValid ===
                                            2 && (
                                            <Image
                                                src={Loading}
                                                alt="Loading..."
                                                width={40}
                                                height={40}
                                                unoptimized={true}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={`${
                                            urlVerificationStatus.isValid ===
                                                1 ||
                                            urlVerificationStatus.isValid === 2
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
                                        
                                        onClick={() => handleSubmit(activeForm)}
                                    >
                                        Fetch Feautures
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`Preview-Container flex flex-1/2 border-[1px] flex-col justify-start gap-3`}
                    >
                        <div className="bg-gray-400 px-10 py-5 mb-5 font-bold">
                            <h1>/ Filter Fieldnames</h1>
                        </div>
                        <div className="flex gap-5 justify-center items-center py-5 px-7">
                            <div
                                className={`${
                                    filterPreview ? "" : "hidden"
                                } flex-1/2`}
                            >
                                <h3 className="font-semibold mb-3">
                                    Field Names:
                                </h3>
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
                                                    handleFieldNameChange(
                                                        e,
                                                        field
                                                    )
                                                }
                                            />
                                            <span>{field}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div
                                className={`${
                                    filterPreview ? "" : "hidden"
                                } flex flex-col gap-3`}
                            >
                                <Image
                                    src={Arrow}
                                    alt=""
                                    width={20}
                                    height={20}
                                />
                                <Image
                                    src={Arrow}
                                    alt=""
                                    width={20}
                                    height={20}
                                />
                                <Image
                                    src={Arrow}
                                    alt=""
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div
                                className={`${
                                    filterPreview ? "" : "hidden"
                                } flex-1/2`}
                            >
                                <h3 className="font-bold mb-3">
                                    Selected Field Names:
                                </h3>
                                <ul className="list-disc list-inside space-y-2 h-96 overflow-y-auto border-[1px] p-5">
                                    {(Array.isArray(
                                        FilteredFieldNames
                                    )
                                        ? FilteredFieldNames
                                        : []
                                    ).map((field: string, index: number) => (
                                        <li key={index}>
                                            <span>{field}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div
                            className={`pb-5 px-7 ${
                                filterPreview ? "" : "hidden"
                            }`}
                        >
                            <div className="flex gap-2 items-center justify-start">
                                <button
                                    type="submit"
                                    className={`bg-green-800 text-white py-3 px-5 rounded cursor-pointer ${
                                        urlVerificationStatus.isValid === 1 &&
                                        FilteredFieldNames
                                            ?.length !== 0
                                            ? "hover:bg-green-900"
                                            : "opacity-50 cursor-not-allowed"
                                    }`}
                                    disabled={
                                        urlVerificationStatus.isValid === 1 &&
                                        FilteredFieldNames
                                            ?.length !== 0
                                            ? false
                                            : true
                                    }
                                    onClick={() =>
                                        handleFilterationAndLoadDestinationForm()
                                    } // temporary setting please remove later
                                >
                                    Filter Fields
                                </button>
                                <div className="flex">
                                    <div
                                        className={`${
                                            filtering ? "" : "hidden"
                                        }`}
                                    >
                                        <Image
                                            src={Loading}
                                            alt="Loading..."
                                            width={20}
                                            height={20}
                                            unoptimized={true}
                                        />
                                    </div>
                                    <h1 className={`text-green-700`}>
                                        {filterMessage}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>{stepThreeLoaded && <TargetForm />}</div>
            </div>
        </>
    );
}
