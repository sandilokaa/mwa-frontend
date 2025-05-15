import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteEngineering = createAsyncThunk(
    'engineerings/deleteEngineering',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/engineerings/delete/${id}`);
        return response.data.data.engineering;
    }
);

interface DeleteEngineeringState {
    engineering: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteEngineeringState = {
    engineering: [],
    success: false,
    loading: false,
    error: null,
};

const deleteEngineeringSlice = createSlice({
    name: 'deleteEngineering',
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
            .addCase(deleteEngineering.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteEngineering.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteEngineering.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete production';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteEngineeringSlice.actions;
export default deleteEngineeringSlice.reducer;