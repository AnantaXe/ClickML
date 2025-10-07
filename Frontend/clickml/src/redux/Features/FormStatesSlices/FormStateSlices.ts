import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../../store";


//----------------- Ingestion Form State and Initial State -----------------//

interface IngestionFormState {
    pipelineName: string;
    cron: string;
    sourceType: string;
    sourceConfig: Record<string, unknown>;
    selectedFields?: string[];
    formType: string;
}

const initialIngestionFormState: IngestionFormState = {
    pipelineName: "",
    cron: "0 2 * * *",
    sourceType: "",
    sourceConfig: {} as Record<string, unknown>,
    formType: "Ingestion",
};

//-------------- Enrichment Form State and Initial State -----------------//

interface EnrichmentFormState {
    pipelineName: string;
    cron: string;
    enrichmentAPI: string;
    apiKey: string;
    joinField: string;
    formType: string;
}

const initialEnrichmentFormState: EnrichmentFormState = {
    pipelineName: "",
    cron: "0 */6 * * *",
    enrichmentAPI: "",
    apiKey: "",
    joinField: "",
    formType: "Enrichment",
};

//----------------- Transformation Form State and Initial State -----------------//

interface TransformationFormState {
    pipelineName: string;
    cron: string;
    sourceType: string;
    sourceConfig: Record<string, unknown>;
    transformationLogic: string;
    formType: string;
}

const initialTransformationFormState: TransformationFormState = {
    pipelineName: "",
    cron: "0 1 * * *",
    sourceType: "",
    sourceConfig: {} as Record<string, unknown>,
    transformationLogic: "",
    formType: "Transformation",
};

//----------------- Monitoring Form State and Initial State -----------------//

interface MonitoringFormState {
    pipelineName: string;
    cron: string;
    targetType: string;
    targetConfig: Record<string, unknown>;
    alertEmail: string;
    metric: string;
    formType: string;
}

const initialMonitoringFormState: MonitoringFormState = {
    pipelineName: "",
    cron: "*/10 * * * *",
    targetType: "",
    targetConfig: {} as Record<string, unknown>,
    alertEmail: "",
    metric: "",
    formType: "Monitoring",
};

//----------------- URL verification state -----------------//

interface URLVerification {
    isValid: number; // 1 = valid, 0 = not checked, -1 = invalid
    urlVerificationMessage: string;
}

const initialURLVerificationState: URLVerification = {
    isValid: 0,
    urlVerificationMessage: "",
};


//----------------- Redux Slices -----------------//

export const urlVerificationSlice = createSlice({
    name: "urlVerification",
    initialState: initialURLVerificationState,
    reducers: {
        updateURLVerification: (state, action: PayloadAction<Partial<URLVerification>>) => {
            return { ...state, ...action.payload };
        },
        resetURLVerification: () => initialURLVerificationState,
    },
});

export const ingestionSlice = createSlice({
    name: "ingestion",
    initialState: initialIngestionFormState,
    reducers: {
        updateIngestionForm: (
            state,
            action: PayloadAction<Partial<IngestionFormState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetIngestionForm: () => initialIngestionFormState,
        resetSourceConfig: (state) => {
            state.sourceConfig = {};
        }
    },
});

export const transformationSlice = createSlice({
    name: "transformation",
    initialState: initialTransformationFormState,
    reducers: {
        updateTransformationForm: (
            state,
            action: PayloadAction<Partial<TransformationFormState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetTransformationForm: () => initialTransformationFormState,
        resetSourceConfig: (state) => {
            state.sourceConfig = {};
        }
    },
});

export const enrichmentSlice = createSlice({
    name: "enrichment",
    initialState: initialEnrichmentFormState,
    reducers: {
        updateEnrichmentForm: (
            state,
            action: PayloadAction<Partial<EnrichmentFormState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetEnrichmentForm: () => initialEnrichmentFormState,
    },
});

export const monitoringSlice = createSlice({
    name: "monitoring",
    initialState: initialMonitoringFormState,
    reducers: {
        updateMonitoringForm: (
            state,
            action: PayloadAction<Partial<MonitoringFormState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetMonitoringForm: () => initialMonitoringFormState,
    },
});

export const { updateIngestionForm, resetIngestionForm, resetSourceConfig } = ingestionSlice.actions;
export const { updateTransformationForm, resetTransformationForm } =
    transformationSlice.actions;
export const { updateEnrichmentForm, resetEnrichmentForm } =
    enrichmentSlice.actions;
export const { updateMonitoringForm, resetMonitoringForm } =
    monitoringSlice.actions;

export const { updateURLVerification, resetURLVerification } = urlVerificationSlice.actions;

export const urlVerificationReducer = urlVerificationSlice.reducer;
export const enrichmentReducer = enrichmentSlice.reducer;
export const ingestionReducer = ingestionSlice.reducer;
export const transformationReducer = transformationSlice.reducer;
export const monitoringReducer = monitoringSlice.reducer;