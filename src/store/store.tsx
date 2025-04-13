import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./slice/authSlice";
import productReducer from "./slice/productSlice";
import photoUpdateReducer from "./slice/photoUpdateSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
            products: productReducer,
            photoUpdates: photoUpdateReducer,
        },
    });

export  const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore);