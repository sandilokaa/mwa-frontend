import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Product {
    name: string;
    tagline: string, 
    description: string, 
    picture: string | File,
}

export const updateProductData = createAsyncThunk(
    'products/updateProduct',
    async (
        updatedProduct: Product & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedProduct.name);
            formData.append('tagline', updatedProduct.tagline);
            formData.append('description', updatedProduct.description);
            formData.append('picture', updatedProduct.picture);
            
            const response = await api.put(
                `/api/v1/products/update/${updatedProduct.id}`,
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
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ProductState {
    updatedProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    updatedProduct: null,
    loading: false,
    error: null,
};

const updateProduct = createSlice({
    name: 'updateProduct',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateProductData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProduct = action.payload;
            })
            .addCase(updateProductData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateProduct.reducer;