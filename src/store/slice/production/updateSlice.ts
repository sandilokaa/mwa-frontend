import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Production {
    picProduction: string
}

export const updateProductionData = createAsyncThunk(
    'productions/updateProduction',
    async (
        updatedProduction: Production & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedProduction;
            
            const response = await api.put(
                `/api/v1/productions/update/${id}`,
                data,
            );
            return response.data.data.production;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ProductionState {
    updatedProduction: Production | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    updatedProduction: null,
    loading: false,
    error: null,
};

const updateProduction = createSlice({
    name: 'updateProduction',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateProductionData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductionData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProduction = action.payload;
            })
            .addCase(updateProductionData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateProduction.reducer;
