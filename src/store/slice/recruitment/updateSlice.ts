import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Recruitment {
    name: string,
    submissionDate: string,
    joinDate: string,
    position: string,
    division: string
}

export const updateRecruitmentData = createAsyncThunk(
    'recruitments/updateRecruitmentData',
    async (
        updatedRecruitment: Recruitment & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedRecruitment;
            const response = await api.put(
                `/api/v1/recruitments/update/${id}`,
                data,
            );
            return response.data.data.recruitment;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface RecruitmentState {
    updatedRecruitment: Recruitment | null;
    loading: boolean;
    error: string | null;
}

const initialState: RecruitmentState = {
    updatedRecruitment: null,
    loading: false,
    error: null,
};

const updateRecruitment = createSlice({
    name: 'updateRecruitment',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateRecruitmentData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRecruitmentData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedRecruitment = action.payload;
            })
            .addCase(updateRecruitmentData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateRecruitment.reducer;
