"use client";
import { updateEnrichmentForm } from "@/redux/Features/FormStatesSlices/FormStateSlices";
// import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";

export default function EnrichmentForm() {

    const enrichmentFormState = useAppSelector((state) => state.enrichment);
    const dispatch = useAppDispatch();
    type EnrichmentFormState = typeof enrichmentFormState;

    const setEnrichmentFormState = (data: EnrichmentFormState) => {
        dispatch(updateEnrichmentForm(data));
    };

    return (
        <>
            <div className="space-y-3 w-2xl">
                <h2 className="font-bold text-xl">Enrichment Pipeline</h2>
                <input
                    placeholder="Pipeline Name"
                    value={enrichmentFormState.pipelineName}
                    onChange={(e) =>
                        setEnrichmentFormState({
                            ...enrichmentFormState,
                            pipelineName: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
                <input
                    placeholder="Enrichment API"
                    value={enrichmentFormState.enrichmentAPI}
                    onChange={(e) =>
                        setEnrichmentFormState({
                            ...enrichmentFormState,
                            enrichmentAPI: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
                <input
                    placeholder="API Key"
                    value={enrichmentFormState.apiKey}
                    onChange={(e) =>
                        setEnrichmentFormState({
                            ...enrichmentFormState,
                            apiKey: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Join Field"
                    value={enrichmentFormState.joinField}
                    onChange={(e) =>
                        setEnrichmentFormState({
                            ...enrichmentFormState,
                            joinField: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />

                <h3 className="font-semibold">Schedule (Cron)</h3>
                <input
                    placeholder="Cron (e.g. 0 * * * *)"
                    value={enrichmentFormState.cron}
                    // onChange={(e) =>
                    //     handleChange("enrichment", "cron", e.target.value)
                    // }
                    onChange={(e) =>
                        setEnrichmentFormState({
                            ...enrichmentFormState,
                            cron: e.target.value,
                        })
                    }
                    className="w-full border p-2 rounded"
                />
            </div>
        </>
    );
}