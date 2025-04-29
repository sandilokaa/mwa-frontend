import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface HighlightIssue {
    statusIssue: string
}

export const updateStatusIssueData = createAsyncThunk(
    'highlight-issues/updateIssueData',
    async (
        updatedIssue: HighlightIssue & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedIssue;
            const response = await api.put(
                `/api/v1/highlight-issues/status/update/${id}`,
                data,
            );
            return response.data.data.highlightIssue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface IssueState {
    updatedStatus: HighlightIssue | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    updatedStatus: null,
    success: false,
    loading: false,
    error: null,
};

const updateStatusSlice = createSlice({
    name: 'updateStatus',
    initialState,
    reducers: {
        resetUpdatedStatusIssue(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateStatusIssueData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStatusIssueData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedStatus = action.payload;
            })
            .addCase(updateStatusIssueData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedStatusIssue } = updateStatusSlice.actions;
export default updateStatusSlice.reducer;
