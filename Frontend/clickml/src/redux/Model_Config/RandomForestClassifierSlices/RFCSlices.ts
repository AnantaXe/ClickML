import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Random Forest Classifier Model Config Interface -------------//

interface RandomForestClassifierConfig {
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

const initialRFCConfigState: RandomForestClassifierConfig = {
    nEstimators: 100,
    criterion: 'gini',
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
    bootstrap: true,
    oobScore: false,
    nJobs: null,
};

export const RFCSlices = createSlice({
    name: 'randomForestClassifierConfig',
    initialState: initialRFCConfigState,
    reducers: {
        updateRandomForestClassifierConfig: (state, action: PayloadAction<Partial<RandomForestClassifierConfig>>) => {
            return { ...state, ...action.payload };
        },
        resetRandomForestClassifierConfig: () => initialRFCConfigState,
    },
});

export const { updateRandomForestClassifierConfig, resetRandomForestClassifierConfig } = RFCSlices.actions;
export const rfcConfigReducer = RFCSlices.reducer;