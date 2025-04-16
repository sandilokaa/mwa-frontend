import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFilteredProcurement = createAsyncThunk(
    'procurements/fetchFilteredProcurement',
    async ({  productId, prNumber }: { productId: number, prNumber: string }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/search?&productId=${productId}&prNumber=${prNumber}`,
            { withCredentials: true }
        );
        return response.data.data.procurement;
    }
);

export const fetchAllProcurements = createAsyncThunk(
    'procurements/fetchAllProcurements',
    async ({  productId }: { productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/search?&productId=${productId}`,
            { withCredentials: true }
        );
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
    OnProgress = 'on progress'
}

interface ProcurementState {
    filteredProcurements: { id: number, productId: number, itemName: string, prNumber: string, etaTarget: Date, poNumber:string, progress: Progress, statusProc: StatusProc }[];
    allProcurements: {progress: string}[];
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    filteredProcurements: [],
    allProcurements: [],
    loading: false,
    error: null,
};

const procurementSlice = createSlice({
    name: 'procurementLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredProcurement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredProcurement.fulfilled, (state, action) => {
                state.filteredProcurements = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredProcurement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch procurement';
            })
            .addCase(fetchAllProcurements.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProcurements.fulfilled, (state, action) => {
                state.allProcurements = action.payload;
            })
            .addCase(fetchAllProcurements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch procurement';
            })
    },
});

export default procurementSlice.reducer;
