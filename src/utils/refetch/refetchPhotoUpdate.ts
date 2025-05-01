/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchPhotoUpdateLists } from "@/store/slice/photoUpdate/getAllSlice";

export const refetchPhotoUpdates = (dispatch: any, productId: any, category: any) => {
    dispatch(fetchPhotoUpdateLists({
        productId,
        category
    }));
};