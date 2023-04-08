import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import agent from '../../agent';
import {
  failureReducer,
  isApiError,
  loadingReducer,
  Status,
} from '../../common/utils';


export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, thunkApi) => {
    try {
      const {
        user: { token, ...user },
      } = await agent.Auth.register(username, email, password);

      return { token, user };
    } catch (error) {
      if (isApiError(error)) {
        return thunkApi.rejectWithValue(error);
      }

      throw error;
    }
  },
  {
    condition: (_, { getState }) => !selectIsLoading(getState()),
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkApi) => {
    try {
      const {
        user: { token, ...user },
      } = await agent.Auth.login(email, password);

      return { token, user };
    } catch (error) {
      if (isApiError(error)) {
        return thunkApi.rejectWithValue(error);
      }

      throw error;
    }
  },
  {
    condition: (_, { getState }) => !selectIsLoading(getState()),
  }
);


export const getUser = createAsyncThunk(
  'auth/getUser',
  async () => {
    const {
      user: { token, ...user },
    } = await agent.Auth.current();

    return { token, user };
  },
  {
    condition: (_, { getState }) => Boolean(selectAuthSlice(getState()).token),
  }
);


export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ email, username, bio, image, password }, thunkApi) => {
    try {
      const {
        user: { token, ...user },
      } = await agent.Auth.save({ email, username, bio, image, password });

      return { token, user };
    } catch (error) {
      if (isApiError(error)) {
        return thunkApi.rejectWithValue(error);
      }

      throw error;
    }
  },
  {
    condition: (_, { getState }) =>
      selectIsAuthenticated(getState()) && !selectIsLoading(getState()),
  }
);


const initialState = {
  status: Status.IDLE,
};


function successReducer(state, action) {
  state.status = Status.SUCCESS;
  state.token = action.payload.token;
  state.user = action.payload.user;
  delete state.errors;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,

    setToken(state, action) {
      state.token = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, successReducer)
      .addCase(register.fulfilled, successReducer)
      .addCase(getUser.fulfilled, successReducer)
      .addCase(updateUser.fulfilled, successReducer);

    builder
      .addCase(login.rejected, failureReducer)
      .addCase(register.rejected, failureReducer)
      .addCase(updateUser.rejected, failureReducer);

    builder.addMatcher(
      (action) => /auth\/.*\/pending/.test(action.type),
      loadingReducer
    );
  },
});

export const { setToken, logout } = authSlice.actions;

const selectAuthSlice = (state) => state.auth;

export const selectUser = (state) => selectAuthSlice(state).user;

export const selectErrors = (state) => selectAuthSlice(state).errors;

export const selectIsLoading = (state) =>
  selectAuthSlice(state).status === Status.LOADING;

export const selectIsAuthenticated = createSelector(
  (state) => selectAuthSlice(state).token,
  selectUser,
  (token, user) => Boolean(token && user)
);

export default authSlice.reducer;
