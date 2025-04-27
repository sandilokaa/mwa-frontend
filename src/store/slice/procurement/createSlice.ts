import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Procurement {
    productId: number;
    itemName: string;
    prNumber: string;
    submissionDate: string;
    etaTarget: string;
    poNumber: string;
    vendor: string;
    quantity: string;
}

export const createdProcurementData = createAsyncThunk(
    'procurements/createProcurement',
    async (newProcurement: Procurement, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/procurements/create',
                newProcurement,
            );
            return response.data.data.procurement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface ProcurementState {
    createdProcurement: Procurement | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    createdProcurement: null,
    loading: false,
    error: null,
};

const createProcurement = createSlice({
    name: 'createProcurement',
    initialState,
    reducers: {
        resetCreatedProcurement(state) {
            state.createdProcurement = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdProcurementData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdProcurementData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdProcurement = action.payload;
            })
            .addCase(createdProcurementData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createProcurement.reducer;