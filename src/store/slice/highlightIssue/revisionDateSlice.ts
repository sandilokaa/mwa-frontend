import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface HighlightIssue {
    revisionDate: string;
}

export const updateRevisionIssueData = createAsyncThunk(
    'highlight-issues/updateRevisionIssueData',
    async (
        updatedIssue: HighlightIssue & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedIssue;
            const response = await api.put(
                `/api/v1/highlight-issues/revision/update/${id}`,
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
    updatedRevision: HighlightIssue | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    updatedRevision: null,
    success: false,
    loading: false,
    error: null,
};

const updateRevisionSlice = createSlice({
    name: 'updateRevision',
    initialState,
    reducers: {
        resetUpdatedRevisionIssue(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateRevisionIssueData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRevisionIssueData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedRevision = action.payload;
            })
            .addCase(updateRevisionIssueData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedRevisionIssue } = updateRevisionSlice.actions;
export default updateRevisionSlice.reducer;
