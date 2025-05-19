import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchPartDesignDetail = createAsyncThunk(
    'part-designs/fetchPartDesignDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/part-designs/${id}`);
        return response.data.data.partDesign;
    }
);

interface PartDesign {
    id: number;
    productId: number;
    name: string;
    category: string;
    picture: string
}

interface PartDesignState {
    partDesignDetail: PartDesign | null;
    loading: boolean;
    error: string | null;
}

const initialState: PartDesignState = {
    partDesignDetail: null,
    loading: false,
    error: null,
};

const partDesignDetailSlice = createSlice({
    name: 'partDesignDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPartDesignDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartDesignDetail.fulfilled, (state, action) => {
                state.partDesignDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartDesignDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch part design detail';
            })
    },
});

export default partDesignDetailSlice.reducer;
