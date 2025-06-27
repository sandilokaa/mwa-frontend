import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchProductDetail = createAsyncThunk(
    'products/fetchProductDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/products/${id}`);
        return response.data.data.product;
    }
);

interface Product {
    id: number;
    name: string;
    tagline: string;
    description: string;
    picture: string
}

interface ProductState {
    productDetail: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    productDetail: null,
    loading: false,
    error: null,
};

const productDetailSlice = createSlice({
    name: 'productDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProductDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.productDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch product detail';
            })
    },
});

export default productDetailSlice.reducer;
