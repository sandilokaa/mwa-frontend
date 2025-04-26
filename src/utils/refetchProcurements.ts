/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredProcurement, fetchAllProcurements, fetchSummaryProcurement } from "@/store/slice/procurement/getAllSlice";
import { removeNotification } from "@/store/slice/procurement/getNotificationSlice";

export const refetchProcurements = (dispatch: any, productId: any, search: any, targetId: any, page = 1) => {
    dispatch(fetchSummaryProcurement({ productId }));
    dispatch(fetchAllProcurements({ productId }));
    dispatch(fetchFilteredProcurement({
        productId,
        prNumber: search,
        page
    }));
    dispatch(removeNotification(targetId));
};