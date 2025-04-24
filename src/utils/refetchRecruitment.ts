/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredRecruitment, fetchAllRecruitments, fetchSummaryRecruitment } from "@/store/slice/recruitment/getAllSlice";

export const refetchRecruitments = (dispatch: any, search: any, page = 1) => {
    dispatch(fetchSummaryRecruitment());
    dispatch(fetchAllRecruitments());
    dispatch(fetchFilteredRecruitment({
        name: search,
        page
    }));
};