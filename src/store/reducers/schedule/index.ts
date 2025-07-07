import scheduleCreateReducer from "@/store/slice/schedule/createSlice";
import scheduleGetAllReducer from "@/store/slice/schedule/getAllSlice";


export const scheduleReducer = {
    createSchedule: scheduleCreateReducer,
    scheduleLists: scheduleGetAllReducer
};