import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface ProjectTarget {
    productId: number;
    name: string, 
    information: string,
    picture: File[]
}

export const createdProjectTargetData = createAsyncThunk(
    'project-targets/createdProjectTargetData',
    async (newProjectTarget: ProjectTarget, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newProjectTarget.productId.toString());
            formData.append('name', newProjectTarget.name);
            formData.append('information', newProjectTarget.information);
            newProjectTarget.picture.forEach((file) => {
                formData.append('picture', file);
            });

            const response = await api.post(
                '/api/v1/project-targets/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.projectTarget;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface ProjectTargetState {
    createdProjectTarget: ProjectTarget | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTargetState = {
    createdProjectTarget: null,
    loading: false,
    error: null,
};

const createProjectTarget = createSlice({
    name: 'createProjectTarget',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createdProjectTargetData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdProjectTargetData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdProjectTarget = action.payload;
            })
            .addCase(createdProjectTargetData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createProjectTarget.reducer;