import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import agent from '../../agent';
import { isApiError, loadingReducer, Status } from '../../common/utils';
import { selectIsAuthenticated, selectUser } from '../auth/authSlice';


const commentAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ articleSlug, comment: newComment }, thunkApi) => {
    try {
      const { comment } = await agent.Comments.create(articleSlug, newComment);

      return comment;
    } catch (error) {
      if (isApiError(error)) {
        console.log('im herrrr4444444444444444444444444444411111111111111' )

        return thunkApi.rejectWithValue(error);
      }

      throw error;
    }
  },
);

export const getCommentsForArticle = createAsyncThunk(
  'comments/getCommentsForArticle',
  async (articleSlug) => {
    const { comments } = await agent.Comments.forArticle(articleSlug);

    return comments;
  }
);


export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async ({ articleSlug, commentId }) => {
    await agent.Comments.delete(articleSlug, commentId);
  }
);

const initialState = commentAdapter.getInitialState({
  status: Status.IDLE,
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createComment.pending, (state, action) => {
        state.status = Status.LOADING;

        if (action.meta.arg.comment.body) {
          commentAdapter.addOne(state, {
            ...action.meta.arg.comment,
            author: action.meta.author,
            id: action.meta.requestId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        commentAdapter.updateOne(state, {
          id: action.meta.requestId,
          changes: action.payload,
        });
        delete state.errors;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = Status.FAILURE;
        state.errors = action.payload?.errors;
        commentAdapter.removeOne(state, action.meta.requestId);
      });

    builder.addCase(getCommentsForArticle.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      commentAdapter.setAll(state, action.payload);
    });

    builder.addCase(removeComment.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      commentAdapter.removeOne(state, action.meta.arg.commentId);
    });

    builder.addMatcher(
      (action) => /comments\/.*\/pending/.test(action.type),
      loadingReducer
    );
  },
});

const selectCommentsSlice = (state) => state.comments;

const commentSelectors = commentAdapter.getSelectors(selectCommentsSlice);

export const selectAllComments = commentSelectors.selectAll;

const selectCommentById = (commentId) => (state) =>
  commentSelectors.selectById(state, commentId);

export const selectIsAuthor = (commentId) =>
  createSelector(
    selectCommentById(commentId),
    selectUser,
    (comment, currentUser) => currentUser?.username === comment?.author.username
  );

export const selectIsLoading = (state) =>
  selectCommentsSlice(state).status === Status.LOADING;

export const selectErrors = (state) => selectCommentsSlice(state).errors;

export default commentsSlice.reducer;
