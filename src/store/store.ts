import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { rootReducer } from "./reducers";

const makeStore = () =>
    configureStore({
        reducer: rootReducer,
    });

export  const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore);