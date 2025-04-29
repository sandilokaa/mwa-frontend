import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface HighlightIssue {
    productId: number;
    itemName: string;
    category: string;
    pic: string;
    issue: string;
    countermeassure: string;
    dueDate: string;
}

export const updateIssueData = createAsyncThunk(
    'highlight-issues/updateIssueData',
    async (
        updatedIssue: HighlightIssue & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedIssue;
            const response = await api.put(
                `/api/v1/highlight-issues/update/${id}`,
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
    updatedIssue: HighlightIssue | null;
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    updatedIssue: null,
    loading: false,
    error: null,
};

const updateIssueSlice= createSlice({
    name: 'updateIssueSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateIssueData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIssueData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedIssue = action.payload;
            })
            .addCase(updateIssueData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateIssueSlice.reducer;
