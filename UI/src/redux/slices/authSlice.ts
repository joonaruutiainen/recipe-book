import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginData, RegistrationData } from '../../types';
import ApplicationError from '../../utils/ApplicationError';
import { authService } from '../../services';
import type { RootState } from '../store';

export interface AuthState {
  initialized: boolean;
  user: User | null;
  loggedIn: boolean;
  newUser: User | null;
  loginData: LoginData | null;
  registrationData: RegistrationData | null;
  loading: boolean;
  error: ApplicationError | null;
}

const user: User | undefined = JSON.parse(localStorage.getItem('user')!);

const initialState: AuthState = {
  initialized: false,
  user: user || null,
  loggedIn: false,
  newUser: null,
  loginData: null,
  registrationData: null,
  loading: false,
  error: null,
};

const sliceName = 'auth';

const initSession = createAsyncThunk<boolean, void, { rejectValue: ApplicationError }>(
  `${sliceName}/init`,
  async (_, { rejectWithValue }) => {
    try {
      await authService.initializeSession();
      return true;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
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
    try {
      const res = await authService.login(userData);
      return res.payload as User;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const logoutUser = createAsyncThunk<boolean, void, { rejectValue: ApplicationError }>(
  `${sliceName}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const registerUser = createAsyncThunk<User, RegistrationData, { rejectValue: ApplicationError }>(
  `${sliceName}/register`,
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.register(userData);
      return res.payload as User;
    } catch (err) {
      return rejectWithValue(err as ApplicationError);
    }
  }
);

const AuthSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    clearLoginData(state) {
      state.loginData = null;
    },
    clearRegistrationData(state) {
      state.registrationData = null;
    },
    clearNewUser(state) {
      state.newUser = null;
    },
    clearError(state) {
      state.error = null;
    },
    updateCurrentUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
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
      state.initialized = true;
      if (action.payload) {
        const { code } = action.payload;
        if (code === 401 && state.user) {
          state.user = null;
          localStorage.removeItem('user');
        }
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
      state.loginData = action.meta.arg;
      if (state.newUser) {
        state.newUser = null;
      }
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.loading = false;
      state.user = action.payload;
      state.loggedIn = true;
      state.loginData = null;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        const { code } = action.payload;
        if (code === 404) state.error = new ApplicationError('K??ytt??j???? ei l??ytynyt', 404);
        else {
          state.error = action.payload;
        }
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(logoutUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, state => {
      localStorage.removeItem('user');
      state.initialized = false;
      state.user = null;
      state.loggedIn = false;
      state.newUser = null;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
    builder.addCase(registerUser.pending, (state, action) => {
      state.loading = true;
      state.registrationData = action.meta.arg;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.newUser = action.payload;
      state.registrationData = null;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new ApplicationError(action.error.message!, parseInt(action.error.code!, 10));
      }
    });
  },
});

export const authActions = {
  initSession,
  loginUser,
  logoutUser,
  registerUser,
  ...AuthSlice.actions,
};

export default AuthSlice;
