import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface PartDesign {
    productId: number;
    name: string, 
    category: string, 
    picture: string | File,
}

export const updatePartDesignData = createAsyncThunk(
    'part-designs/updatePartDesign',
    async (
        updatedPartDesign: PartDesign & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('productId', updatedPartDesign.productId.toString());
            formData.append('name', updatedPartDesign.name);
            formData.append('category', updatedPartDesign.category);
            formData.append('picture', updatedPartDesign.picture);
            
            const response = await api.put(
                `/api/v1/part-designs/update/${updatedPartDesign.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.partDesign;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface PartDesignState {
    updatedPartDesign: PartDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: PartDesignState = {
    updatedPartDesign: null,
    loading: false,
    error: null,
};

const updatePartDesign = createSlice({
    name: 'updatePartDesign',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updatePartDesignData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePartDesignData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedPartDesign = action.payload;
            })
            .addCase(updatePartDesignData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updatePartDesign.reducer;