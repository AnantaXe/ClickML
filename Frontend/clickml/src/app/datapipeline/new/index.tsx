"use client";
import { useState } from "react";
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
    resetSelectedFields,
    resetURLVerification,
    updateTransformationConfig,
} from "@/redux/Features/FormStatesSlices/FormStateSlices";
import {
    updateFilteredFieldsName,
    updateOriginalFieldsName,
    resetFieldNames,
} from "@/redux/Features/FieldNameSlices/FieldNameSlices";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function NewDataPipeline() {
    const Forms = ["Ingestion", "Transformation", "Enrichment", "Monitoring"];
    const [activeForm, setActiveForm] = useState(Forms[0]);
    const [filterPreview, setFilterPreview] = useState(false);

    const sourceState = useAppSelector((state) => state.sourceState);
    const urlVerificationStatus = useAppSelector(
        (state) => state.urlVerification
    );

    const OriginalFieldNames = useAppSelector(
        (state) => state.fieldnames.OriginalFieldsName
    );
    const FilteredFieldNames = useAppSelector(
        (state) => state.fieldnames.FilteredFieldsName
    );

    const [filtering, setFiltering] = useState(false);
    const [stepThreeLoaded, setStepThreeLoaded] = useState(false);
    const [filterMessage, setFilterMessage] = useState("");

    const dispatch = useAppDispatch();

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
            setFiltering(false);
            return;
        }
        setFilterMessage("Filtered Successfully !");
        setFiltering(false);
        setStepThreeLoaded(true);
    }

    function handleValidation(activeForm: string, event: React.FormEvent) {
        event.preventDefault();
        dispatch(resetURLVerification());

        if (activeForm === "Ingestion") {
            if (sourceState.sourceType === "api") {
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
                const apiKey = sourceState.sourceConfig.apiKey || "";

                fetch("http://localhost:3002/etl/validateApi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apiUrl, apiKey }),
                })
                    .then((res) => res.json())
                    .then((data) => {
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
            }
        }
    }

    const handleSubmit = (activeForm: string) => {
        setFilterMessage("");
        setStepThreeLoaded(false);
        dispatch(resetFieldNames());
        dispatch(resetSelectedFields());

        if (activeForm === "Ingestion") {
            fetch("http://localhost:3002/etl/api/apipreview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sourceState.sourceConfig),
            })
                .then((res) => res.json())
                .then((data) => {
                    setFilterPreview(true);
                    dispatch(updateOriginalFieldsName(data));
                })
                .catch((error) => {
                    console.error("Error in API Preview:", error);
                });
        }
    };

    const handleFieldNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        const isChecked = e.target.checked;
        let updatedFilteredFields: string[] = [];
        if (isChecked) {
            updatedFilteredFields = FilteredFieldNames.includes(field)
                ? [...FilteredFieldNames]
                : [...FilteredFieldNames, field];
        } else {
            updatedFilteredFields = FilteredFieldNames.filter(
                (f) => f !== field
            );
        }
        dispatch(updateFilteredFieldsName(updatedFilteredFields));
        dispatch(
            updateTransformationConfig({
                transformationLogic: { selectedFields: updatedFilteredFields },
            })
        );
    };

    return (
        <div className="flex flex-col gap-6 text-gray-300">
            {/* Step 1 & 2 Container */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Panel: Form Selection & Input */}
                <div className="flex-1 border border-[#333333] rounded-lg bg-[#1A1A1A] overflow-hidden">
                    <div className="bg-[#222222] px-6 py-4 border-b border-[#333333]">
                        <h1 className="font-semibold text-lg text-white">
                            1. Configure Source
                        </h1>
                    </div>

                    <div className="p-6">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#333333] pb-4">
                            {Forms.map((form) => (
                                <button
                                    key={form}
                                    onClick={() => {
                                        setActiveForm(form);
                                        dispatch(resetEnrichmentForm());
                                        dispatch(resetIngestionForm());
                                        dispatch(resetTransformationForm());
                                        dispatch(resetMonitoringForm());
                                        dispatch(resetURLVerification());
                                        dispatch(resetFieldNames());
                                        dispatch(resetSelectedFields());
                                        setFilterPreview(false);
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeForm === form
                                            ? "bg-blue-600 text-white"
                                            : "bg-[#2A2A2A] text-gray-400 hover:bg-[#333333] hover:text-white"
                                    }`}
                                >
                                    {form}
                                </button>
                            ))}
                        </div>

                        {/* Rendering Active Form */}
                        <div className="mb-8">
                            {activeForm === "Ingestion" && <IngestionForm />}
                            {activeForm === "Transformation" && (
                                <TransformationForm />
                            )}
                            {activeForm === "Enrichment" && <EnrichmentForm />}
                            {activeForm === "Monitoring" && <MonitoringForm />}
                        </div>

                        {/* Validation & Fetch Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#333333]">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) =>
                                        handleValidation(activeForm, e)
                                    }
                                    className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-md transition-colors text-sm font-medium"
                                >
                                    Validate API
                                </button>

                                <div className="flex items-center gap-2">
                                    {urlVerificationStatus.isValid === 2 && (
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    )}
                                    {urlVerificationStatus.isValid === 1 && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    {urlVerificationStatus.isValid === -1 && (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}

                                    <span
                                        className={`text-sm font-medium ${
                                            urlVerificationStatus.isValid === 1
                                                ? "text-green-500"
                                                : urlVerificationStatus.isValid ===
                                                  -1
                                                ? "text-red-500"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {
                                            urlVerificationStatus.urlVerificationMessage
                                        }
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSubmit(activeForm)}
                                disabled={urlVerificationStatus.isValid !== 1}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    urlVerificationStatus.isValid === 1
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-[#2A2A2A] text-gray-600 cursor-not-allowed"
                                }`}
                            >
                                Fetch Features
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Field Filtering */}
                {filterPreview && (
                    <div className="flex-1 border border-[#333333] rounded-lg bg-[#1A1A1A] overflow-hidden flex flex-col">
                        <div className="bg-[#222222] px-6 py-4 border-b border-[#333333]">
                            <h1 className="font-semibold text-lg text-white">
                                2. Filter Fields
                            </h1>
                        </div>

                        <div className="p-6 flex-1 flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row gap-4 h-96">
                                {/* Available Fields */}
                                <div className="flex-1 flex flex-col border border-[#333333] rounded-md bg-[#0a0a0a]">
                                    <h3 className="px-4 py-2 border-b border-[#333333] text-xs font-semibold text-gray-500 uppercase">
                                        Available Fields
                                    </h3>
                                    <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {(Array.isArray(OriginalFieldNames)
                                            ? OriginalFieldNames
                                            : []
                                        ).map(
                                            (field: string, index: number) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2 p-2 hover:bg-[#222222] rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={field}
                                                        onChange={(e) =>
                                                            handleFieldNameChange(
                                                                e,
                                                                field
                                                            )
                                                        }
                                                        className="rounded border-gray-600 bg-[#333333] text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        {field}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                {/* Arrow Indicator */}
                                <div className="flex md:flex-col items-center justify-center text-gray-600">
                                    <ArrowRight className="w-6 h-6 md:rotate-0 rotate-90" />
                                </div>

                                {/* Selected Fields */}
                                <div className="flex-1 flex flex-col border border-[#333333] rounded-md bg-[#0a0a0a]">
                                    <h3 className="px-4 py-2 border-b border-[#333333] text-xs font-semibold text-gray-500 uppercase">
                                        Selected
                                    </h3>
                                    <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {(Array.isArray(FilteredFieldNames)
                                            ? FilteredFieldNames
                                            : []
                                        ).map(
                                            (field: string, index: number) => (
                                                <li
                                                    key={index}
                                                    className="px-3 py-2 bg-[#222222] rounded text-sm text-blue-400"
                                                >
                                                    {field}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
                                <div className="flex items-center gap-3">
                                    {filtering && (
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    )}
                                    <span className="text-sm text-green-500 h-5">
                                        {filterMessage}
                                    </span>
                                </div>

                                <button
                                    onClick={() =>
                                        handleFilterationAndLoadDestinationForm()
                                    }
                                    disabled={!FilteredFieldNames?.length}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        FilteredFieldNames?.length
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-[#2A2A2A] text-gray-600 cursor-not-allowed"
                                    }`}
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Step 3: Target/Destination */}
            {stepThreeLoaded && (
                <div className="border border-[#333333] rounded-lg bg-[#1A1A1A] overflow-hidden mt-6">
                    <div className="bg-[#222222] px-6 py-4 border-b border-[#333333]">
                        <h1 className="font-semibold text-lg text-white">
                            3. Configure Destination
                        </h1>
                    </div>
                    <div className="p-6">
                        <TargetForm />
                    </div>
                </div>
            )}
        </div>
    );
}
