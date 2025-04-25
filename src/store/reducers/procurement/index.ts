import procGetAllReducer from "@/store/slice/procurement/getAllSlice";
import procNotifReducer from "@/store/slice/procurement/getNotificationSlice";
import procDetailReducer from "@/store/slice/procurement/getDetailSlice";
import procDeleteReducer from "@/store/slice/procurement/deleteSlice";
import procCreateReducer from "@/store/slice/procurement/createSlice";
import procUpdateReducer from "@/store/slice/procurement/updateSlice";
import procUpdateProgressReducer from "@/store/slice/procurement/progressUpdateSlice";

export const procurmentReducers = {
    procurementLists: procGetAllReducer,
    notificationProcLists: procNotifReducer,
    procurementDetail: procDetailReducer,
    deleteProcurement: procDeleteReducer,
    createProcurement: procCreateReducer,
    updateProcurement: procUpdateReducer,
    updateProgress: procUpdateProgressReducer,
};