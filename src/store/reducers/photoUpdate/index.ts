import photoUpdateGetAllReducer from "@/store/slice/photoUpdate/getAllSlice";
import photoUpdateCreateReducer from "@/store/slice/photoUpdate/createSlice";
import photoUpdateDeleteReducer from "@/store/slice/photoUpdate/deleteSlice";
import photoUpdateDetailReducer from "@/store/slice/photoUpdate/getDetailSlice";


export const photoUpdateReducers = {
    photoUpdateLists: photoUpdateGetAllReducer,
    createPhotoUpdate: photoUpdateCreateReducer,
    deletePhotoUpdate: photoUpdateDeleteReducer,
    photoUpdateDetail: photoUpdateDetailReducer
};