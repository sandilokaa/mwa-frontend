import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredEngineering = createAsyncThunk(
    'engineerings/fetchFilteredEngineering',
    async ({  productId, partName, page, category }: { productId: number, partName: string, page: number, category: string }) => {
        const response = await api.get(`/api/v1/engineerings/search?&productId=${productId}&partName=${partName}&page=${page}&category=${category}`);
        return response.data.data.engineering;
    }
);

export const fetchSummaryEngineeringStatus = createAsyncThunk(
    'engineerings/fetchSummaryEngineeringStatus',
    async ({ productId, category }: { productId: number, category: string }) => {
        const response = await api.get(
            `/api/v1/engineerings/summary/status/stat?&productId=${productId}&category=${category}`);
        return response.data.data.engineering;
    }
);

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

interface StatusSummaryItem {
    status3D?: string;
    status2D?: string;
    statusDXF?: string;
    count: number;
}

interface EngineeringStatusSummary {
    status3D: StatusSummaryItem[];
    status2D: StatusSummaryItem[];
    statusDXF: StatusSummaryItem[];
}

interface Engineering {
    id: number, 
    productId: number, 
    partName: string;
    drawingNumber: string;
    remark: string;
    status3D: Status3D 
    status2D: Status2D 
    statusDXF: StatusDXF 
}

interface PaginatedEngineeringData {
    engineeringDataFiltered: Engineering[];
    totalEngine: number;
    currentPagesEngine: number;
    totalPagesEngine: number;
}

interface EngineeringState {
    filteredEngineerings: PaginatedEngineeringData;
    summaryEngineering: EngineeringStatusSummary;
    loading: boolean;
    error: string | null;
}

const initialState: EngineeringState = {
    filteredEngineerings: {
        engineeringDataFiltered: [],
        totalEngine: 0,
        currentPagesEngine: 1,
        totalPagesEngine: 1,
    },
    summaryEngineering: {
        status3D: [],
        status2D: [],
        statusDXF: [],
    },
    loading: false,
    error: null,
};

const engineeringSlice = createSlice({
    name: 'engineeringLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredEngineering.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredEngineering.fulfilled, (state, action) => {
                state.filteredEngineerings = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredEngineering.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch engineerings';
            })
            .addCase(fetchSummaryEngineeringStatus.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryEngineeringStatus.fulfilled, (state, action) => {
                state.summaryEngineering = action.payload;
                state.loading = false;
            })
            .addCase(fetchSummaryEngineeringStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch engineerings';
            })
    },
});

export default engineeringSlice.reducer;