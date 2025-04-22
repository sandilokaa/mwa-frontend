import procGetAllReducer from "../../slice/procurement/getAllSlice";
import procNotifReducer from "../../slice/procurement/getNotificationSlice";
import procDetailReducer from "../../slice/procurement/getDetailSlice";
import procDeleteReducer from "../../slice/procurement/deleteSlice";
import procCreateReducer from "../../slice/procurement/createSlice";
import procUpdateReducer from "../../slice/procurement/updateSlice";
import procUpdateProgressReducer from "../../slice/procurement/progressUpdateSlice";

export const procurmentReducers = {
    procurementLists: procGetAllReducer,
    notificationProcLists: procNotifReducer,
    procurementDetail: procDetailReducer,
    deleteProcurement: procDeleteReducer,
    createProcurement: procCreateReducer,
    updateProcurement: procUpdateReducer,
    updateProgress: procUpdateProgressReducer,
};