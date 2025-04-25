import photoUpdateGetAllReducer from "@/store/slice/photoUpdate/getAllSlice";
import photoUpdateCreateReducer from "@/store/slice/photoUpdate/createSlice";
import photoUpdateDeleteReducer from "@/store/slice/photoUpdate/deleteSlice";


export const photoUpdateReducers = {
    photoUpdateLists: photoUpdateGetAllReducer,
    createPhotoUpdate: photoUpdateCreateReducer,
    deletePhotoUpdate: photoUpdateDeleteReducer
};