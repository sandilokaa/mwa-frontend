/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredRecruitment, fetchAllRecruitments } from "@/store/slice/recruitment/getAllSlice";

export const refetchRecruitments = (dispatch: any, search: any, page = 1) => {
    dispatch(fetchAllRecruitments());
    dispatch(fetchFilteredRecruitment({
        name: search,
        page
    }));
};