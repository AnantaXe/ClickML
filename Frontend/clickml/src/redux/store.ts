import { configureStore } from "@reduxjs/toolkit";
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
import { fieldNamesReducer } from "./Features/FieldNameSlices/FieldNameSlices";

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
    },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the reducer object
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
