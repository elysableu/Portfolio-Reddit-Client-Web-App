import { combineReducers, configureStore } from '@reduxjs/toolkit';
import redditReducer from './redditSlice';
import subRedditReducer from './subRedditSlice';

export default configureStore({
    reducer: combineReducers({
        reddit: redditReducer,
        subReddit: subRedditReducer,
    }),
});