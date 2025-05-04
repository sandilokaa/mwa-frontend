import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Production {
    productId: number;
    partName: string, 
    drawingNumber: string, 
    category: string, 
    remark: string, 
    prodFile: string | File,
    picProduction: string 
}

export const createdProductionData = createAsyncThunk(
    'productions/createdProductionData',
    async (newProduction: Production, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newProduction.productId.toString());
            formData.append('partName', newProduction.partName);
            formData.append('category', newProduction.category);
            formData.append('drawingNumber', newProduction.drawingNumber);
            formData.append('picProduction', newProduction.picProduction);
            formData.append('remark', newProduction.remark);
            formData.append('prodFile', newProduction.prodFile);

            const response = await api.post(
                '/api/v1/productions/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.production;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface ProductionState {
    createdProduction: Production | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    createdProduction: null,
    loading: false,
    error: null,
};

const createProduction = createSlice({
    name: 'createProduction',
    initialState,
    reducers: {
        resetCreatedProduction(state) {
            state.createdProduction = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdProductionData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdProductionData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdProduction = action.payload;
            })
            .addCase(createdProductionData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createProduction.reducer;