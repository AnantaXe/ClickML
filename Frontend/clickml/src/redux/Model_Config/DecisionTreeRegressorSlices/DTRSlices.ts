import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Decision Tree Regressor Model Config Interface -------------//

interface DecisionTreeRegressorConfig {
    criterion: string;
    splitter: string;
    maxDepth: number | null;
    minSamplesSplit: number;
    minSamplesLeaf: number;
    maxFeatures: string | null;
}

const initialDTRConfigState: DecisionTreeRegressorConfig = {
    criterion: 'mse',
    splitter: 'best',
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
};

export const DTRSlices = createSlice({
    name: 'decisionTreeRegressorConfig',
    initialState: initialDTRConfigState,
    reducers: {
        updateDecisionTreeRegressorConfig: (state, action: PayloadAction<Partial<DecisionTreeRegressorConfig>>) => {
            return { ...state, ...action.payload };
        },
        resetDecisionTreeRegressorConfig: () => initialDTRConfigState,
    },
});

export const { updateDecisionTreeRegressorConfig, resetDecisionTreeRegressorConfig } = DTRSlices.actions;
export const dtrConfigReducer = DTRSlices.reducer;