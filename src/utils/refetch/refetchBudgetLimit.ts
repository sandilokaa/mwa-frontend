/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredBudgetLimit } from "@/store/slice/budgetStatus/limit/getAllSlice";

export const refetchBudgetLimit = (dispatch: any, productId: any, search: any, month: any, year: any, page = 1, ) => {
    dispatch(fetchFilteredBudgetLimit({
        productId,
        system: search,
        month,
        year,
        page,
    }));
};