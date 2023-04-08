import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import commentsReducer from '../features/comments/commentsSlice';
import { localStorageMiddleware } from './middleware';
import articleReducer from '../reducers/article';
import articlesReducer from '../reducers/articleList';
import commonReducer from '../reducers/common';
import profileReducer from '../reducers/profile';

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      article: articleReducer,
      articleList: articlesReducer,
      auth: authReducer,
      comments: commentsReducer,
      common: commonReducer,
      profile: profileReducer,
    },
    devTools: true,
    preloadedState,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      localStorageMiddleware,
    ],
  });
}

const store = makeStore();

export default store;
