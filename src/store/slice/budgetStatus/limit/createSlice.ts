import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface BudgetLimit {
    productId: number;
    system: string;
    limit: number;
    month: string;
    year: string;
}

export const createdBudgetLimitData = createAsyncThunk(
    'budget-statuses/createdBudgetLimitData',
    async (newIssue: BudgetLimit, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/budget-statuses/create/limit',
                newIssue,
            );
            return response.data.data.budgetStatusLimit;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface BudgetLimitState {
    createdBudgetLimit: BudgetLimit | null;
    loading: boolean;
    error: string | null;
}

const initialState: BudgetLimitState = {
    createdBudgetLimit: null,
    loading: false,
    error: null,
};

const createBudgetLimitSlice = createSlice({
    name: 'createBudgetLimit',
    initialState,
    reducers: {
        resetCreatedBudgetLimit(state) {
            state.createdBudgetLimit = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdBudgetLimitData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdBudgetLimitData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdBudgetLimit = action.payload;
            })
            .addCase(createdBudgetLimitData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createBudgetLimitSlice.reducer;