import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPhotoUpdateLists = createAsyncThunk(
    'photo-updates/fetchPhotoUpdateLists',
    async ({ category, productId }: { category: string; productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/photo-updates/search?category=${category}&productId=${productId}`,
            { withCredentials: true }
        );
        return response.data.data.photoUpdate;
    }
);

interface PhotoUpdateState {
    photoUpdates: { id: number, productId: number, category: string, dateInput: Date, information: string, picture: string }[];
    loading: boolean;
    error: string | null;
}

const initialState: PhotoUpdateState = {
    photoUpdates: [],
    loading: false,
    error: null,
};

const photoUpdateSlice = createSlice({
    name: 'photoUpdateLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPhotoUpdateLists.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPhotoUpdateLists.fulfilled, (state, action) => {
                state.photoUpdates = action.payload;
                state.loading = false;
            })
            .addCase(fetchPhotoUpdateLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch photo update';
            })
    },
});

export default photoUpdateSlice.reducer;
