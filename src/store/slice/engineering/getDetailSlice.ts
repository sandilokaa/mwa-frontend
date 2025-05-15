import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchEngineeringDetail = createAsyncThunk(
    'engineerings/fetchEngineeringDetail',
    async ({  id }: { id: number }) => {
        const response = await api.get(`/api/v1/engineerings/${id}`);
        return response.data.data.engineering;
    }
);

export enum EngineeringStatus {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

export enum Status3D {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

export enum Status2D {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

export enum StatusDXF {
    NotYet = 'not yet',
    OnGoing = 'on going',
    Done = 'done'
}

interface Engineering {
    id: number;
    productId: number;
    partName: string;
    drawingNumber: string;
    category: string;
    remark: string;
    status3D: Status3D 
    status2D: Status2D 
    statusDXF: StatusDXF
    pic3D: string,
    pic2DDXF: string,
    startDate: string,
    dateRequired: string,
    price: string,
    quantity: string,
    totalPrice: string,
    picture: string
}

interface EngineeringState {
    engineeringDetail: Engineering | null;
    loading: boolean;
    error: string | null;
}

const initialState: EngineeringState = {
    engineeringDetail: null,
    loading: false,
    error: null,
};

const engineeringDetailSlice = createSlice({
    name: 'engineeringDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchEngineeringDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEngineeringDetail.fulfilled, (state, action) => {
                state.engineeringDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchEngineeringDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch production detail';
            })
    },
});

export default engineeringDetailSlice.reducer;
