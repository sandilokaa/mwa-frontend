import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface StylingDesign {
    productId: number;
    name: string;
    deletedImageId: number[];
    picture: File[];
}

export const updateStylingDesignData = createAsyncThunk(
    'styling-designs/updateStylingDesign',
    async (
        updatedStylingDesign: StylingDesign & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('productId', updatedStylingDesign.productId.toString());
            formData.append('name', updatedStylingDesign.name);
            updatedStylingDesign.deletedImageId.forEach(id => {
                formData.append('deletedImageId', id.toString());
            });
            updatedStylingDesign.picture.forEach((file) => {
                formData.append('picture', file);
            });
            
            const response = await api.put(
                `/api/v1/styling-designs/update/${updatedStylingDesign.id}`,
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
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface StylingDesignState {
    updatedStylingDesign: StylingDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: StylingDesignState = {
    updatedStylingDesign: null,
    loading: false,
    error: null,
};

const updateStylingDesign = createSlice({
    name: 'updateStylingDesign',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateStylingDesignData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStylingDesignData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedStylingDesign = action.payload;
            })
            .addCase(updateStylingDesignData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateStylingDesign.reducer;