import partDesignCreateReducer from "@/store/slice/partDesign/createSlice";
import partDesignGetAllReducer from "@/store/slice/partDesign/getAllSlice";
import partDesignDetailReducer from "@/store/slice/partDesign/getDetailSlice";
import partDesignUpdateReducer from "@/store/slice/partDesign/updateSlice";
import partDesignDeleteReducer from "@/store/slice/partDesign/deleteSlice";

export const partDesignReducer = {
    createPartDesign: partDesignCreateReducer,
    partDesignLists: partDesignGetAllReducer,
    partDesignDetail: partDesignDetailReducer,
    updatePartDesign: partDesignUpdateReducer,
    deletePartDesign: partDesignDeleteReducer
};