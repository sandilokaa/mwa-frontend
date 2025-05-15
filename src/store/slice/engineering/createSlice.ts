import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

interface Engineering {
    productId: number;
    partName: string, 
    drawingNumber: string, 
    category: string, 
    remark: string, 
    pic3D: string, 
    pic2DDXF: string, 
    startDate: string, 
    dateRequired: string, 
    price: string, 
    quantity: string, 
    picture: string | File,
}

export const createdEngineeringData = createAsyncThunk(
    'engineerings/createdEngineeringData',
    async (newEngineering: Engineering, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('productId', newEngineering.productId.toString());
            formData.append('partName', newEngineering.partName);
            formData.append('category', newEngineering.category);
            formData.append('drawingNumber', newEngineering.drawingNumber);
            formData.append('remark', newEngineering.remark);
            formData.append('picture', newEngineering.picture);
            formData.append('pic3D', newEngineering.pic3D);
            formData.append('pic2DDXF', newEngineering.pic2DDXF);
            formData.append('startDate', newEngineering.startDate);
            formData.append('dateRequired', newEngineering.dateRequired);
            formData.append('price', newEngineering.price);
            formData.append('quantity', newEngineering.quantity);

            const response = await api.post(
                '/api/v1/engineerings/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            return response.data.data.engineering;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Create failed');
        }
    }
);

interface EngineeringState {
    createdEngineering: Engineering | null;
    loading: boolean;
    error: string | null;
}

const initialState: EngineeringState = {
    createdEngineering: null,
    loading: false,
    error: null,
};

const createEngineering = createSlice({
    name: 'createEngineering',
    initialState,
    reducers: {
        resetCreatedEngineering(state) {
            state.createdEngineering = null;
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createdEngineeringData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdEngineeringData.fulfilled, (state, action) => {
                state.loading = false;
                state.createdEngineering = action.payload;
            })
            .addCase(createdEngineeringData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default createEngineering.reducer;