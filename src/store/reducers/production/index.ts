import prodGetAllReducer from "@/store/slice/production/getAllSlice";
import prodGetDetailReducer from "@/store/slice/production/getDetailSlice";
import prodCreateReducer from "@/store/slice/production/createSlice";
import prodDeleteReducer from "@/store/slice/production/deleteSlice";

export const productionReducer = {
    productionLists: prodGetAllReducer,
    productionDetail: prodGetDetailReducer,
    createProduction: prodCreateReducer,
    deleteProduction: prodDeleteReducer,
};