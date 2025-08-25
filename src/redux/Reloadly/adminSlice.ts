import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../baseurl'; // Ensure this path is correct for your project

// API_URL for admin authentication routes
const ADMIN_API_URL = `${BaseUrl}/api/reloadly/admin/auth`;
// API_URL for the new token update route
const TOKEN_API_URL = `${BaseUrl}/api/reloadly/admin/token`; // Assuming the token route is directly under /api
///admin/token/create-token
interface Admin {
  id: string;
  email: string;
}

interface AdminState {
  adminUser: Admin | null;
  token: string | null; // Admin authentication token
  userId: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
  dashboardData: any | null;
  users: any[];
  reloadlyAccessToken: string | null; // New: To store the Reloadly access token
  isTokenUpdating: boolean; // New: Loading state for token update
  tokenUpdateError: string | null; // New: Error state for token update
}

// Async Thunk for creating/updating Reloadly Access Token
export const updateReloadlyToken = createAsyncThunk<
  { accessToken: string; message: string }, // What the thunk returns on success
  { clientId: string; clientSecret: string }, // What the thunk receives as arguments
  { rejectValue: string } // What the thunk rejects with on failure
>(
  'admin/updateReloadlyToken',
  async ({ clientId, clientSecret }, thunkAPI) => {
    try {
      const response = await axios.post(`${TOKEN_API_URL}/create-token`, { clientId, clientSecret });
      return response.data; // Should contain { accessToken, message }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update Reloadly access token.';
      console.error('API Error (updateReloadlyToken):', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createAdmin = createAsyncThunk<
  any,
  { name: string; email: string },
  { rejectValue: string }
>('admin/createAdmin', async ({ name, email }, thunkAPI) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/create-admin`, { name, email });
    console.log('API Response (createAdmin):', response.data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create admin.';
    console.error('API Error (createAdmin):', error.response?.data || error.message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const adminLogin = createAsyncThunk<any, string, { rejectValue: string }>(
  'admin/adminLogin',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${ADMIN_API_URL}/login`, { email });
      console.log('API Response (adminLogin):', response.data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Admin login failed.';
      console.error('API Error (adminLogin):', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyAdminOtp = createAsyncThunk<
  any,
  { email: string; otp: string },
  { rejectValue: string }
>('admin/verifyAdminOtp', async ({ email, otp }, thunkAPI) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/verify-otp`, { email, otp });
    console.log('API Response (verifyAdminOtp):', response.data);
    if (response.data.token) {
      localStorage.setItem('bulkup_data_token', response.data.token);
      localStorage.setItem('bulkup_data_userId', response.data.userId);
      localStorage.setItem('bulkup_data_isAdmin', 'true');
      localStorage.setItem('bulkup_data_admin_name', response.data.admin.name); // Store admin name
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'OTP verification failed.';
    console.error('API Error (verifyAdminOtp):', error.response?.data || error.message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const resendAdminOtp = createAsyncThunk<any, string, { rejectValue: string }>(
  'admin/resendAdminOtp',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${ADMIN_API_URL}/resend-otp`, { email });
      console.log('API Response (resendAdminOtp):', response.data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to resend OTP.';
      console.error('API Error (resendAdminOtp):', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAdminDashboardData = createAsyncThunk<any, void, { rejectValue: string }>(
  'admin/fetchAdminDashboardData',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('bulkup_data_token');
      if (!token) {
        thunkAPI.dispatch(logoutAdmin());
        return thunkAPI.rejectWithValue('No authentication token found.');
      }
      const response = await axios.get(`${ADMIN_API_URL}/dashboard-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response (fetchAdminDashboardData):', response.data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard data.';
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        thunkAPI.dispatch(logoutAdmin());
      }
      console.error('API Error (fetchAdminDashboardData):', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUsersForAdmin = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("admin/fetchUsersForAdmin", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("bulkup_data_token");
    if (!token) {
      return thunkAPI.rejectWithValue("No authentication token found.");
    }

    const response = await axios.get(`${ADMIN_API_URL}/users-for-admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Fetched users:", response.data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Failed to fetch users.";
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState: AdminState = {
  adminUser: null,
  token: localStorage.getItem("bulkup_data_token") || null,
  userId: localStorage.getItem("bulkup_data_userId") || null,
  isAdmin: localStorage.getItem("bulkup_data_isAdmin") === "true",
  loading: false,
  error: null,
  message: null,
  dashboardData: null,
  users: [],
  reloadlyAccessToken: null, // Initialize new state
  isTokenUpdating: false,    // Initialize new state
  tokenUpdateError: null,    // Initialize new state
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.adminUser = null;
      state.token = null;
      state.userId = null;
      state.isAdmin = false;
      state.error = null;
      state.message = null;
      state.dashboardData = null;
      state.reloadlyAccessToken = null; // Clear Reloadly token on logout
      localStorage.removeItem('bulkup_data_token');
      localStorage.removeItem('bulkup_data_userId');
      localStorage.removeItem('bulkup_data_isAdmin');
      localStorage.removeItem('bulkup_data_admin_name');
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminMessage: (state) => {
      state.message = null;
    },
    clearTokenUpdateError: (state) => { // New reducer to clear token update error
      state.tokenUpdateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing reducers for createAdmin, adminLogin, verifyAdminOtp, etc.
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Admin created successfully.';
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'OTP sent successfully.';
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(verifyAdminOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyAdminOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.adminUser = action.payload.admin || { email: action.payload.email, id: action.payload.userId };
        state.isAdmin = true;
        state.message = action.payload.message || 'OTP verified successfully.';
        state.error = null;
      })
      .addCase(verifyAdminOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(resendAdminOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendAdminOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'OTP resent successfully.';
        state.error = null;
      })
      .addCase(resendAdminOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.dashboardData = null;
      })
      .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.message = action.payload.message || 'Dashboard data fetched.';
        state.error = null;
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
        state.dashboardData = null;
      })
      .addCase(fetchUsersForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchUsersForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.message = "Users fetched successfully.";
      })
      .addCase(fetchUsersForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.users = [];
      })
      // New: Reducers for updateReloadlyToken thunk
      .addCase(updateReloadlyToken.pending, (state) => {
        state.isTokenUpdating = true;
        state.tokenUpdateError = null;
      })
      .addCase(updateReloadlyToken.fulfilled, (state, action) => {
        state.isTokenUpdating = false;
        state.reloadlyAccessToken = action.payload.accessToken;
        state.message = action.payload.message || 'Reloadly access token updated successfully!';
        state.tokenUpdateError = null;
      })
      .addCase(updateReloadlyToken.rejected, (state, action) => {
        state.isTokenUpdating = false;
        state.tokenUpdateError = action.payload as string;
      });
  },
});

export const { logoutAdmin, clearAdminError, clearAdminMessage, clearTokenUpdateError } = adminSlice.actions;

export default adminSlice.reducer;