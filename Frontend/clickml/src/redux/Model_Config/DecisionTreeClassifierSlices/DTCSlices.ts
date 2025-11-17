import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Decision Tree Classifier Model Config Interface -------------//

interface DecisionTreeClassifierConfig {
    criterion: string;
    splitter: string;
    maxDepth: number | null;
    minSamplesSplit: number;
    minSamplesLeaf: number;
    maxFeatures: string | null;
}

const initialDTConfigState: DecisionTreeClassifierConfig = {
    criterion: 'gini',
    splitter: 'best',
    maxDepth: null,
    minSamplesSplit: 2,
    minSamplesLeaf: 1,
    maxFeatures: null,
};  

export const DTCSlices = createSlice({
    name: 'decisionTreeClassifierConfig',
    initialState: initialDTConfigState,
    reducers: {
        updateDecisionTreeClassifierConfig: (state, action: PayloadAction<Partial<DecisionTreeClassifierConfig>>) => {
            return { ...state, ...action.payload };
        },
        resetDecisionTreeClassifierConfig: () => initialDTConfigState,
    },
});

export const { updateDecisionTreeClassifierConfig, resetDecisionTreeClassifierConfig } = DTCSlices.actions;
export const dtcConfigReducer = DTCSlices.reducer;