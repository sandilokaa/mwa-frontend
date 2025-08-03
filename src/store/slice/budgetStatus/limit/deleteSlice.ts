import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteBudgetLimit = createAsyncThunk(
    'budget-statuses/deleteBudgetLimit',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/budget-statuses/delete/limit/${id}`);
        return response.data.data.budgetStatusLimit;
    }
);

interface DeleteBudgetLimitState {
    budgetLimit: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteBudgetLimitState = {
    budgetLimit: [],
    success: false,
    loading: false,
    error: null,
};

const deleteBudgetLimitSlice = createSlice({
    name: 'deleteBudgetLimit',
    initialState,
    reducers: {
        resetDeleteState(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(deleteBudgetLimit.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteBudgetLimit.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteBudgetLimit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete budget limit';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteBudgetLimitSlice.actions;
export default deleteBudgetLimitSlice.reducer;