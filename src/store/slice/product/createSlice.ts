import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Product {
    name: string,
    tagline: string,
    description: string,
    picture: string | File;
}

export const createdProductData = createAsyncThunk(
    'products/createdProductData',
    async (newProduct: Product, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('tagline', newProduct.tagline);
            formData.append('description', newProduct.description);
            formData.append('picture', newProduct.picture);

            const response = await api.post(
                '/api/v1/products/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.product;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface ProductState {
    createdProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    createdProduct: null,
    loading: false,
    error: null,
};

const createProduct = createSlice({
    name: 'createProduct',
    initialState,
    reducers: {
        resetCreatedProduct(state) {
            state.createdProduct = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdProductData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdProductData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdProduct = action.payload;
            })
            .addCase(createdProductData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createProduct.reducer;