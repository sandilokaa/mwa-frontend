import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteSchedule = createAsyncThunk(
    'schedules/deleteSchedule',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/schedules/delete/${id}`);
        return response.data.data.schedule;
    }
);

interface DeleteScheduleState {
    schedule: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteScheduleState = {
    schedule: [],
    success: false,
    loading: false,
    error: null,
};

const deleteScheduleSlice = createSlice({
    name: 'deleteSchedule',
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
            .addCase(deleteSchedule.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteSchedule.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete schedule';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteScheduleSlice.actions;
export default deleteScheduleSlice.reducer;