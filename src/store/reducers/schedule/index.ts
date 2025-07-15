import scheduleCreateReducer from "@/store/slice/schedule/createSlice";
import scheduleGetAllReducer from "@/store/slice/schedule/getAllSlice";
import scheduleUpdateReducer from "@/store/slice/schedule/updateSlice";
import scheduleDeleteReducer from "@/store/slice/schedule/deleteSlice";
import scheduleDetailReducer from "@/store/slice/schedule/getDetailSlice";


export const scheduleReducer = {
    createSchedule: scheduleCreateReducer,
    scheduleLists: scheduleGetAllReducer,
    updateScheduleSlice: scheduleUpdateReducer,
    deleteSchedule: scheduleDeleteReducer,
    scheduleDetail: scheduleDetailReducer
};