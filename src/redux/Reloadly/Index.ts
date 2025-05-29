import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../baseurl';


const API_URL = `${BaseUrl}/api/reloadly`;

interface ReloadlyState {
    operators: any[];
    operatorDetails: any | null;
    autoDetectedOperator: any | null;
    balance: any | null;
    topupResponse: any | null;
    topupStatus: any | null;
    transactionDetails: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ReloadlyState = {
    operators: [],
    operatorDetails: null,
    autoDetectedOperator: null,
    balance: null,
    topupResponse: null,
    topupStatus: null,
    transactionDetails: null,
    loading: false,
    error: null,
};

export const fetchOperators = createAsyncThunk(
    'reloadly/fetchOperators',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/operators`);
            console.log('✅ fetchOperators response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ fetchOperators error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchOperatorById = createAsyncThunk(
    'reloadly/fetchOperatorById',
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/operators/${id}`);
            console.log('✅ fetchOperatorById response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ fetchOperatorById error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const autoDetectOperator = createAsyncThunk(
    'reloadly/autoDetectOperator',
    async (
        { phone, countryCode }: { phone: string; countryCode: string },
        thunkAPI
    ) => {
        try {
            const convertedCountryCode = countryCode === '+234' ? 'NG' : countryCode;

            const response = await axios.get(
                `${API_URL}/operators/auto-detect/${phone}/${convertedCountryCode}`
            );

            console.log('✅ autoDetectOperator response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ autoDetectOperator error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchBalance = createAsyncThunk(
    'reloadly/fetchBalance',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/balance`);
            console.log('✅ fetchBalance response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ fetchBalance error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const makeTopup = createAsyncThunk(
    'reloadly/makeTopup',
    async (topupData: any, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/topup`, topupData);
            console.log('✅ makeTopup response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ makeTopup error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const makeMainTopup = createAsyncThunk<
    any,               // return type of fulfilled action
    { ref: string; payload: any },  // argument type
    { rejectValue: string }
>(
    'reloadly/makeMainTopup',
    async ({ ref, payload }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/main-topup/${ref}`, payload);
            console.log('✅ makeMainTopup response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ makeMainTopup error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const getTopupStatus = createAsyncThunk(
    'reloadly/getTopupStatus',
    async (transactionId: string, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/topups/${transactionId}/status`);
            console.log('✅ getTopupStatus response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ getTopupStatus error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getTransactionDetails = createAsyncThunk(
    'reloadly/getTransactionDetails',
    async (transactionId: string, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/transactions/${transactionId}`);
            console.log('✅ getTransactionDetails response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ getTransactionDetails error:', error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Slice
const reloadlySlice = createSlice({
    name: 'reloadly',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Operators
            .addCase(fetchOperators.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log('Fetching operators...');
            })
            .addCase(fetchOperators.fulfilled, (state, action) => {
                state.loading = false;
                state.operators = action.payload.content || [];
                console.log('Fetched operators:', action.payload);
            })
            .addCase(fetchOperators.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operators';
                console.error('Failed to fetch operators:', action.error);
            })

            // Operator by ID
            .addCase(fetchOperatorById.pending, (state) => {
                state.error = null;
                console.log('Fetching operator by ID...');
            })
            .addCase(fetchOperatorById.fulfilled, (state, action) => {
                state.operatorDetails = action.payload;
                console.log('Fetched operator by ID:', action.payload);
            })
            .addCase(fetchOperatorById.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch operator by ID';
                console.error('Failed to fetch operator by ID:', action.error);
            })

            // Auto Detect
            .addCase(autoDetectOperator.pending, (state) => {
                state.error = null;
                console.log('Auto detecting operator...');
            })
            .addCase(autoDetectOperator.fulfilled, (state, action) => {
                state.autoDetectedOperator = action.payload;
                console.log('Auto detected operator:', action.payload);
            })
            .addCase(autoDetectOperator.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to auto detect operator';
                console.error('Failed to auto detect operator:', action.error);
            })

            // Balance
            .addCase(fetchBalance.pending, (state) => {
                state.error = null;
                console.log('Fetching balance...');
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.balance = action.payload;
                console.log('Fetched balance:', action.payload);
            })
            .addCase(fetchBalance.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch balance';
                console.error('Failed to fetch balance:', action.error);
            })

            // Topup
            .addCase(makeTopup.pending, (state) => {
                state.error = null;
                console.log('Making topup...');
            })
            .addCase(makeTopup.fulfilled, (state, action) => {
                state.topupResponse = action.payload;
                console.log('Topup successful:', action.payload);
            })
            .addCase(makeTopup.rejected, (state, action) => {
                state.error = action.error.message || 'Topup failed';
                console.error('Topup failed:', action.error);
            })

            // Topup Status
            .addCase(getTopupStatus.pending, (state) => {
                state.error = null;
                console.log('Getting topup status...');
            })
            .addCase(getTopupStatus.fulfilled, (state, action) => {
                state.topupStatus = action.payload;
                console.log('Fetched topup status:', action.payload);
            })
            .addCase(getTopupStatus.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to get topup status';
                console.error('Failed to get topup status:', action.error);
            })
            .addCase(makeMainTopup.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log('Processing main topup...');
            })
            .addCase(makeMainTopup.fulfilled, (state, action) => {
                state.loading = false;
                state.topupResponse = action.payload;
                console.log('Main topup successful:', action.payload);
            })
            .addCase(makeMainTopup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Main topup failed';
                console.error('Main topup failed:', action.error);
            })
            .addCase(getTransactionDetails.pending, (state) => {
                state.error = null;
                console.log('Getting transaction details...');
            })
            .addCase(getTransactionDetails.fulfilled, (state, action) => {
                state.transactionDetails = action.payload;
                console.log('Fetched transaction details:', action.payload);
            })
            .addCase(getTransactionDetails.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to get transaction details';
                console.error('Failed to get transaction details:', action.error);
            });
    }
});

export const { clearError } = reloadlySlice.actions;
export default reloadlySlice.reducer;