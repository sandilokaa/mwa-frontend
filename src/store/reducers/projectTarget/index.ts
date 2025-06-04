import projectTargetGetAllReducer from "@/store/slice/projectTarget/getAllSlice";
import projectTargetCreateReducer from "@/store/slice/projectTarget/createSlice";

export const projectTargetReducer = {
    projectTargetLists: projectTargetGetAllReducer,
    createProjectTarget: projectTargetCreateReducer
};