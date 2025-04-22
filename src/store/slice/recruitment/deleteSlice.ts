import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteRecruitment = createAsyncThunk(
    'recruitments/deleteRecruitment',
    async ({ id }: { id: number }) => {
        const response = await axios.delete(
            `http://localhost:8080/api/v1/recruitments/delete/${id}`,
            { withCredentials: true }
        );
        return response.data.data.recruitment;
    }
);

interface DeleteRecruitmentState {
    recruitments: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteRecruitmentState = {
    recruitments: [],
    success: false,
    loading: false,
    error: null,
};

const deleteRecruitmentSlice = createSlice({
    name: 'deleteRecruitment',
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
            .addCase(deleteRecruitment.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteRecruitment.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteRecruitment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete recruitment';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteRecruitmentSlice.actions;
export default deleteRecruitmentSlice.reducer;