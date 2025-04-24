import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Recruitment {
    progress: string
}

export const updateProgressRecData = createAsyncThunk(
    'recruitments/updateProgressRecData',
    async (
        updatedProgress: Recruitment & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedProgress;
            const response = await axios.put(
                `http://localhost:8080/api/v1/recruitments/progress/update/${id}`,
                data,
                { withCredentials: true }
            );
            return response.data.data.recruitment;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface RecruitmentState {
    updatedProgress: Recruitment | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: RecruitmentState = {
    updatedProgress: null,
    success: false,
    loading: false,
    error: null,
};

const updateProgressSlice = createSlice({
    name: 'updateProgress',
    initialState,
    reducers: {
        resetUpdatedProgressRecruitment(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateProgressRecData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProgressRecData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProgress = action.payload;
            })
            .addCase(updateProgressRecData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedProgressRecruitment } = updateProgressSlice.actions;
export default updateProgressSlice.reducer;
