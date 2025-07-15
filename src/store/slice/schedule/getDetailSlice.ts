import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchScheduleDetail = createAsyncThunk(
    'schedules/fetchIssueDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/schedules/${id}`);
        return response.data.data.schedule;
    }
);

interface Schedule {
    id: number, 
    productId: number,
    scheduleName: string;
    pic: string;
    startDate: string;
    endDate: string; 
}

interface ScheduleState {
    scheduleDetail: Schedule | null;
    loading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    scheduleDetail: null,
    loading: false,
    error: null,
};

const scheduleDetailSlice = createSlice({
    name: 'scheduleDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchScheduleDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScheduleDetail.fulfilled, (state, action) => {
                state.scheduleDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchScheduleDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch schedule detail';
            })
    },
});

export default scheduleDetailSlice.reducer;
