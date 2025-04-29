import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/axios';

export const fetchNotificationList = createAsyncThunk(
    'notifications/fetchNotificationList',
    async ({  productId, page }: { productId: number, page: number }) => {
        const response = await api.get(`/api/v1/highlight-issues/notification/timeline?&productId=${productId}&page=${page}`);
        return response.data.data.highlightIssue;
    }
);
interface Notification {
    id: number;
    itemName: string;
    dueDate: string;
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
    name: 'notificationIssueLists',
    initialState,
    reducers: {
        removeNotification: (state, action: PayloadAction<number>) => {
            state.notifications.data = state.notifications.data.filter((notif) => notif.id !== action.payload);
            state.notifications.total -= 1;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchNotificationList.pending, state => {
                state.loadingNotif = true;
                state.error = null;
            })
            .addCase(fetchNotificationList.fulfilled, (state, action) => {
                state.notifications.data = action.payload.data;
                state.notifications.total = action.payload.total;
                state.notifications.currentPage = action.payload.currentPage;
                state.notifications.totalPages = action.payload.totalPages;
                state.loadingNotif = false;
            })
            .addCase(fetchNotificationList.rejected, (state, action) => {
                state.loadingNotif = false;
                state.error = action.error.message || 'Failed to fetch notification';
            })
    },
});

export const { removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
