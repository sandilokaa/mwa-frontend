import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchBudgetLimitDetail = createAsyncThunk(
    'budget-statuses/fetchBudgetLimitDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/budget-statuses/limit/${id}`);
        return response.data.data.budgetStatusLimit;
    }
);

interface BudgetLimit {
    id: number;
    productId: number;
    system: string,
    limit: number,
    month: string,
    year: string,
}

interface BudgetLimitState {
    budgetLimitDetail: BudgetLimit | null;
    loading: boolean;
    error: string | null;
}

const initialState: BudgetLimitState = {
    budgetLimitDetail: null,
    loading: false,
    error: null,
};

const budgetLimitDetailSlice = createSlice({
    name: 'budgetLimitDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBudgetLimitDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBudgetLimitDetail.fulfilled, (state, action) => {
                state.budgetLimitDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchBudgetLimitDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch issue detail';
            })
    },
});

export default budgetLimitDetailSlice.reducer;
