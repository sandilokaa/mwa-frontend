import { combineReducers } from "@reduxjs/toolkit";
import { authReducers } from "./auth";
import { productReducers } from "./product";
import { photoUpdateReducers } from "./photoUpdate";
import { recruitmentReducers } from "./recruitment";
import { procurmentReducers } from "./procurement";
import { issueReducer } from "./highlightIssue";
import { productionReducer } from "./production";
import { engineeringReducer } from "./engineering";
import { stylingDesignReducer } from "./stylingDesign";
import { partDesignReducer } from "./partDesign";
import { projectTargetReducer } from "./projectTarget";
import { scheduleReducer } from "./schedule";
import { budgetLimitReducer } from "./budgetStatus/limit";

export const rootReducer = combineReducers({
    ...authReducers,
    ...productReducers,
    ...photoUpdateReducers,
    ...procurmentReducers,
    ...recruitmentReducers,
    ...issueReducer,
    ...productionReducer,
    ...engineeringReducer,
    ...stylingDesignReducer,
    ...partDesignReducer,
    ...projectTargetReducer,
    ...scheduleReducer,
    ...budgetLimitReducer
});