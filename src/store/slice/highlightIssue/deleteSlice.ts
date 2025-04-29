import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteIssue = createAsyncThunk(
    'highlight-issues/deleteIssue',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/highlight-issues/delete/${id}`);
        return response.data.data.highlightIssue;
    }
);

interface DeleteIssueState {
    issues: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteIssueState = {
    issues: [],
    success: false,
    loading: false,
    error: null,
};

const deleteIssueSlice = createSlice({
    name: 'deleteIssue',
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
            .addCase(deleteIssue.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteIssue.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteIssue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete issue';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteIssueSlice.actions;
export default deleteIssueSlice.reducer;