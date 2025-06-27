import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/products/delete/${id}`);
        return response.data.data.product;
    }
);

interface DeleteProductState {
    product: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeleteProductState = {
    product: [],
    success: false,
    loading: false,
    error: null,
};

const deleteProductSlice = createSlice({
    name: 'deleteProduct',
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
            .addCase(deleteProduct.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete product';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deleteProductSlice.actions;
export default deleteProductSlice.reducer;