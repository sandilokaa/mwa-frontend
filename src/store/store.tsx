import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import authReducer from "./slice/auth/authSlice";

import productGetAllReducer from "./slice/product/getAllSlice";

import photoUpdateGetAllReducer from "./slice/photoUpdate/getAllSlice";

import procGetAllReducer from "./slice/procurement/getAllSlice";
import procNotifReducer from "./slice/procurement/getNotificationSlice";
import procDetailReducer from "./slice/procurement/getDetailSlice";
import procDeleteReducer from "./slice/procurement/deleteSlice";
import procCreateReducer from "./slice/procurement/createSlice";
import procUpdateReducer from "./slice/procurement/updateSlice";
import procUpdateProgressReducer from "./slice/procurement/progressUpdateSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
            productList: productGetAllReducer,
            photoUpdateLists: photoUpdateGetAllReducer,
            procurementLists: procGetAllReducer,
            notificationLists: procNotifReducer,
            procurementDetail: procDetailReducer,
            deleteProcurement: procDeleteReducer,
            createProcurement: procCreateReducer,
            updateProcurement: procUpdateReducer,
            updateProgress: procUpdateProgressReducer
        },
    });

export  const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore);