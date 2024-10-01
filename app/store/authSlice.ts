import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signIn as signInService,
  signUp as signUpService,
  logout as logoutService,
} from "@/app/utils/authService";
import { auth } from "@/app/utils/firebaseConfig";

// (User Type)
export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
  isAdmin: boolean;
  accessToken?: string;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  metadata?: UserMetadata;
  refreshToken?: string;
}

interface UserMetadata {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}

// (Auth State Type)
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// (Async Thunk for Login)
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const firebaseUser = await signInService(email, password);

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      isAdmin: false,
      accessToken: "",
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      refreshToken: firebaseUser.refreshToken,
    };

    return user;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// (Async Thunk for Sign Up)
export const signUpUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signUpUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const firebaseUser = await signUpService(email, password);

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      isAdmin: false,
      accessToken: "",
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      refreshToken: firebaseUser.refreshToken,
    };

    return user;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// (Async Thunk for Logout)
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/getUser", async (_, { rejectWithValue }) => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      isAdmin: false,
    };

    return user;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
    initializeUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to sign in.";
        }
      )
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(
        signUpUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to sign up.";
        }
      )
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(
        logoutUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to sign out.";
        }
      )
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        getUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to get user.";
        }
      );
  },
});

export const { logout, initializeUser } = authSlice.actions;

export default authSlice.reducer;
