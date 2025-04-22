import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFilteredRecruitment = createAsyncThunk(
    'recruitments/fetchFilteredRecruitment',
    async ({  name, page }: { name: string, page: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/recruitments/search?&name=${name}&page=${page}`,
            { withCredentials: true }
        );
        return response.data.data.recruitment;
    }
);

export const fetchAllRecruitments = createAsyncThunk(
    'recruitments/fetchAllRecruitments',
    async () => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/recruitments/metrics/total`,
            { withCredentials: true }
        );
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

interface RecruitmentState {
    filteredRecruitments: PaginatedRecruitmentData;
    allRecruitments: [];
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
    },
});

export default recruitmentSlice.reducer;
