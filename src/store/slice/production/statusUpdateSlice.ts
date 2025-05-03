import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Production {
    productionStatus: string
}

export const updateProductionStatusData = createAsyncThunk(
    'productions/updateProductionStatusData',
    async (
        updatedProductionStatus: Production & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedProductionStatus;
            const response = await api.put(
                `/api/v1/productions/status/update/${id}`,
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
    updatedStatus: Production | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    updatedStatus: null,
    success: false,
    loading: false,
    error: null,
};

const updateStatusSlice = createSlice({
    name: 'updateStatus',
    initialState,
    reducers: {
        resetUpdatedStatusProduction(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateProductionStatusData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductionStatusData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedStatus = action.payload;
            })
            .addCase(updateProductionStatusData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedStatusProduction } = updateStatusSlice.actions;
export default updateStatusSlice.reducer;
