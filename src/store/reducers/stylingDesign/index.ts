import stylingDesignGetAllReducer from "@/store/slice/stylingDesign/getAllSlice";
import stylingDesignCreateReducer from "@/store/slice/stylingDesign/createSlice";
import stylingDesignDetailReducer from "@/store/slice/stylingDesign/getDetailSlice";

export const stylingDesignReducer = {
    stylingDesignLists: stylingDesignGetAllReducer,
    createStylingDesign: stylingDesignCreateReducer,
    stylingDesignDetail: stylingDesignDetailReducer,
};