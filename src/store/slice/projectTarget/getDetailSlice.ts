import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchProjectTargetDetail = createAsyncThunk(
    'project-targets/fetchProjectTargetDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/project-targets/${id}`);
        return response.data.data.projectTarget;
    }
);

interface ProjectTarget {
    id: number;
    productId: number;
    name: string;
    information: string;
    ProjectTargetImages: {
        id: number;
        projectTargetId: number;
        picture: string;
    }[];
}

interface ProjectTargetState {
    projectTargetDetail: ProjectTarget | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTargetState = {
    projectTargetDetail: null,
    loading: false,
    error: null,
};

const projectTargetDetailSlice = createSlice({
    name: 'projectTargetDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchProjectTargetDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectTargetDetail.fulfilled, (state, action) => {
                state.projectTargetDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjectTargetDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch project target detail';
            })
    },
});

export default projectTargetDetailSlice.reducer;
