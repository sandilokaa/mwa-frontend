import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotificationList = createAsyncThunk(
    'notifications/fetchNotificationList',
    async ({  page }: { page: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/recruitments/notification/timeline?&page=${page}`,
            { withCredentials: true }
        );
        return response.data.data.recruitment;
    }
);
interface Notification {
    id: number;
    name: string;
    joinDate: string;
}
interface PaginatedNotificationData {
    data: Notification[];
    total: number;
    currentPage: number;
    totalPages: number;
}

interface NotificationState {
    notifications: PaginatedNotificationData;
    loadingNotif: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: {
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
    },
    loadingNotif: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notificationRecLists',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNotificationList.pending, state => {
                state.loadingNotif = true;
                state.error = null;
            })
            .addCase(fetchNotificationList.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.loadingNotif = false;
            })
            .addCase(fetchNotificationList.rejected, (state, action) => {
                state.loadingNotif = false;
                state.error = action.error.message || 'Failed to fetch notification';
            })
    },
});

export default notificationSlice.reducer;
