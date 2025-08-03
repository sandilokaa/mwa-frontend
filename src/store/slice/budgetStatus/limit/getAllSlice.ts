import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredBudgetLimit = createAsyncThunk(
    'highlight-issues/fetchFilteredBudgetLimit',
    async ({  productId, system, page, month, year }: { productId: number, system: string, page: number, month: string, year: string }) => {
        const response = await api.get(`/api/v1/budget-statuses/search/limit?&productId=${productId}&system=${system}&page=${page}&month=${month}&year=${year}`);
        return response.data.data.budgetStatusLimit;
    }
);

interface BudgetLimit {
    id: number, 
    productId: number, 
    system: string,
    limit: string,
    month: string,
    year: string,
}

interface PaginatedBudgetLimitData {
    budgetLimitDataFiltered: BudgetLimit[];
    totalBudgetLimit: number;
    currentPagesBudgetLimit: number;
    totalPagesBudgetLimit: number;
}

interface BudgetLimitState {
    filteredBudgetLimit: PaginatedBudgetLimitData;
    loading: boolean;
    error: string | null;
}

const initialState: BudgetLimitState = {
    filteredBudgetLimit: {
        budgetLimitDataFiltered: [],
        totalBudgetLimit: 0,
        currentPagesBudgetLimit: 1,
        totalPagesBudgetLimit: 1,
    },
    loading: false,
    error: null,
};

const budgetLimitSlice = createSlice({
    name: 'budgetLimitList',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredBudgetLimit.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredBudgetLimit.fulfilled, (state, action) => {
                state.filteredBudgetLimit = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredBudgetLimit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch budget limit';
            })
    },
});

export default budgetLimitSlice.reducer;