import prodGetAllReducer from "@/store/slice/production/getAllSlice";
import prodGetDetailReducer from "@/store/slice/production/getDetailSlice";
import prodCreateReducer from "@/store/slice/production/createSlice";
import prodDeleteReducer from "@/store/slice/production/deleteSlice";
import prodUpdateReducer from "@/store/slice/production/updateSlice";
import prodStatusUpdateReducer from "@/store/slice/production/statusUpdateSlice";

export const productionReducer = {
    productionLists: prodGetAllReducer,
    productionDetail: prodGetDetailReducer,
    createProduction: prodCreateReducer,
    deleteProduction: prodDeleteReducer,
    updateProduction: prodUpdateReducer,
    updateStatus: prodStatusUpdateReducer
};