import projectTargetGetAllReducer from "@/store/slice/projectTarget/getAllSlice";
import projectTargetCreateReducer from "@/store/slice/projectTarget/createSlice";
import projectTargetDetailReducer from "@/store/slice/projectTarget/getDetailSlice";
import projectTargetUpdateReducer from "@/store/slice/projectTarget/updateSlice";

export const projectTargetReducer = {
    projectTargetLists: projectTargetGetAllReducer,
    createProjectTarget: projectTargetCreateReducer,
    projectTargetDetail: projectTargetDetailReducer,
    updateProjectTarget: projectTargetUpdateReducer
};