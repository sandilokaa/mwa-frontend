import prodGetAllReducer from "@/store/slice/production/getAllSlice";
import prodGetDetailReducer from "@/store/slice/production/getDetailSlice";
import prodCreateReducer from "@/store/slice/production/createSlice";
import prodUpdateReducer from "@/store/slice/production/updateSlice";
import prodStatusUpdateReducer from "@/store/slice/production/statusUpdateSlice";

export const productionReducer = {
    productionLists: prodGetAllReducer,
    productionDetail: prodGetDetailReducer,
    createProduction: prodCreateReducer,
    updateProduction: prodUpdateReducer,
    updateStatus: prodStatusUpdateReducer
};