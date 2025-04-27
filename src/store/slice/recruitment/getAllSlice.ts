import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchFilteredRecruitment = createAsyncThunk(
    'recruitments/fetchFilteredRecruitment',
    async ({  name, page }: { name: string, page: number }) => {
        const response = await api.get(`/api/v1/recruitments/search?&name=${name}&page=${page}`);
        return response.data.data.recruitment;
    }
);

export const fetchAllRecruitments = createAsyncThunk(
    'recruitments/fetchAllRecruitments',
    async () => {
        const response = await api.get(`/api/v1/recruitments/metrics/total`);
        return response.data.data.recruitment;
    }
);

export const fetchSummaryRecruitment = createAsyncThunk(
    'recruitments/fetchSummaryRecruitment',
    async () => {
        const response = await api.get(`/api/v1/recruitments/summary/stat`);
        return response.data.data.recruitment;
    }
);

export enum Progress {
    InterviewHR = 'interview hr',
    InterviewUser = 'interview user',
    InterviewComben = 'interview comben',
    OfferLetter = 'offer letter'
}

export enum StatusRec {
    Overdue = 'overdue',
    OnProgress = 'on progress',
    Done = 'done'
}

interface Recruitment {
    id: number, 
    name:string,
    position: string,
    division: string, 
    joinDate: Date,
    progress: Progress, 
    statusRec: StatusRec 
}

interface PaginatedRecruitmentData {
    recruitmentDataFiltered: Recruitment[];
    totalRec: number;
    currentPagesRec: number;
    totalPagesRec: number;
}

interface RecruitmentSummary {
    progress: string;
    division: { [divisionName: string]: number }[];
    count: number;
}

interface RecruitmentState {
    filteredRecruitments: PaginatedRecruitmentData;
    allRecruitments: [];
    summaryRecruitments: RecruitmentSummary[],
    loading: boolean;
    error: string | null;
}

const initialState: RecruitmentState = {
    filteredRecruitments: {
        recruitmentDataFiltered: [],
        totalRec: 0,
        currentPagesRec: 1,
        totalPagesRec: 1,
    },
    allRecruitments: [],
    summaryRecruitments: [],
    loading: false,
    error: null,
};

const recruitmentSlice = createSlice({
    name: 'recruitmentLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFilteredRecruitment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredRecruitment.fulfilled, (state, action) => {
                state.filteredRecruitments = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilteredRecruitment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch recruitment';
            })
            .addCase(fetchAllRecruitments.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRecruitments.fulfilled, (state, action) => {
                state.allRecruitments = action.payload;
            })
            .addCase(fetchAllRecruitments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch recruitment';
            })
            .addCase(fetchSummaryRecruitment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryRecruitment.fulfilled, (state, action) => {
                state.summaryRecruitments = action.payload;
            })
            .addCase(fetchSummaryRecruitment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch summary procurement';
            })
    },
});

export default recruitmentSlice.reducer;
