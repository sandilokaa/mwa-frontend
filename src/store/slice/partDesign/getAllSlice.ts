import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchPartDesignLists = createAsyncThunk(
    'part-designs/fetchPartDesignLists',
    async ({ category, productId }: { category: string; productId: number }) => {
        const response = await api.get(`/api/v1/part-designs/search?category=${category}&productId=${productId}`);
        return response.data.data.partDesign;
    }
);

interface PartDesignState {
    partDesigns: { id: number, productId: number, category: string, name: string, picture: string }[];
    loading: boolean;
    error: string | null;
}

const initialState: PartDesignState = {
    partDesigns: [],
    loading: false,
    error: null,
};

const partDesignSlice = createSlice({
    name: 'partDesignLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPartDesignLists.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartDesignLists.fulfilled, (state, action) => {
                state.partDesigns = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartDesignLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch part design';
            })
    },
});

export default partDesignSlice.reducer;
