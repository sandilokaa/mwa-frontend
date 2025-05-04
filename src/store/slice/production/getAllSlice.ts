import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredProduction = createAsyncThunk(
    'productions/fetchFilteredProduction',
    async ({  productId, partName, page, category }: { productId: number, partName: string, page: number, category: string }) => {
        const response = await api.get(`/api/v1/productions/search?&productId=${productId}&partName=${partName}&page=${page}&category=${category}`);
        return response.data.data.production;
    }
);

export const fetchSummaryProductionStatus = createAsyncThunk(
    'productions/fetchSummaryProductionStatus',
    async ({ productId, category }: { productId: number, category: string }) => {
        const response = await api.get(
            `/api/v1/productions/summary/status/stat?&productId=${productId}&category=${category}`);
        return response.data.data.production;
    }
);

export enum ProductionStatus {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

interface Production {
    id: number, 
    productId: number, 
    partName: string, 
    drawingNumber: string, 
    category: string, 
    remark:string, 
    productionStatus: ProductionStatus 
}

interface PaginatedProductionData {
    productionDataFiltered: Production[];
    totalProd: number;
    currentPagesProd: number;
    totalPagesProd: number;
}

interface ProductionState {
    filteredProductions: PaginatedProductionData;
    summaryProductionStatus: {productionStatus: string, count: number}[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    filteredProductions: {
        productionDataFiltered: [],
        totalProd: 0,
        currentPagesProd: 1,
        totalPagesProd: 1,
    },
    summaryProductionStatus: [],
    loading: false,
    error: null,
};

const productionSlice = createSlice({
    name: 'productionLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredProduction.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredProduction.fulfilled, (state, action) => {
                state.filteredProductions = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch production';
            })
            .addCase(fetchSummaryProductionStatus.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryProductionStatus.fulfilled, (state, action) => {
                state.summaryProductionStatus = action.payload;
            })
            .addCase(fetchSummaryProductionStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch summary production';
            })
    },
});

export default productionSlice.reducer;