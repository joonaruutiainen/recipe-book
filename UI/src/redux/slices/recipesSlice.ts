import { createSlice, createAsyncThunk, SerializedError, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { recipeService } from '../../services';
import type { RootState } from '../store';
import { authActions } from './authSlice';

export enum SelectionFilter {
  public = 'public',
  myRecipes = 'myRecipes',
  favorites = 'favorites',
}

export interface RecipesState {
  all: Recipe[];
  selection: Recipe[];
  selectionFilter: SelectionFilter;
  selected: Recipe | null;
  loading: boolean;
  error: ApplicationError | SerializedError | null;
}

const initialState: RecipesState = {
  all: [],
  selection: [],
  selectionFilter: SelectionFilter.public,
  selected: null,
  loading: false,
  error: null,
};

const sliceName = 'recipes';

const getRecipes = createAsyncThunk<Recipe[], void, { rejectValue: ApplicationError }>(
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

const getRecipe = createAsyncThunk<Recipe, string, { rejectValue: ApplicationError }>(
  `${sliceName}/getRecipe`,
  async (recipeId: string, { rejectWithValue }) => {
    const res = await recipeService.getRecipe(recipeId);
    if (res.error) return rejectWithValue(res.error as ApplicationError);
    return res.payload as Recipe;
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
  reducers: {
    setSelection(state, action: PayloadAction<SelectionFilter>) {
      state.selectionFilter = action.payload;
      state.selection = state.all.filter(recipe => (action.payload === 'public' ? recipe.public : recipe));
    },
    selectRecipe(state, action: PayloadAction<string>) {
      const selected = state.all.find(recipe => recipe.id === action.payload);
      if (selected) {
        state.selected = selected;
      } else {
        state.error = new ApplicationError('Recipe not found', 404);
      }
    },
    clearSelectedRecipe(state) {
      state.selected = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getRecipes.pending, state => {
      state.loading = true;
    });
    builder.addCase(getRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.all = action.payload;
      state.selection = action.payload.filter(recipe => recipe.public);
      state.error = null;
    });
    builder.addCase(getRecipes.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(authActions.logoutUser.fulfilled, () => initialState);
  },
});

export const recipeActions = {
  getRecipes,
  getRecipe,
  ...RecipesSlice.actions,
};

export default RecipesSlice;
