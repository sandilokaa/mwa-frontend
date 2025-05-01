import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteProduction = createAsyncThunk(
    'productions/deleteProduction',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/productions/delete/${id}`);
        return response.data.data.production;
    }
);

interface DeleteProductionState {
    production: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteProductionState = {
    production: [],
    success: false,
    loading: false,
    error: null,
};

const deleteProductionSlice = createSlice({
    name: 'deleteProduction',
    initialState,
    reducers: {
        resetDeleteState(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(deleteProduction.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteProduction.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete production';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteProductionSlice.actions;
export default deleteProductionSlice.reducer;