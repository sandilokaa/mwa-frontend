import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecruitmentDetail = createAsyncThunk(
    'recruitments/fetchRecruitmentDetail',
    async ({ id }: { id: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/recruitments/${id}`,
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
    submissionDate: string,
    joinDate: string,
    progress: Progress, 
    statusRec: StatusRec 
}

interface RecruitmentState {
    recruitmentDetail: Recruitment | null;
    loading: boolean;
    error: string | null;
}

const initialState: RecruitmentState = {
    recruitmentDetail: null,
    loading: false,
    error: null,
};

const recruitmentDetailSlice = createSlice({
    name: 'recruitmentDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRecruitmentDetail.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecruitmentDetail.fulfilled, (state, action) => {
                state.recruitmentDetail = action.payload;
                state.loading = false;
            })
            .addCase(fetchRecruitmentDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch procurement detail';
            })
    },
});

export default recruitmentDetailSlice.reducer;
