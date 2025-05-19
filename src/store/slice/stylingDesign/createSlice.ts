import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface StylingDesign {
    productId: number;
    name: string, 
    picture: File[]
}

export const createdStylingDesignData = createAsyncThunk(
    'styling-designs/createdStylingDesignData',
    async (newStylingDesign: StylingDesign, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newStylingDesign.productId.toString());
            formData.append('name', newStylingDesign.name);
            newStylingDesign.picture.forEach((file) => {
                formData.append('picture', file);
            });

            const response = await api.post(
                '/api/v1/styling-designs/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.stylingDesign;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface StylingDesignState {
    createdStylingDesign: StylingDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: StylingDesignState = {
    createdStylingDesign: null,
    loading: false,
    error: null,
};

const createStylingDesign = createSlice({
    name: 'createStylingDesign',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createdStylingDesignData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdStylingDesignData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdStylingDesign = action.payload;
            })
            .addCase(createdStylingDesignData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createStylingDesign.reducer;