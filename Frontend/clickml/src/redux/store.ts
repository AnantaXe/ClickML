import { configureStore } from "@reduxjs/toolkit";
import { fieldNamesReducer } from "./Features/FieldNameSlices/FieldNameSlices";
import { dtcConfigReducer } from "./Model_Config/DecisionTreeClassifierSlices/DTCSlices";
import { lrConfigReducer } from "./Model_Config/LinearRegressionSlices/LRSlices";
import { rfrConfigReducer } from "./Model_Config/RandomForestRegressorSlices/RFRSlices";
import { dtrConfigReducer } from "./Model_Config/DecisionTreeRegressorSlices/DTRSlices";
import { rfcConfigReducer } from "./Model_Config/RandomForestClassifierSlices/RFCSlices";
import { modelDataSourceReducer } from "./Model_Config/SourceSlices/SourceSlices";
import {
    enrichmentReducer,
    urlVerificationReducer,
    ingestionReducer,
    transformationReducer,
    monitoringReducer,
    destinationReducer,
    destinationConnectionReducer,
    deploymentReducer,
    alterIngestionFormReducer,
    transformationConfigReducer,
    sourceStateReducer
} from "./Features/FormStatesSlices/FormStateSlices";



export const store = configureStore({
    reducer: {
        ingestion: ingestionReducer,
        transformation: transformationReducer,
        enrichment: enrichmentReducer,
        monitoring: monitoringReducer,
        urlVerification: urlVerificationReducer,
        fieldnames: fieldNamesReducer,
        destination: destinationReducer,
        destinationConnection: destinationConnectionReducer,
        deployment: deploymentReducer,
        alterIngestion: alterIngestionFormReducer,
        transformationConfig: transformationConfigReducer,
        sourceState: sourceStateReducer,
        dtcConfig: dtcConfigReducer,
        lrConfig: lrConfigReducer,
        rfrConfig: rfrConfigReducer,
        dtrConfig: dtrConfigReducer,
        rfcConfig: rfcConfigReducer,
        modelDataSourceConfig: modelDataSourceReducer,
    },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the reducer object
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
