import {createSlice, PayloadAction} from "@reduxjs/toolkit";

//------------- API URL Response Interface -------------//

interface FieldsName {
    OriginalFieldsName: string[];
    FilteredFieldsName : string[];
}

const initialFieldsNameState: FieldsName = {
    OriginalFieldsName: [],
    FilteredFieldsName: [],
}

const FieldNameSlices = createSlice({
    name: "fieldNames",
    initialState: initialFieldsNameState,
    reducers: {
        updateOriginalFieldsName: (state, action: PayloadAction<string[]>) => {
            state.OriginalFieldsName = action.payload;
        },
        updateFilteredFieldsName: (state, action: PayloadAction<string[]>) => {
            state.FilteredFieldsName = action.payload;
        },
        resetFieldNames: () => initialFieldsNameState,
        resetFilteredFieldsName: (state) => {
            state.FilteredFieldsName = [];
        }
    },
});

export const { updateOriginalFieldsName, updateFilteredFieldsName, resetFieldNames } = FieldNameSlices.actions;
export const fieldNamesReducer = FieldNameSlices.reducer;
export default FieldNameSlices;