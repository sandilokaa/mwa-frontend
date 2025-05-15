/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredEngineering, fetchSummaryEngineeringStatus } from "@/store/slice/engineering/getAllSlice";

export const refetchEngineerings = (dispatch: any, productId: any, search: any, category: any, page = 1) => {
    dispatch(fetchSummaryEngineeringStatus({ productId, category }))
    dispatch(fetchFilteredEngineering({
        productId,
        partName: search,
        category,
        page
    }));
};