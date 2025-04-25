import recGetAllReducer from "@/store/slice/recruitment/getAllSlice";
import recDeleteReducer from "@/store/slice/recruitment/deleteSlice";
import recDetailReducer from "@/store/slice/recruitment/getDetailSlice";
import recCreateReducer from "@/store/slice/recruitment/createSlice";
import recNotificationReducer from "@/store/slice/recruitment/getNotificationSlice";
import recUpdateReducer from "@/store/slice/recruitment/updateSlice";
import recUpdateProgress from "@/store/slice/recruitment/progressUpdateSlice";


export const recruitmentReducers = {
    recruitmentList: recGetAllReducer,
    deleteRecruitment: recDeleteReducer,
    recruitmentDetail: recDetailReducer,
    createRecruitment: recCreateReducer,
    notificationRecLists: recNotificationReducer,
    updateRecruitment: recUpdateReducer,
    updateProgress: recUpdateProgress
};