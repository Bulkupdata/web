// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../baseurl';

const API = `${BaseUrl}/api/auth`;
console.log(`API Base URL: ${API}`);

// -------------------- Async Thunks --------------------

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email }: { name: string; email: string }, thunkAPI) => {
        try {
            const response = await axios.post(`${API}/register`, { name, email });
            console.log('registerUser - API Response (Success):', response.data);
            return response.data;
        } catch (err: any) {
            console.error('registerUser - API Error (Catch Block):', err.response?.data || err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const resendOtp = createAsyncThunk(
    'auth/resendOtp',
    async (email: string, thunkAPI) => {
        try {
            const response = await axios.post(`${API}/resend-otp`, { email });
            console.log('resendOtp - API Response (Success):', response.data);
            return response.data;
        } catch (err: any) {
            console.error('resendOtp - API Error (Catch Block):', err.response?.data || err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Resend failed');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }: { email: string; otp: string }, thunkAPI) => {
        try {
            const response = await axios.post(`${API}/verify-otp`, { email, otp });
            console.log('verifyOtp - API Response (Success):', response.data);
            return response.data; // includes token
        } catch (err: any) {
            console.error('verifyOtp - API Error (Catch Block):', err.response?.data || err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Verification failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (email: string, thunkAPI) => {
        try {
            const response = await axios.post(`${API}/login`, { email });
            console.log('loginUser - API Response (Success):', response.data);
            return response.data;
        } catch (err: any) {
            console.error('loginUser - API Error (Catch Block):', err.response?.data || err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

// -------------------- Slice --------------------

interface AuthState {
    loading: boolean;
    user: any;
    token: string | null;
    message: string | null;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    user: null,
    token: null,
    message: null,
    error: null,
};
console.log('Initial Auth State:', initialState);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            console.log('Reducer: logout - State after logout:', state);
            console.log('localStorage: token removed.');
        },
        clearMessages: (state) => {
            state.message = null;
            state.error = null;
            console.log('Reducer: clearMessages - State after clearing messages:', state);
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                console.log('registerUser.pending: Loading set to true.');
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                //state.message = action.payload.message;
                console.log('registerUser.fulfilled: State updated:', state);
                console.log('registerUser.fulfilled: Action Payload:', action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.error('registerUser.rejected: State updated with error:', state);
                console.error('registerUser.rejected: Error Payload:', action.payload);
            })

            // Resend OTP
            .addCase(resendOtp.fulfilled, () => {
                // state.message = action.payload.message;
                // console.log('resendOtp.fulfilled: State updated:', state);
                // console.log('resendOtp.fulfilled: Action Payload:', action.payload);
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.error = action.payload as string;
                console.error('resendOtp.rejected: State updated with error:', state);
                console.error('resendOtp.rejected: Error Payload:', action.payload);
            })

            // Verify OTP
            .addCase(verifyOtp.fulfilled, () => {
               // state.token = action.payload.token;
                //state.message = action.payload.message;
               // localStorage.setItem('token', action.payload.token);
                // console.log('verifyOtp.fulfilled: State updated:', state);
                // console.log('verifyOtp.fulfilled: Action Payload:', action.payload);
                // console.log('localStorage: token saved.');
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.error = action.payload as string;
                console.error('verifyOtp.rejected: State updated with error:', state);
                console.error('verifyOtp.rejected: Error Payload:', action.payload);
            })

            // Login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.message = action.payload.message;
                console.log('loginUser.fulfilled: State updated:', state);
                console.log('loginUser.fulfilled: Action Payload:', action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                console.error('loginUser.rejected: State updated with error:', state);
                console.error('loginUser.rejected: Error Payload:', action.payload);
            });
    },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;