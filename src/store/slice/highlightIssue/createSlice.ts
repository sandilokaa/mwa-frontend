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

export const createdIssueData = createAsyncThunk(
    'highlight-issues/createdIssueData',
    async (newIssue: HighlightIssue, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/highlight-issues/create',
                newIssue,
            );
            return response.data.data.highlightIssue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface IssueState {
    createdIssue: HighlightIssue | null;
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    createdIssue: null,
    loading: false,
    error: null,
};

const createIssueSlice = createSlice({
    name: 'createIssue',
    initialState,
    reducers: {
        resetCreatedIssue(state) {
            state.createdIssue = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdIssueData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdIssueData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdIssue = action.payload;
            })
            .addCase(createdIssueData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createIssueSlice.reducer;