import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPhotoUpdateDetail = createAsyncThunk(
    'photo-updates/fetchPhotoUpdateDetail',
    async ({  id }: { id: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/photo-updates/${id}`,
            { withCredentials: true }
        );
        return response.data.data.photoUpdate;
    }
);

interface PhotoUpdate {
    id: number;
    productId: number;
    dateInput: string;
    information: string;
    picture?: string;
    category: string;
}

interface PhotoUpdateState {
    photoUpdateDetail: PhotoUpdate | null;
    loading: boolean;
    error: string | null;
}

const initialState: PhotoUpdateState = {
    photoUpdateDetail: null,
    loading: false,
    error: null,
};

const photoUpdateDetailSlice = createSlice({
    name: 'photoUpdateDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPhotoUpdateDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPhotoUpdateDetail.fulfilled, (state, action) => {
                state.photoUpdateDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchPhotoUpdateDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch procurement detail';
            })
    },
});

export default photoUpdateDetailSlice.reducer;