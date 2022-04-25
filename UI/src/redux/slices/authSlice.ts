import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { User, LoginData, RegistrationData } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { authService } from '../../services';
import type { RootState } from '../store';

export interface AuthState {
  initialized: boolean;
  user: User | null;
  newUser: User | null;
  loading: boolean;
  error: ApplicationError | SerializedError | null;
}

const initialState: AuthState = {
  initialized: false,
  user: null,
  newUser: null,
  loading: false,
  error: null,
};

const sliceName = 'auth';

const initSession = createAsyncThunk<boolean, void, { rejectValue: ApplicationError }>(
  `${sliceName}/init`,
  async (_, { rejectWithValue }) => {
    const res = await authService.initializeSession();
    if (res.error) return rejectWithValue(res.error as ApplicationError);
    return true;
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState() as RootState;
      if (auth.loading) return false;
      return true;
    },
  }
);

const loginUser = createAsyncThunk<User, LoginData, { rejectValue: ApplicationError }>(
  `${sliceName}/login`,
  async (userData, { rejectWithValue }) => {
    const { identifier, password } = userData;
    const res = await authService.login(identifier, password);
    if (res.error) {
      return rejectWithValue(res.error as ApplicationError);
    }
    return res.payload as User;
  }
);

const logoutUser = createAsyncThunk<boolean, void, { rejectValue: ApplicationError }>(
  `${sliceName}/logout`,
  async (_, { rejectWithValue }) => {
    const res = await authService.logout();
    if (res.error) return rejectWithValue(res.error as ApplicationError);
    return true;
  }
);

const registerUser = createAsyncThunk<User, RegistrationData, { rejectValue: ApplicationError }>(
  `${sliceName}/register`,
  async (userData, { rejectWithValue }) => {
    const { name, email, password, confirmPassword } = userData;
    const res = await authService.register(name, email, password, confirmPassword);
    if (res.error) {
      return rejectWithValue(res.error as ApplicationError);
    }
    return res.payload as User;
  }
);

const AuthSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(initSession.pending, state => {
      state.loading = true;
    });
    builder.addCase(initSession.fulfilled, state => {
      state.loading = false;
      state.initialized = true;
      state.error = null;
    });
    builder.addCase(initSession.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(loginUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(logoutUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, () => initialState);
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(registerUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.newUser = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error;
      }
    });
  },
});

export const authActions = {
  initSession,
  loginUser,
  logoutUser,
  registerUser,
};

export default AuthSlice;
