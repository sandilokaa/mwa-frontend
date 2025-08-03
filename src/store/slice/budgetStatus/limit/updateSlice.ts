import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface BudgetLimit {
    productId: number;
    system: string;
    limit: number;
    month: string;
    year: string;
}


export const updateBudgetLimitData = createAsyncThunk(
    'budget-statuses/updateBudgetLimitData',
    async (
        updatedBudgetLimit: BudgetLimit & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedBudgetLimit;
            const response = await api.put(
                `/api/v1/budget-statuses/update/limit/${id}`,
                data,
            );
            return response.data.data.budgetStatusLimit;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface BudgetLimitState {
    updatedBudgetLimit: BudgetLimit | null;
    loading: boolean;
    error: string | null;
}

const initialState: BudgetLimitState = {
    updatedBudgetLimit: null,
    loading: false,
    error: null,
};

const updatedBudgetLimitSlice = createSlice({
    name: 'updatedBudgetLimitSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateBudgetLimitData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBudgetLimitData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedBudgetLimit = action.payload;
            })
            .addCase(updateBudgetLimitData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updatedBudgetLimitSlice.reducer;
