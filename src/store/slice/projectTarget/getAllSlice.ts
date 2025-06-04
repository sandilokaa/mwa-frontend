import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredProjectTarget = createAsyncThunk(
    'project-targets/fetchFilteredProjectTarget',
    async ({  productId }: { productId: number }) => {
        const response = await api.get(`/api/v1/project-targets/search?&productId=${productId}`);
        return response.data.data.projectTarget;
    }
);

interface ProjectTarget {
    id: number, 
    productId: number, 
    name: string,
    information: string,
    ProjectTargetImages: {
        picture: string
    }[];
}

interface ProjectTargetState {
    filteredProjectTargets: ProjectTarget[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTargetState = {
    filteredProjectTargets: [],
    loading: false,
    error: null,
};

const projectTargetSlice = createSlice({
    name: 'projectTargetLists',
    initialState,
    reducers: {
        resetFilteredProjectTarget(state) {
            state.filteredProjectTargets = [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredProjectTarget.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredProjectTarget.fulfilled, (state, action) => {
                state.filteredProjectTargets = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredProjectTarget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch project target';
            })
    },
});

export const { resetFilteredProjectTarget } = projectTargetSlice.actions;
export default projectTargetSlice.reducer;