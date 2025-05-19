import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredStylingDesign = createAsyncThunk(
    'styling-designs/fetchFilteredStylingDesign',
    async ({  productId }: { productId: number }) => {
        const response = await api.get(`/api/v1/styling-designs/search?&productId=${productId}`);
        return response.data.data.stylingDesign;
    }
);

interface StylingDesign {
    id: number, 
    productId: number, 
    name: string,
    StylingDesignImages: {
        picture: string
    }[];
}

interface StylingDesignState {
    filteredStylingDesigns: StylingDesign[];
    loading: boolean;
    error: string | null;
}

const initialState: StylingDesignState = {
    filteredStylingDesigns: [],
    loading: false,
    error: null,
};

const stylingDesignSlice = createSlice({
    name: 'stylingDesignLists',
    initialState,
    reducers: {
        resetFilteredStylingDesign(state) {
            state.filteredStylingDesigns = [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredStylingDesign.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredStylingDesign.fulfilled, (state, action) => {
                state.filteredStylingDesigns = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredStylingDesign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch styling design';
            })
    },
});

export const { resetFilteredStylingDesign } = stylingDesignSlice.actions;
export default stylingDesignSlice.reducer;