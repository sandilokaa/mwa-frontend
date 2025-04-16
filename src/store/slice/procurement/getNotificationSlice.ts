import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotificationList = createAsyncThunk(
    'notifications/fetchNotificationList',
    async ({  productId }: { productId: number }) => {
        const response = await axios.get(
            `http://localhost:8080/api/v1/procurements/notification/timeline?&productId=${productId}`,
            { withCredentials: true }
        );
        return response.data.data.procurement;
    }
);
interface NotificationState {
    notifications: { id: number, productId: number, prNumber: string, etaTarget: Date }[];
    loadingNotif: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    loadingNotif: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notificationLists',
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
