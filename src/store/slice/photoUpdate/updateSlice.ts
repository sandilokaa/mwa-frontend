import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface PhotoUpdate {
    productId: number,
    information: string,
    dateInput: string,
    category: string
    picture: string | File;
}

export const updatedPhotoUpdateData = createAsyncThunk(
    'photo-updates/updatedPhotoUpdateData',
    async (newPhotoUpdate: PhotoUpdate & { id: number }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newPhotoUpdate.productId.toString());
            formData.append('information', newPhotoUpdate.information);
            formData.append('dateInput', newPhotoUpdate.dateInput);
            formData.append('category', newPhotoUpdate.category);
            formData.append('picture', newPhotoUpdate.picture);

            const response = await api.put(
                `/api/v1/photo-updates/update/${newPhotoUpdate.id}`,
                newPhotoUpdate,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.photoUpdate;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface PhotoUpdateState {
    updatedPhotoUpdate: PhotoUpdate | null;
    loading: boolean;
    error: string | null;
}

const initialState: PhotoUpdateState = {
    updatedPhotoUpdate: null,
    loading: false,
    error: null,
};

const updatePhotoUpdate = createSlice({
    name: 'updatePhotoUpdate',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updatedPhotoUpdateData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatedPhotoUpdateData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedPhotoUpdate = action.payload;
            })
            .addCase(updatedPhotoUpdateData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default updatePhotoUpdate.reducer;