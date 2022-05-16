import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserEditorData } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { userService } from '../../services';
import type { RootState } from '../store';
import { authActions } from './authSlice';

export interface UsersState {
  all: User[];
  selected: User | null;
  userUpdated: boolean;
  loading: boolean;
  error: ApplicationError | null;
}

const currentUser: User | undefined = JSON.parse(localStorage.getItem('user')!);

const initialState: UsersState = {
  all: currentUser ? [currentUser] : [],
  selected: null,
  userUpdated: false,
  loading: false,
  error: null,
};

const sliceName = 'users';

const getUsers = createAsyncThunk<User[], void, { rejectValue: ApplicationError }>(
  `${sliceName}/getUsers`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getUsers();
      return res.payload as User[];
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  },
  {
    condition: (_, { getState }) => {
      const { users } = getState() as RootState;
      if (users.loading) return false;
      return true;
    },
  }
);

const getUser = createAsyncThunk<User, string, { rejectValue: ApplicationError }>(
  `${sliceName}/getUser`,
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await userService.getUser(userId);
      return res.payload as User;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  },
  {
    condition: (_, { getState }) => {
      const { users } = getState() as RootState;
      if (users.loading) return false;
      return true;
    },
  }
);

const updateUser = createAsyncThunk<User, UserEditorData, { rejectValue: ApplicationError }>(
  `${sliceName}/updateUser`,
  async (userData: UserEditorData, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser(userData);
      return res.payload as User;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const UsersSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<string>) {
      const selected = state.all.find(user => user.id === action.payload);
      if (selected) {
        state.selected = selected;
      } else {
        state.error = new ApplicationError('User not found', 404);
      }
    },
    clearSelectedUser(state) {
      state.selected = null;
    },
    clearUserUpdated(state) {
      state.userUpdated = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getUsers.pending, state => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.all = action.payload;
      state.error = null;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(getUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(updateUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
      state.userUpdated = true;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(authActions.loginUser.fulfilled, (state, action) => {
      state.all = [action.payload];
    });
    builder.addCase(authActions.logoutUser.fulfilled, () => initialState);
  },
});

export const userActions = {
  getUsers,
  getUser,
  updateUser,
  ...UsersSlice.actions,
};

export default UsersSlice;
