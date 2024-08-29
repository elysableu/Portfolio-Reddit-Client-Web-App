import { createSlice } from '@reduxjs/toolkit';
import { getSubreddits } from '../api/reddit-api'; 

const initialState = {
    subReddits: [],
    error: false,
    isLoading: false
};

const subRedditSlice= createSlice({
    name: 'subreddits',
    initialState,
    reducers: {
        startGetSubreddits: (state) => {
            state.isLoading = true;
            state.error = false;
        },
        getSubredditsSucces: (state, action) => {
            state.isLoading = false;
            state.subReddits = action.payload;
        },
        getSubredditsFailed: (state) => {
            state.isLoading = false;
            state.error = true;
        }
    }
});


//export actions
export const {
    startGetSubreddits,
    getSubredditsSucces,
    getSubredditsFailed,
} = subRedditSlice.actions;

//export reducers
export default subRedditSlice.reducer;


//Redux thunk that gets subreddits
export const fetchSubreddits = () => async dispatch => {
    try {
        dispatch(startGetSubreddits());
        const subreddits = await getSubreddits();
        dispatch(getSubredditsSucces(subreddits));
    } catch (error) {
        dispatch(getSubredditsFailed());
    }
};

//Export selectors
export const selectSubreddits = (state) => state.subreddits.subreddits;
