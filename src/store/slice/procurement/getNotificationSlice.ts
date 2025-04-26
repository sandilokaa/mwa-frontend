import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotificationList = createAsyncThunk(
    'notifications/fetchNotificationList',
    async ({  productId, page }: { productId: number, page: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/notification/timeline?&productId=${productId}&page=${page}`,
            { withCredentials: true }
        );
        return response.data.data.procurement;
    }
);
interface Notification {
    id: number;
    prNumber: string;
    etaTarget: string;
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
    name: 'notificationProcLists',
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
