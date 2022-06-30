import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import {useHttp} from '../hooks/http.hook'


export const filtersFetch = createAsyncThunk(
    'filters/filtersFetch',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters")
    }
);


const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
    active: ['all', ''],
    filterLoadingStatus: 'idle'
});


const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        filterClick: (state, action) =>{
            state.active = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filtersFetch.pending, (state) => {
                state.filterLoadingStatus = 'loading'
            })
            .addCase(filtersFetch.fulfilled, (state, action) => {
                state.filterLoadingStatus = 'idle';
                filterAdapter.setAll(state, action.payload)
            })
            .addCase(filtersFetch.rejected, (state) => {
                state.filterLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    }
})

const {reducer, actions} = filterSlice;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters)

export default reducer;
export const {filterClick} = actions;