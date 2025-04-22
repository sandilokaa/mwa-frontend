import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFilteredProcurement = createAsyncThunk(
    'procurements/fetchFilteredProcurement',
    async ({  productId, prNumber, page }: { productId: number, prNumber: string, page: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/search?&productId=${productId}&prNumber=${prNumber}&page=${page}`,
            { withCredentials: true }
        );
        return response.data.data.procurement;
    }
);

export const fetchAllProcurements = createAsyncThunk(
    'procurements/fetchAllProcurements',
    async ({  productId }: { productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/metrics/total?&productId=${productId}`,
            { withCredentials: true }
        );
        return response.data.data.procurement;
    }
);

export const fetchSummaryProcurement = createAsyncThunk(
    'procurements/fetchSummaryProcurement',
    async ({  productId }: { productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/summary/stat?&productId=${productId}`,
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
    OnProgress = 'on progress',
    Done = 'done'
}

interface Procurement {
    id: number, 
    productId: number, 
    itemName: string, 
    prNumber: string, 
    etaTarget: Date, 
    poNumber:string, 
    progress: Progress, 
    statusProc: StatusProc 
}

interface PaginatedProcurementData {
    procurementDataFiltered: Procurement[];
    totalProc: number;
    currentPagesProc: number;
    totalPagesProc: number;
}

interface ProcurementState {
    filteredProcurements: PaginatedProcurementData;
    allProcurements: [];
    summaryProcurements: {progress: string, count: number}[];
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    filteredProcurements: {
        procurementDataFiltered: [],
        totalProc: 0,
        currentPagesProc: 1,
        totalPagesProc: 1,
    },
    allProcurements: [],
    summaryProcurements: [],
    loading: false,
    error: null,
};

const procurementSlice = createSlice({
    name: 'procurementLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSummaryProcurement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryProcurement.fulfilled, (state, action) => {
                state.summaryProcurements = action.payload;
            })
            .addCase(fetchSummaryProcurement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch summary procurement';
            })
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
