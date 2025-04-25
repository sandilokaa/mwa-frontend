import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deletePhotoUpdate = createAsyncThunk(
    'photo-updates/deletePhotoUpdate',
    async ({ id }: { id: number }) => {
        const response = await axios.delete(
            `http://localhost:8080/api/v1/photo-updates/delete/${id}`,
            { withCredentials: true }
        );
        return response.data.data.photoUpdate;
    }
);

interface DeletePhotoUpdateState {
    photoUpdates: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeletePhotoUpdateState = {
    photoUpdates: [],
    success: false,
    loading: false,
    error: null,
};

const deletePhotoUpdateSlice = createSlice({
    name: 'deletePhotoUpdate',
    initialState,
    reducers: {
        resetDeleteState(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(deletePhotoUpdate.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deletePhotoUpdate.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deletePhotoUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete recruitment';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deletePhotoUpdateSlice.actions;
export default deletePhotoUpdateSlice.reducer;