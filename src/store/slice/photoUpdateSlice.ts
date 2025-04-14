import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPhotoUpdates = createAsyncThunk(
    'photo-updates/fetchPhotoUpdates',
    async ({ category, productId }: { category: string; productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/photo-updates/search?category=${category}&productId=${productId}`,
            { withCredentials: true }
        );
        return response.data.data.photoUpdate;
    }
);

export const createPhotoUpdate = createAsyncThunk(
    'photo-updates/createPhotoUpdate',
    async (formData: FormData) => {
        const response = await axios.post(
            'http://localhost:8080/api/v1/photo-updates/create',
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            }
        );
        return response.data.message;
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
    name: 'photoUpdates',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPhotoUpdates.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPhotoUpdates.fulfilled, (state, action) => {
                state.photoUpdates = action.payload;
                state.loading = false;
            })
            .addCase(fetchPhotoUpdates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch photo update';
            })
            .addCase(createPhotoUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPhotoUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.photoUpdates.push(action.payload);
            })
            .addCase(createPhotoUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create photo update';
            });
    },
});

export default photoUpdateSlice.reducer;
