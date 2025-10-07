"use client";
import { useState } from "react";
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
} from "@/redux/Features/FormStatesSlices/FormStateSlices";

export default function NewDataPipeline() {
    const Forms = ["Ingestion", "Transformation", "Enrichment", "Monitoring"];
    const [activeForm, setActiveForm] = useState(Forms[0]);

    const ingestionFormState = useAppSelector((state) => state.ingestion);
    const transformationFormState = useAppSelector(
        (state) => state.transformation
    );
    const enrichmentFormState = useAppSelector((state) => state.enrichment);
    const monitoringFormState = useAppSelector((state) => state.monitoring);

    // const dispatch = useAppDispatch(resetEnrichmentForm());
    const dispatch = useAppDispatch();

    return (
        <>
            <div>
                <h2>Create a New Data Pipeline</h2>
            </div>

            <ul>
                {Forms.map((form) => (
                    <li
                        key={form}
                        className="cursor-pointer m-5 border-b-2"
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
            {activeForm === "Transformation" && <TransformationForm />}
            {activeForm === "Enrichment" && <EnrichmentForm />}
            {activeForm === "Monitoring" && <MonitoringForm />}

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

            <button type="submit">Create Pipeline</button>
        </>
    );
}
