/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredProduction, fetchSummaryProductionStatus } from "@/store/slice/production/getAllSlice";

export const refetchProductions = (dispatch: any, productId: any, search: any, category: any, page = 1) => {
    dispatch(fetchSummaryProductionStatus({ productId, category}))
    dispatch(fetchFilteredProduction({
        productId,
        partName: search,
        category,
        page
    }));
};