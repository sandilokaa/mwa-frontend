/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredRecruitment, fetchAllRecruitments, fetchSummaryRecruitment } from "@/store/slice/recruitment/getAllSlice";
import { removeNotification } from "@/store/slice/recruitment/getNotificationSlice";

export const refetchRecruitments = (dispatch: any, search: any, targetId: any, page = 1) => {
    dispatch(fetchSummaryRecruitment());
    dispatch(fetchAllRecruitments());
    dispatch(fetchFilteredRecruitment({
        name: search,
        page
    }));
    dispatch(removeNotification(targetId));
};