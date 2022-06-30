import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import {useHttp} from '../hooks/http.hook'


export const heroesFetch = createAsyncThunk(
    'heroes/heroesFetch',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/heroes")
    }
)

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroDelete: (state, action) => {
            heroesAdapter.removeOne(state, action.payload);
        },
        heroAdd: (state, action) => {
            heroesAdapter.addOne(state, action.payload);
    }},
    extraReducers: (builder) => {
        builder
            .addCase(heroesFetch.pending, (state) => {
                state.heroesLoadingStatus = 'loading'
            })
            .addCase(heroesFetch.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                heroesAdapter.setAll(state, action.payload)
            })
            .addCase(heroesFetch.rejected, (state) => {
                state.heroesLoadingStatus = 'error'
            })
            .addDefaultCase(() => {})
    }
});


const {actions, reducer} = heroesSlice;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const filterHeroesSelector = createSelector(
    selectAll,
    (state) => state.filters.active,
    (heroes, active) => {
        if(active[0] === "all"){
            return heroes
        }
        else{
            return heroes.filter(hero => hero.element === active[0])
        }
    }
);


export const {heroDelete,
              heroAdd} = actions;

export default reducer;