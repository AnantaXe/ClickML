import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Linear Regression Model Config Interface -------------//

interface LinearRegressionConfig {
    fitIntercept: boolean;
    copyX: boolean;
    nJobs: number | null;
}

const initialLRConfigState: LinearRegressionConfig = {
    fitIntercept: true,
    copyX: true,
    nJobs: null,
};

export const LRSlices = createSlice({
    name: 'linearRegressionConfig',
    initialState: initialLRConfigState,
    reducers: {
        updateLinearRegressionConfig: (state, action: PayloadAction<Partial<LinearRegressionConfig>>) => {
            return { ...state, ...action.payload };
        },
        resetLinearRegressionConfig: () => initialLRConfigState,
    },
});

export const { updateLinearRegressionConfig, resetLinearRegressionConfig } = LRSlices.actions;
export const lrConfigReducer = LRSlices.reducer;