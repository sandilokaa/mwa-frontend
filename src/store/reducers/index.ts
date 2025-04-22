import { combineReducers } from "@reduxjs/toolkit";
import { authReducers } from "./auth";
import { productReducers } from "./product";
import { photoUpdateReducers } from "./photoUpdate";
import { recruitmentReducers } from "./recruitment";
import { procurmentReducers } from "./procurement";

export const rootReducer = combineReducers({
    ...authReducers,
    ...productReducers,
    ...photoUpdateReducers,
    ...procurmentReducers,
    ...recruitmentReducers
});