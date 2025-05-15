import engineGetAllReducer from "@/store/slice/engineering/getAllSlice";
import engineDeleteReducer from "@/store/slice/engineering/deleteSlice";
import engineDetailReducer from "@/store/slice/engineering/getDetailSlice";
import engineCreateReducer from "@/store/slice/engineering/createSlice";
import engineUpdateReducer from "@/store/slice/engineering/updateSlice";
import engineStatusUpdateReducer from "@/store/slice/engineering/statusUpdateSlice";

export const engineeringReducer = {
    engineeringLists: engineGetAllReducer,
    deleteEngineering: engineDeleteReducer,
    engineeringDetail: engineDetailReducer,
    createEngineering: engineCreateReducer,
    updateEngineering: engineUpdateReducer,
    updateStatus: engineStatusUpdateReducer
};