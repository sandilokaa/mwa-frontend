import recGetAllReducer from "../../slice/recruitment/getAllSlice";
import recDeleteReducer from "../../slice/recruitment/deleteSlice";
import recDetailReducer from "../../slice/recruitment/getDetailSlice";
import recCreateReducer from "../../slice/recruitment/createSlice";
import recNotificationReducer from "../../slice/recruitment/getNotificationSlice";
import recUpdateReducer from "../../slice/recruitment/updateSlice";


export const recruitmentReducers = {
    recruitmentList: recGetAllReducer,
    deleteRecruitment: recDeleteReducer,
    recruitmentDetail: recDetailReducer,
    createRecruitment: recCreateReducer,
    notificationRecLists: recNotificationReducer,
    updateRecruitment: recUpdateReducer
};