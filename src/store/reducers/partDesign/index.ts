import partDesignCreateReducer from "@/store/slice/partDesign/createSlice";
import partDesignGetAllReducer from "@/store/slice/partDesign/getAllSlice";

export const partDesignReducer = {
    createPartDesign: partDesignCreateReducer,
    partDesignLists: partDesignGetAllReducer
};