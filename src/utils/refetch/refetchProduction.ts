/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredProduction } from "@/store/slice/production/getAllSlice";

export const refetchProductions = (dispatch: any, productId: any, search: any, page = 1) => {
    dispatch(fetchFilteredProduction({
        productId,
        partNumber: search,
        page
    }));
};