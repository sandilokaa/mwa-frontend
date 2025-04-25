import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PhotoUpdate {
    productId: number,
    information: string,
    dateInput: string,
    category: string
    picture: string | File;
}

export const createdPhotoUpdateData = createAsyncThunk(
    'photo-updates/createdPhotoUpdateData',
    async (newPhotoUpdate: PhotoUpdate, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newPhotoUpdate.productId.toString());
            formData.append('information', newPhotoUpdate.information);
            formData.append('dateInput', newPhotoUpdate.dateInput);
            formData.append('category', newPhotoUpdate.category);
            formData.append('picture', newPhotoUpdate.picture);

            const response = await axios.post(
                'http://localhost:8080/api/v1/photo-updates/create',
                newPhotoUpdate,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.photoUpdate;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface PhotoUpdateState {
    createdPhotoUpdate: PhotoUpdate | null;
    loading: boolean;
    error: string | null;
}

const initialState: PhotoUpdateState = {
    createdPhotoUpdate: null,
    loading: false,
    error: null,
};

const createPhotoUpdate = createSlice({
    name: 'createPhotoUpdate',
    initialState,
    reducers: {
        resetCreatedPhotoUpdate(state) {
            state.createdPhotoUpdate = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdPhotoUpdateData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdPhotoUpdateData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdPhotoUpdate = action.payload;
            })
            .addCase(createdPhotoUpdateData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createPhotoUpdate.reducer;