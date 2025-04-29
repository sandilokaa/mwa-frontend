/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredIssue, fetchIssueMetrics, fetchSummaryIssue } from "@/store/slice/highlightIssue/getAllSlice";
import { removeNotification } from "@/store/slice/highlightIssue/getNotificationSlice";

export const refetchHighlightIssues = (dispatch: any, productId: any, search: any, targetId: any, page = 1) => {
    dispatch(fetchSummaryIssue({ productId }))
    dispatch(fetchIssueMetrics({ productId }));
    dispatch(fetchFilteredIssue({
        productId,
        itemName: search,
        page
    }));
    dispatch(removeNotification(targetId));
};