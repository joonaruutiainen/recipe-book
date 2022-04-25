import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { Recipe } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { recipeService } from '../../services';
import type { RootState } from '../store';

export interface RecipesState {
  public: Recipe[];
  user: Recipe[];
  favorites: Recipe[];
  selected: Recipe | null;
  loading: boolean;
  error: ApplicationError | SerializedError | null;
}

const initialState: RecipesState = {
  public: [],
  user: [],
  favorites: [],
  selected: null,
  loading: false,
  error: null,
};

const sliceName = 'recipes';

const initRecipes = createAsyncThunk<Recipe[], void, { rejectValue: ApplicationError }>(
  `${sliceName}/getRecipes`,
  async (_, { rejectWithValue }) => {
    const res = await recipeService.getRecipes();
    if (res.error) return rejectWithValue(res.error as ApplicationError);
    return res.payload as Recipe[];
  },
  {
    condition: (_, { getState }) => {
      const { recipes } = getState() as RootState;
      if (recipes.loading) return false;
      return true;
    },
  }
);

const RecipesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(initRecipes.pending, state => {
      state.loading = true;
    });
    builder.addCase(initRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.public = action.payload;
      state.error = null;
    });
    builder.addCase(initRecipes.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
  },
});

export const recipeActions = {
  initRecipes,
};

export default RecipesSlice;
