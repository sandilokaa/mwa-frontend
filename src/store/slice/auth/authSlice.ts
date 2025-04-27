/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: any;
}

const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
};

// 🔐 Login thunk
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (
        payload: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.post('/api/v1/auth/session/login',payload);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 🚪 Logout thunk
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/v1/auth/session/logout',{},);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 👤 Get current login info
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/v1/auth/session/me');
            return res.data.data.currentUser;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        });
    },
});

export default authSlice.reducer;
