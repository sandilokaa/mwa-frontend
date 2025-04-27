import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteProcurement = createAsyncThunk(
    'procurements/deleteProcurement',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/procurements/delete/${id}`);
        return response.data.data.procurement;
    }
);

interface DeleteProcurementState {
    procurements: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteProcurementState = {
    procurements: [],
    success: false,
    loading: false,
    error: null,
};

const deleteProcurementSlice = createSlice({
    name: 'deleteProcurement',
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
            .addCase(deleteProcurement.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteProcurement.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteProcurement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete procurement';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteProcurementSlice.actions;
export default deleteProcurementSlice.reducer;