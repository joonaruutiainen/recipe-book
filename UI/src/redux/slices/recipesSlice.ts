import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, RecipeEditorData } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { recipeService } from '../../services';
import type { RootState } from '../store';
import { authActions } from './authSlice';

export enum SelectionFilter {
  all = 'all',
  myRecipes = 'myRecipes',
  favorites = 'favorites',
}

export interface RecipesState {
  all: Recipe[];
  selectionFilter: SelectionFilter;
  selected: Recipe | null;
  recipeEditorData: RecipeEditorData | null;
  newRecipe: Recipe | null;
  loadingMany: boolean;
  loadingOne: boolean;
  error: ApplicationError | null;
}

const initialState: RecipesState = {
  all: [],
  selectionFilter: SelectionFilter.all,
  selected: null,
  recipeEditorData: null,
  newRecipe: null,
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

const addRecipe = createAsyncThunk<Recipe, RecipeEditorData, { rejectValue: ApplicationError }>(
  `${sliceName}/addRecipe`,
  async (recipeData: RecipeEditorData, { rejectWithValue }) => {
    try {
      const { image, ...recipe } = recipeData;
      let res = await recipeService.addRecipe(recipe);
      const { payload: newRecipe } = res;
      if (newRecipe && image) res = await recipeService.uploadImage(newRecipe.id, image);
      return res.payload as Recipe;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const updateRecipe = createAsyncThunk<Recipe, RecipeEditorData, { rejectValue: ApplicationError }>(
  `${sliceName}/updateRecipe`,
  async (recipeData: RecipeEditorData, { rejectWithValue }) => {
    try {
      const { image, ...recipe } = recipeData;
      let res = await recipeService.updateRecipe(recipe);
      if (image) res = await recipeService.uploadImage(recipeData.id!, image);
      return res.payload as Recipe;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const RecipesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setSelectionFilter(state, action: PayloadAction<SelectionFilter>) {
      state.selectionFilter = action.payload;
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
    clearRecipeEditorData(state) {
      state.recipeEditorData = null;
    },
    clearNewRecipe(state) {
      state.newRecipe = null;
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
      state.selectionFilter = SelectionFilter.all;
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
            state.error = new ApplicationError('Resepti?? ei l??ytynyt tai ID on virheellinen', 400);
            return;
          case 401:
            state.error = new ApplicationError(
              'T??t?? resepti?? ei ole julkaistu. Kirjaudu sis????n lukeaksesi reseptin',
              401
            );
            return;
          case 403:
            state.error = new ApplicationError('T??t?? resepti?? ei ole julkaistu', 403);
            return;
          case 404:
            state.error = new ApplicationError('Resepti?? ei l??ytynyt', 404);
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
    builder.addCase(addRecipe.pending, (state, action) => {
      state.loadingOne = true;
      state.recipeEditorData = action.meta.arg;
    });
    builder.addCase(addRecipe.fulfilled, (state, action) => {
      state.loadingOne = false;
      state.recipeEditorData = null;
      state.newRecipe = action.payload;
      state.selected = null;
      state.all = state.all.concat([action.payload]);
      state.error = null;
    });
    builder.addCase(addRecipe.rejected, (state, action) => {
      state.loadingOne = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(updateRecipe.pending, (state, action) => {
      state.loadingOne = true;
      state.recipeEditorData = action.meta.arg;
    });
    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      state.loadingOne = false;
      state.recipeEditorData = null;
      state.newRecipe = action.payload;
      state.selected = null;
      state.all = state.all.map(recipe => (recipe.id === action.payload.id ? action.payload : recipe));
      state.error = null;
    });
    builder.addCase(updateRecipe.rejected, (state, action) => {
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
  addRecipe,
  updateRecipe,
  ...RecipesSlice.actions,
};

export default RecipesSlice;
