import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredSchedule = createAsyncThunk(
    'schedules/fetchFilteredSchedule',
    async ({  productId }: { productId: number }) => {
        const response = await api.get(`/api/v1/schedules/search?&productId=${productId}`);
        return response.data.data.schedule;
    }
);

export interface Schedule {
    id: number, 
    productId: number,
    scheduleName: string;
    pic: string;
    startDate: string;
    endDate: string; 
}
interface ScheduleState {
    filteredSchedule: Schedule[];
    loading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    filteredSchedule: [],
    loading: false,
    error: null,
};

const scheduleSlice = createSlice({
    name: 'scheduleLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredSchedule.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredSchedule.fulfilled, (state, action) => {
                state.filteredSchedule = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch schedule';
            })
    },
});

export default scheduleSlice.reducer;