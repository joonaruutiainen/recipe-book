import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { User } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { userService } from '../../services';
import type { RootState } from '../store';

export interface UsersState {
  all: User[];
  selected: User | null;
  loading: boolean;
  error: ApplicationError | SerializedError | null;
}

const initialState: UsersState = {
  all: [],
  selected: null,
  loading: false,
  error: null,
};

const sliceName = 'recipes';

const getUsers = createAsyncThunk<User[], void, { rejectValue: ApplicationError }>(
  `${sliceName}/getUsers`,
  async (_, { rejectWithValue }) => {
    const res = await userService.getUsers();
    if (res.error) return rejectWithValue(res.error as ApplicationError);
    return res.payload as User[];
  },
  {
    condition: (_, { getState }) => {
      const { users } = getState() as RootState;
      if (users.loading) return false;
      return true;
    },
  }
);

const UsersSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
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
        state.error = action.error;
      }
    });
  },
});

export const userActions = {
  getUsers,
};

export default UsersSlice;
