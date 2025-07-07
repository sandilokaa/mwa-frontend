import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Schedule {
    productId: number;
    scheduleName: string;
    pic: string;
    startDate: string;
    endDate: string;
}

export const createdScheduleData = createAsyncThunk(
    'schedules/createdScheduleData',
    async (newSchedule: Schedule, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/schedules/create',
                newSchedule,
            );
            return response.data.data.schedule;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface ScheduleState {
    createdSchedule: Schedule | null;
    loading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    createdSchedule: null,
    loading: false,
    error: null,
};

const createScheduleSlice = createSlice({
    name: 'createSchedule',
    initialState,
    reducers: {
        resetCreatedSchedule(state) {
            state.createdSchedule = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdScheduleData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdScheduleData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdSchedule = action.payload;
            })
            .addCase(createdScheduleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createScheduleSlice.reducer;