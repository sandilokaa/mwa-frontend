import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Recruitment {
    name: string,
    submissionDate: string,
    joinDate: string,
    position: string,
    division: string
}

export const createdRecruitmentData = createAsyncThunk(
    'recruitments/createdRecruitmentData',
    async (newRecruitment: Recruitment, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/recruitments/create',
                newRecruitment,
            );
            return response.data.data.recruitment;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface RecruitmentState {
    createdRecruitment: Recruitment | null;
    loading: boolean;
    error: string | null;
}

const initialState: RecruitmentState = {
    createdRecruitment: null,
    loading: false,
    error: null,
};

const createRecruitment = createSlice({
    name: 'createRecruitment',
    initialState,
    reducers: {
        resetCreatedRecruitment(state) {
            state.createdRecruitment = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdRecruitmentData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdRecruitmentData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdRecruitment = action.payload;
            })
            .addCase(createdRecruitmentData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createRecruitment.reducer;