/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchSummaryProcurement } from "@/store/slice/procurement/getAllSlice";
import { fetchAllProcurements } from "@/store/slice/procurement/getAllSlice";
import { fetchFilteredProcurement } from "@/store/slice/procurement/getAllSlice";

export const refetchProcurements = (dispatch: any, productId: any, search: any, page = 1) => {
    dispatch(fetchSummaryProcurement({ productId }));
    dispatch(fetchAllProcurements({ productId }));
    dispatch(fetchFilteredProcurement({
        productId,
        prNumber: search,
        page
    }));
};