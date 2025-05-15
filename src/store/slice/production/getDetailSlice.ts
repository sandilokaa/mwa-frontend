import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchProductionDetail = createAsyncThunk(
    'productions/fetchProductionDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/productions/${id}`);
        return response.data.data.production;
    }
);

export enum ProductionStatus {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

interface Production {
    id: number;
    productId: number;
    Engineering: {
        partName: string;
        drawingNumber: string;
        category: string;
        remark: string;
    };
    productionStatus: ProductionStatus,
    picProduction: string 
}

interface ProductionState {
    productionDetail: Production | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    productionDetail: null,
    loading: false,
    error: null,
};

const productionDetailSlice = createSlice({
    name: 'productionDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProductionDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductionDetail.fulfilled, (state, action) => {
                state.productionDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchProductionDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch production detail';
            })
    },
});

export default productionDetailSlice.reducer;
