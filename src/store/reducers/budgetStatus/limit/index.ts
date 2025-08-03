import budgetLimitGetAllReducer from "@/store/slice/budgetStatus/limit/getAllSlice";
import budgetLimitCreateReducer from "@/store/slice/budgetStatus/limit/createSlice";
import budgetLimitDeleteReducer from "@/store/slice/budgetStatus/limit/deleteSlice";
import budgetLimitDetailReducer from "@/store/slice/budgetStatus/limit/getDetailSlice";
import budgetLimitUpdateReducer from "@/store/slice/budgetStatus/limit/updateSlice";

export const budgetLimitReducer = {
    budgetLimitList: budgetLimitGetAllReducer,
    createBudgetLimit: budgetLimitCreateReducer,
    deleteBudgetLimit: budgetLimitDeleteReducer,
    budgetLimitDetail: budgetLimitDetailReducer,
    updatedBudgetLimitSlice: budgetLimitUpdateReducer
};