import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchProcurementDetail = createAsyncThunk(
    'procurements/fetchProcurementDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/procurements/${id}`);
        return response.data.data.procurement;
    }
);

export enum Progress {
    PRApproved = 'pr approved',
    POConfirmed = 'po confirmed',
    Paid = 'paid',
    Delivered = 'delivered'
}

export enum StatusProc {
    Overdue = 'overdue',
    OnProgress = 'on progress',
    Done = 'done'
}

interface Procurement {
    id: number;
    productId: number;
    itemName: string;
    prNumber: string;
    etaTarget: string;
    poNumber: string;
    submissionDate: string;
    progress: Progress;
    statusProc: StatusProc;
    quantity: string;
    vendor: string;
}

interface ProcurementState {
    procurementDetail: Procurement | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    procurementDetail: null,
    loading: false,
    error: null,
};

const procurementDetailSlice = createSlice({
    name: 'procurementDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProcurementDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProcurementDetail.fulfilled, (state, action) => {
                state.procurementDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchProcurementDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch procurement detail';
            })
    },
});

export default procurementDetailSlice.reducer;
