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

export const updateProcurementData = createAsyncThunk(
    'procurements/updateProcurement',
    async (
        updatedProcurement: Procurement & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedProcurement;
            const response = await api.put(
                `/api/v1/procurements/update/${id}`,
                data,
            );
            return response.data.data.procurement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ProcurementState {
    updatedProcurement: Procurement | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    updatedProcurement: null,
    loading: false,
    error: null,
};

const updateProcurement = createSlice({
    name: 'updateProcurement',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateProcurementData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProcurementData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProcurement = action.payload;
            })
            .addCase(updateProcurementData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateProcurement.reducer;
