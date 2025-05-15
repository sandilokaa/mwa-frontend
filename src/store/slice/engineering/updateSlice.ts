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
    price: string,
    quantity: string,
    startDate: string,
    dateRequired: string,
    picture: string | File,
}

export const updateEngineeringData = createAsyncThunk(
    'engineerings/updateEngineering',
    async (
        updatedEngineering: Engineering & { id: number },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('productId', updatedEngineering.productId.toString());
            formData.append('partName', updatedEngineering.partName);
            formData.append('category', updatedEngineering.category);
            formData.append('drawingNumber', updatedEngineering.drawingNumber);
            formData.append('remark', updatedEngineering.remark);
            formData.append('pic3D', updatedEngineering.pic3D);
            formData.append('pic2DDXF', updatedEngineering.pic2DDXF);
            formData.append('price', updatedEngineering.price);
            formData.append('quantity', updatedEngineering.quantity);
            formData.append('startDate', updatedEngineering.startDate);
            formData.append('dateRequired', updatedEngineering.dateRequired);
            formData.append('picture', updatedEngineering.picture);
            
            const response = await api.put(
                `/api/v1/engineerings/update/${updatedEngineering.id}`,
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
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

interface EngineeringState {
    updatedEngineering: Engineering | null;
    loading: boolean;
    error: string | null;
}

const initialState: EngineeringState = {
    updatedEngineering: null,
    loading: false,
    error: null,
};

const updateEngineering = createSlice({
    name: 'updateEngineering',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateEngineeringData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEngineeringData.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedEngineering = action.payload;
            })
            .addCase(updateEngineeringData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default updateEngineering.reducer;