import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface ProjectTarget {
    productId: number;
    name: string;
    information: string;
    deletedImageId: number[];
    picture: File[];
    updatedImageId: number[];
    updatedImage: File[];
}

export const updateProjectTargetData = createAsyncThunk(
    'project-targets/updateProjectTarget',
    async (
        updatedProjectTarget: ProjectTarget & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('productId', updatedProjectTarget.productId.toString());
            formData.append('name', updatedProjectTarget.name);
            formData.append('information', updatedProjectTarget.information);
            updatedProjectTarget.deletedImageId.forEach(id => {
                formData.append('deletedImageId', id.toString());
            });
            updatedProjectTarget.picture.forEach((file) => {
                formData.append('picture', file);
            });
            updatedProjectTarget.updatedImageId.forEach((id, index) => {
                formData.append('updatedImageId', id.toString());
                formData.append('updatedImage', updatedProjectTarget.updatedImage[index]);
            });
            
            const response = await api.put(
                `/api/v1/project-targets/update/${updatedProjectTarget.id}`,
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
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface ProjectTargetState {
    updatedProjectTarget: ProjectTarget | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTargetState = {
    updatedProjectTarget: null,
    loading: false,
    error: null,
};

const updateProjectTarget = createSlice({
    name: 'updateProjectTarget',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateProjectTargetData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProjectTargetData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedProjectTarget = action.payload;
            })
            .addCase(updateProjectTargetData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateProjectTarget.reducer;