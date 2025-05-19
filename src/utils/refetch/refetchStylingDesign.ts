/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFilteredStylingDesign } from "@/store/slice/stylingDesign/getAllSlice";
import { fetchPartDesignLists } from "@/store/slice/partDesign/getAllSlice";

export const refetchStylingDesign = (dispatch: any, productId: any, category: any) => {
    dispatch(fetchPartDesignLists({ productId, category }))
    dispatch(fetchFilteredStylingDesign({productId}));
};