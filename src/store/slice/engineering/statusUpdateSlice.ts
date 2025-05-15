import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Engineering {
    status3D?: string,
    status2D?: string,
    statusDXF?: string,
}

export const updateEngineeringStatusData = createAsyncThunk(
    'engineerings/updateEngineeringStatusData',
    async (
        updatedEngineeringStatus: Engineering & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const { id, ...data } = updatedEngineeringStatus;
            const response = await api.put(
                `/api/v1/engineerings/status/update/${id}`,
                data,
            );
            return response.data.data.engineering;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface EngineeringState {
    updatedStatus: Engineering | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: EngineeringState = {
    updatedStatus: null,
    success: false,
    loading: false,
    error: null,
};

const updateStatusSlice = createSlice({
    name: 'updateStatus',
    initialState,
    reducers: {
        resetUpdatedStatusEngineering(state) {
            state.success = false;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateEngineeringStatusData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEngineeringStatusData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedStatus = action.payload;
            })
            .addCase(updateEngineeringStatusData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetUpdatedStatusEngineering } = updateStatusSlice.actions;
export default updateStatusSlice.reducer;