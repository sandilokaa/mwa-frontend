import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const deletePartDesign = createAsyncThunk(
    'part-designs/deletePartDesign',
    async ({ id }: { id: number }) => {
        const response = await api.delete(`/api/v1/part-designs/delete/${id}`);
        return response.data.data.partDesign;
    }
);

interface DeletedeletePartDesignState {
    partDesign: {id: number}[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DeletedeletePartDesignState = {
    partDesign: [],
    success: false,
    loading: false,
    error: null,
};

const deletePartDesignSlice = createSlice({
    name: 'deletePartDesign',
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
            .addCase(deletePartDesign.pending, state => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deletePartDesign.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deletePartDesign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete part design';
                state.success = false;
            });
    }
});

export const { resetDeleteState } = deletePartDesignSlice.actions;
export default deletePartDesignSlice.reducer;