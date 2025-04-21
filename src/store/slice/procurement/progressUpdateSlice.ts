import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Procurement {
    progress: string
}

export const updateProgressProcData = createAsyncThunk(
    'procurements/updateProgressProcData',
    async (
        updatedProgress: Procurement & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedProgress;
            const response = await axios.put(
                `http://localhost:8080/api/v1/procurements/progress/update/${id}`,
                data,
                { withCredentials: true }
            );
            return response.data.data.procurement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ProcurementState {
    updatedProgress: Procurement | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ProcurementState = {
    updatedProgress: null,
    success: false,
    loading: false,
    error: null,
};

const updateProgressSlice = createSlice({
    name: 'updateProgress',
    initialState,
    reducers: {
        resetUpdatedProgressProcurement(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateProgressProcData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProgressProcData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProgress = action.payload;
            })
            .addCase(updateProgressProcData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedProgressProcurement } = updateProgressSlice.actions;
export default updateProgressSlice.reducer;
