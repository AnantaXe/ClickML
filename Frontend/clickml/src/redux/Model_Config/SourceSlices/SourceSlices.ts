import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//------------- Model Data Source Config Interface -------------//

interface ModelDataSourceState {
    sourceType: string;
    sourceDetails: Record<string, unknown>;
}   

const initialSourceState: ModelDataSourceState = {
    sourceType: '',
    sourceDetails: {},
};

export const ModelDataSourceSlices = createSlice({
    name: 'modelDataSourceConfig',
    initialState: initialSourceState,
    reducers: {
        updateModelDataSourceState: (state, action: PayloadAction<Partial<ModelDataSourceState>>) => {
            return { ...state, ...action.payload };
        },
        resetModelDataSourceState: () => initialSourceState,
    },
});

export const { updateModelDataSourceState, resetModelDataSourceState } = ModelDataSourceSlices.actions;
export const modelDataSourceReducer = ModelDataSourceSlices.reducer;