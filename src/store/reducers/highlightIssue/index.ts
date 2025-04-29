import issueNotifReducer from "@/store/slice/highlightIssue/getNotificationSlice";
import issueGetAllReducer from "@/store/slice/highlightIssue/getAllSlice"; 
import issueCreateReducer from "@/store/slice/highlightIssue/createSlice";
import issueDetailReducer from "@/store/slice/highlightIssue/getDetailSlice";
import issueUpdateReducer from "@/store/slice/highlightIssue/updateSlice";
import issueDeleteReducer from "@/store/slice/highlightIssue/deleteSlice";
import issueUpdateStatusReducer from "@/store/slice/highlightIssue/statusUpdateSlice";

export const issueReducer = {
    notificationIssueLists: issueNotifReducer,
    issueLists: issueGetAllReducer,
    createIssue: issueCreateReducer,
    issueDetail: issueDetailReducer,
    updateIssueSlice: issueUpdateReducer,
    deleteIssue: issueDeleteReducer,
    updateStatus: issueUpdateStatusReducer
}