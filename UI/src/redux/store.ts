import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './slices/authSlice';
import RecipesSlice from './slices/recipesSlice';
import UsersSlice from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    recipes: RecipesSlice.reducer,
    users: UsersSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
