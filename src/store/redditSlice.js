import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../api/reddit-api';

// InitialState
export const initialState = {
    posts: [],
    error: false,
    isLoading: false,
    searchTerm: '',
    selectedSubreddit: 'r/pics/',
};

//create redditSLice 
export const redditSlice = createSlice({
    name: 'redditPosts',
    initialState,
    reducers: {
        setposts: (state, action) => {
            state.posts = action.payload;
        },
        startGetPosts: (state) => {
            state.isLoading = true;
            state.error = false;
        },
        getPostsSuccess: (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        },
        getPostsFailed: (state) => {
            state.isLoading = false;
            state.error = true;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSelectedSubreddit: (state, action) => {
            state.selectedSubreddit = action.payload;
            state.searchTerm = '';
        },
        toggleShowingComments: (state, action) => {
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
        },
        startGetComments: (state, action) => {
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
            if (!state.posts[action.payload].showingComments) {
                return;
            }
            state.posts[action.payload].loadingComments = true;
            state.posts[action.payload].error = false;
        },
        getCommentsSuccess: (state, action) => {
            state.posts[action.payload.index].loadingComments = false;
            state.posts[action.payload.index].comments = action.payload.comments;
        },
        getCommentsFailed: (state, action) => {
            state.posts[action.payload].loadingComments = false;
            state.posts[action.payload].error = true;
        }  
    }
});


//export actions
 export const {
    setPosts, 
    startGetPosts,
    getPostsSuccess,
    getPostsFailed,
    setSearchTerm,
    setSelectedSubreddit,
    toggleShowingComments,
    startGetComments,
    getCommentsSuccess,
    getCommentsFailed,
 } = redditSlice.actions;

//export reducers
export default redditSlice.reducer;

// Redux thunk that gets posts from a subreddit
export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
        dispatch(startGetPosts());
        const posts = await getSubredditPosts(subreddit);

        const postsWithMetadata = posts.map((post) => ({
            ...post,
            showingComments: false,
            comments: [],
            loadingComments: false,
            errorComments: false,
        }));       
        dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
        dispatch(getPostsFailed());
    }
};


// Redux thunk that fetchs Comments 
export const fetchComments = (index, permalink) => async (dispatch) => {
    try {
        dispatch(startGetComments(index));
        const comments = await getPostComments(permalink);
        dispatch(getCommentsSuccess({index, comments}));
    } catch (error) {
        dispatch(getCommentsFailed(index));
    }
};

// set selectPosts and selectSearchTerm
const selectPosts = (state) => state.reddit.posts;
const selectSearchTerm = (state) => state.reddit.searchTerm;

// Createa and export selector for selectSelectedSubreddits
export const selectSelectedSubreddit = (state) => 
    state.reddit.selectSelectedSubreddit;

// Create selector for selectFilteredPosts
export const selectFilteredPosts = createSelector(
    [selectPosts, selectSearchTerm],
    (posts, searchTerm) => {
        if (searchTerm !== '') {
            return posts.filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return posts;
    }
);