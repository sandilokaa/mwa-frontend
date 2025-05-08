import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchIssueDetail = createAsyncThunk(
    'highlight-issues/fetchIssueDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/highlight-issues/${id}`);
        return response.data.data.highlightIssue;
    }
);

export enum StatusIssue {
    Overdue = 'overdue',
    OnProgress = 'on progress',
    Finish = 'finish'
}

interface Issue {
    id: number;
    productId: number;
    itemName: string,
    category: string,
    issue: string,
    pic: string,
    countermeassure: string,
    dueDate: string,
    statusIssue: StatusIssue 
}

interface IssueState {
    issueDetail: Issue | null;
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    issueDetail: null,
    loading: false,
    error: null,
};

const issueDetailSlice = createSlice({
    name: 'issueDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchIssueDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssueDetail.fulfilled, (state, action) => {
                state.issueDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchIssueDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch issue detail';
            })
    },
});

export default issueDetailSlice.reducer;
