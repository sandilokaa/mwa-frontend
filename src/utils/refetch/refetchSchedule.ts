/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredSchedule } from "@/store/slice/schedule/getAllSlice";

export const refetchSchedule = (dispatch: any, productId: any) => {
    dispatch(fetchFilteredSchedule({
        productId,
    }));
};