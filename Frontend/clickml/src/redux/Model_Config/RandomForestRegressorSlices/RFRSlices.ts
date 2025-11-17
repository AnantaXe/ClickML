import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Random Forest Regressor Model Config Interface -------------//

interface RandomForestRegressorConfig {
    nEstimators: number;
    criterion: string;
    maxDepth: number | null;
    minSamplesSplit: number;
    minSamplesLeaf: number;
    maxFeatures: string | null;
    bootstrap: boolean;
    oobScore: boolean;
    nJobs: number | null;
}

const initialRFRConfigState: RandomForestRegressorConfig = {
    nEstimators: 100,
    criterion: 'mse',
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
    bootstrap: true,
    oobScore: false,
    nJobs: null,
};

export const RFRSlices = createSlice({
    name: 'randomForestRegressorConfig',
    initialState: initialRFRConfigState,
    reducers: {
        updateRandomForestRegressorConfig: (state, action: PayloadAction<Partial<RandomForestRegressorConfig>>) => {
            return { ...state, ...action.payload };
        },
        resetRandomForestRegressorConfig: () => initialRFRConfigState,
    },
});

export const { updateRandomForestRegressorConfig, resetRandomForestRegressorConfig } = RFRSlices.actions;
export const rfrConfigReducer = RFRSlices.reducer;