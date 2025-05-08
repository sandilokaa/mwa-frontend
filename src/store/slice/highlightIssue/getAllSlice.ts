import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredIssue = createAsyncThunk(
    'highlight-issues/fetchFilteredIssue',
    async ({  productId, itemName, page }: { productId: number, itemName: string, page: number }) => {
        const response = await api.get(`/api/v1/highlight-issues/search?&productId=${productId}&itemName=${itemName}&page=${page}`);
        return response.data.data.highlightIssue;
    }
);

export const fetchIssueMetrics = createAsyncThunk(
    'highlight-issues/fetchIssueMetrics',
    async ({  productId }: { productId: number }) => {
        const response = await api.get(
            `/api/v1/highlight-issues/metrics/total?&productId=${productId}`);
        return response.data.data.highlightIssue;
    }
);

export const fetchSummaryIssue= createAsyncThunk(
    'highlight-issues/fetchSummaryIssue',
    async ({  productId }: { productId: number }) => {
        const response = await api.get(
            `/api/v1/highlight-issues/summary/stat?&productId=${productId}`);
        return response.data.data.highlightIssue;
    }
);

export enum StatusIssue {
    Overdue = 'overdue',
    OnProgress = 'on progress',
    Done = 'done'
}

interface HighlightIssue {
    id: number, 
    productId: number, 
    itemName: string,
    issue: string,
    pic: string,
    dueDate: Date,
    revisionDate: Date,
    statusIssue: StatusIssue 
}

interface PaginatedHighlightIssueData {
    highlightDataFiltered: HighlightIssue[];
    totalHI: number;
    currentPagesHI: number;
    totalPagesHI: number;
}

interface IssueState {
    filteredIssues: PaginatedHighlightIssueData;
    issueMetrics: [];
    summaryIssues: {pic: string, count: number}[];
    loading: boolean;
    error: string | null;
}

const initialState: IssueState = {
    filteredIssues: {
        highlightDataFiltered: [],
        totalHI: 0,
        currentPagesHI: 1,
        totalPagesHI: 1,
    },
    issueMetrics: [],
    summaryIssues: [],
    loading: false,
    error: null,
};

const issueSlice = createSlice({
    name: 'issueLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchSummaryIssue.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryIssue.fulfilled, (state, action) => {
                state.summaryIssues = action.payload;
            })
            .addCase(fetchSummaryIssue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch summary issue';
            })
            .addCase(fetchIssueMetrics.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssueMetrics.fulfilled, (state, action) => {
                state.issueMetrics = action.payload;
            })
            .addCase(fetchIssueMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch issue';
            })
            .addCase(fetchFilteredIssue.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredIssue.fulfilled, (state, action) => {
                state.filteredIssues = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredIssue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch issue';
            })
    },
});

export default issueSlice.reducer;