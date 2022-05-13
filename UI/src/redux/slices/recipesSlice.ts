import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  loadingMany: boolean;
  loadingOne: boolean;
  error: ApplicationError | null;
}

const initialState: RecipesState = {
  all: [],
  selection: [],
  selectionFilter: SelectionFilter.public,
  selected: null,
  loadingMany: false,
  loadingOne: false,
  error: null,
};

const sliceName = 'recipes';

const getRecipes = createAsyncThunk<Recipe[], void, { rejectValue: ApplicationError }>(
  `${sliceName}/getRecipes`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await recipeService.getRecipes();
      return res.payload as Recipe[];
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  },
  {
    condition: (_, { getState }) => {
      const { recipes } = getState() as RootState;
      if (recipes.loadingMany) return false;
      return true;
    },
  }
);

const getRecipe = createAsyncThunk<Recipe, string, { rejectValue: ApplicationError }>(
  `${sliceName}/getRecipe`,
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const res = await recipeService.getRecipe(recipeId);
      return res.payload as Recipe;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  },
  {
    condition: (_, { getState }) => {
      const { recipes } = getState() as RootState;
      if (recipes.loadingOne) return false;
      return true;
    },
  }
);

const deleteRecipe = createAsyncThunk<string, string, { rejectValue: ApplicationError }>(
  `${sliceName}/deleteRecipe`,
  async (recipeId: string, { rejectWithValue }) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      return recipeId;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
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
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getRecipes.pending, state => {
      state.loadingMany = true;
    });
    builder.addCase(getRecipes.fulfilled, (state, action) => {
      state.loadingMany = false;
      state.all = action.payload;
      state.selection = action.payload.filter(recipe => recipe.public);
      state.selectionFilter = SelectionFilter.public;
      state.error = null;
    });
    builder.addCase(getRecipes.rejected, (state, action) => {
      state.loadingMany = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(getRecipe.pending, state => {
      state.loadingOne = true;
    });
    builder.addCase(getRecipe.fulfilled, (state, action) => {
      state.loadingOne = false;
      state.selected = action.payload;
      state.error = null;
    });
    builder.addCase(getRecipe.rejected, (state, action) => {
      state.loadingOne = false;
      if (action.payload) {
        const { code } = action.payload;
        switch (code) {
          case 400:
            state.error = new ApplicationError('Reseptiä ei löytynyt tai ID on virheellinen', 400);
            return;
          case 401:
            state.error = new ApplicationError(
              'Tätä reseptiä ei ole julkaistu. Kirjaudu sisään lukeaksesi reseptin',
              401
            );
            return;
          case 403:
            state.error = new ApplicationError('Tätä reseptiä ei ole julkaistu', 403);
            return;
          case 404:
            state.error = new ApplicationError('Reseptiä ei löytynyt', 404);
            return;
          default:
            state.error = action.payload;
        }
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(deleteRecipe.pending, state => {
      state.loadingOne = true;
    });
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.loadingOne = false;
      state.selected = null;
      state.all = state.all.filter(recipe => recipe.id !== action.payload);
      state.selection = state.selection.filter(recipe => recipe.id !== action.payload);
      state.error = null;
    });
    builder.addCase(deleteRecipe.rejected, (state, action) => {
      state.loadingOne = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(authActions.logoutUser.fulfilled, () => initialState);
  },
});

export const recipeActions = {
  getRecipes,
  getRecipe,
  deleteRecipe,
  ...RecipesSlice.actions,
};

export default RecipesSlice;
