import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchStylingDesignDetail = createAsyncThunk(
    'styling-designs/fetchStylingDesignDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/styling-designs/${id}`);
        return response.data.data.stylingDesign;
    }
);

interface StylingDesign {
    id: number;
    productId: number;
    name: string;
    StylingDesignImages: {
        id: number;
        stylingDesignId: number;
        picture: string;
    }[];
}

interface StylingDesignState {
    stylingDesignDetail: StylingDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: StylingDesignState = {
    stylingDesignDetail: null,
    loading: false,
    error: null,
};

const stylingDesignDetailSlice = createSlice({
    name: 'stylingDesignDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchStylingDesignDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStylingDesignDetail.fulfilled, (state, action) => {
                state.stylingDesignDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchStylingDesignDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch styling design detail';
            })
    },
});

export default stylingDesignDetailSlice.reducer;
