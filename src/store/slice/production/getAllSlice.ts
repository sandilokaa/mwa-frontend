import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredProduction = createAsyncThunk(
    'productions/fetchFilteredProduction',
    async ({  productId, partNumber, page }: { productId: number, partNumber: string, page: number }) => {
        const response = await api.get(`/api/v1/productions/search?&productId=${productId}&partNumber=${partNumber}&page=${page}`);
        return response.data.data.production;
    }
);

export enum ProductionStatus {
    OnProgress = 'on progress',
    Done = 'done'
}

interface Production {
    id: number, 
    productId: number, 
    partName: string, 
    drawingNumber: string, 
    partNumber: string, 
    information:string, 
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
    },
});

export default productionSlice.reducer;