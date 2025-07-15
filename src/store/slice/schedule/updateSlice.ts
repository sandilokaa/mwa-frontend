import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Schedule {
    productId: number;
    scheduleName: string;
    pic: string;
    startDate: string;
    endDate: string;
}

export const updateScheduleData = createAsyncThunk(
    'schedules/updateScheduleData',
    async (
        updatedSchedule: Schedule & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedSchedule;
            const response = await api.put(
                `/api/v1/schedules/update/${id}`,
                data,
            );
            return response.data.data.schedule;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ScheduleState {
    updatedSchedule: Schedule | null;
    loading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    updatedSchedule: null,
    loading: false,
    error: null,
};

const updateScheduleSlice= createSlice({
    name: 'updateScheduleSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateScheduleData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateScheduleData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedSchedule = action.payload;
            })
            .addCase(updateScheduleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateScheduleSlice.reducer;
