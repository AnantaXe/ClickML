import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//----------------- Deployment States -------------------//

interface DeploymentState {
    isDeployed: number;
    deploymentMessage: string;
}

const initialDeploymentState: DeploymentState = {
    isDeployed: 0, // 1 = deployed, 0 = not checked, -1 = failed, 2 = deploying
    deploymentMessage: "",
};

//----------------- Destination States -------------------//

interface DestinationState {
    // isActive: boolean;
    destinationType: string;
    destinationConfig: Record<string, unknown>
    destinationTable: string;
}


const initialDestinationState: DestinationState = {
    // isActive: false,
    destinationType: "",
    destinationConfig: {} as Record<string, unknown>,
    destinationTable: "",
};

// ----------------- Source States -------------------//

interface SourceState {
    sourceType: string;
    sourceConfig: Record<string, unknown>;
    sourceQuery?: string;
}

const initialSourceState: SourceState = {
    sourceType: "",
    sourceConfig: {} as Record<string, unknown>,
    sourceQuery: "",
};

// ----------------- Transformation States -------------------//

interface TransformationConfigState {
    transformationLogic: Record<string, unknown>;
}

const initialTransformationConfigState: TransformationConfigState = {
    transformationLogic: {} as Record<string, unknown>,
};

//----------------- Ingestion Form State and Initial State -----------------//

interface IngestionFormState {
    pipelineName: string;
    cron: string;
    sourceType: string;
    sourceConfig: Record<string, unknown>;
    selectedFields?: string[];
    formType: string;
    // DestinationType?: string;
    // DestinationConfig?: Record<string, unknown>;
}

const initialIngestionFormState: IngestionFormState = {
    pipelineName: "",
    cron: "0 2 * * *",
    sourceType: "",
    sourceConfig: {} as Record<string, unknown>,
    formType: "Ingestion",
    // Destination: initialDestinationState

};

interface AlterIngestionForm {
    pipelineName: string;
    cron: string;
    description: string;
}

const initialAlterIngestionForm: AlterIngestionForm = {
    pipelineName: "",
    cron: "0 2 * * *",
    description: "",
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


//----------------- Destination state -----------------//

interface DestinationConnectionStatus {
    isConnected: number; // 1 = connected, 0 = not checked, -1 = failed
    connectionMessage: string;
}

const initialDestinationConnectionStatus: DestinationConnectionStatus = {
    isConnected: 0,
    connectionMessage: "",
};


//----------------- Redux Slices -----------------//

export const SourceStateSlice = createSlice({
    name: "sourceState",
    initialState: initialSourceState,
    reducers: {
        updateSourceState: (
            state,
            action: PayloadAction<Partial<SourceState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetSourceState: () => initialSourceState,
    },
});

export const AlterIngestionFormSlice = createSlice({
    name: "alterIngestionForm",
    initialState: initialAlterIngestionForm,
    reducers: {
        updateAlterIngestionForm: (
            state,
            action: PayloadAction<Partial<AlterIngestionForm>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetAlterIngestionForm: () => initialAlterIngestionForm,
    },
});

export const transformationConfigSlice = createSlice({
    name: "transformationConfig",
    initialState: initialTransformationConfigState,
    reducers: {
        updateTransformationConfig: (
            state,
            action: PayloadAction<Partial<TransformationConfigState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetTransformationConfigState: () => initialTransformationConfigState,
    },
});

export const deploymentSlice = createSlice({
    name: "deployment",
    initialState: initialDeploymentState,
    reducers: {
        updateDeploymentStatus: (state, action: PayloadAction<Partial<DeploymentState>>) => {
            return { ...state, ...action.payload };
        },
        resetDeploymentStatus: () => initialDeploymentState,
    },
});

export const destinationConnectionSlice = createSlice({
    name: "destinationConnection",
    initialState: initialDestinationConnectionStatus,
    reducers: {
        updateConnectionStatus: (state, action: PayloadAction<Partial<DestinationConnectionStatus>>) => {
            return { ...state, ...action.payload };
        },
        resetConnectionStatus: () => initialDestinationConnectionStatus,
    },
});

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
        },
        resetSelectedFields: (state) => {
            state.selectedFields = [];
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

export const destinationSlice = createSlice({
    name: "destination",
    initialState: initialDestinationState,
    reducers: {
        updateDestination: (
            state,
            action: PayloadAction<Partial<DestinationState>>
        ) => {
            return { ...state, ...action.payload };
        },
        resetDestination: () => initialDestinationState,
        resetDestinationConfig: (state) => {
            state.destinationConfig = {};
        }
    },
});


export const { updateDeploymentStatus, resetDeploymentStatus } = deploymentSlice.actions;
export const { updateIngestionForm, resetIngestionForm, resetSourceConfig, resetSelectedFields } = ingestionSlice.actions;
export const { updateTransformationForm, resetTransformationForm } = transformationSlice.actions;
export const { updateEnrichmentForm, resetEnrichmentForm } = enrichmentSlice.actions;
export const { updateMonitoringForm, resetMonitoringForm } = monitoringSlice.actions;
export const { updateAlterIngestionForm, resetAlterIngestionForm } = AlterIngestionFormSlice.actions;
export const { updateURLVerification, resetURLVerification } = urlVerificationSlice.actions;
export const { updateDestination, resetDestination, resetDestinationConfig } = destinationSlice.actions;
export const { updateConnectionStatus, resetConnectionStatus } = destinationConnectionSlice.actions;
export const { updateTransformationConfig, resetTransformationConfigState } = transformationConfigSlice.actions;
export const { updateSourceState, resetSourceState } = SourceStateSlice.actions;
export const destinationConnectionReducer = destinationConnectionSlice.reducer;
export const urlVerificationReducer = urlVerificationSlice.reducer;
export const enrichmentReducer = enrichmentSlice.reducer;
export const ingestionReducer = ingestionSlice.reducer;
export const alterIngestionFormReducer = AlterIngestionFormSlice.reducer;
export const transformationReducer = transformationSlice.reducer;
export const monitoringReducer = monitoringSlice.reducer;
export const destinationReducer = destinationSlice.reducer;
export const deploymentReducer = deploymentSlice.reducer;
export const transformationConfigReducer = transformationConfigSlice.reducer;
export const sourceStateReducer = SourceStateSlice.reducer;