import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface PartDesign {
    productId: number,
    name: string,
    category: string,
    picture: string | File;
}

export const createdPartDesignData = createAsyncThunk(
    'part-designs/createdPartDesignData',
    async (newPartDesign: PartDesign, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newPartDesign.productId.toString());
            formData.append('name', newPartDesign.name);
            formData.append('category', newPartDesign.category);
            formData.append('picture', newPartDesign.picture);

            const response = await api.post(
                '/api/v1/part-designs/create',
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
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface PartDesignState {
    createdPartDesign: PartDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: PartDesignState = {
    createdPartDesign: null,
    loading: false,
    error: null,
};

const createPartDesign = createSlice({
    name: 'createPartDesign',
    initialState,
    reducers: {
        resetCreatedPartDesign(state) {
            state.createdPartDesign = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdPartDesignData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdPartDesignData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdPartDesign = action.payload;
            })
            .addCase(createdPartDesignData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createPartDesign.reducer;