import productGetAllReducer from "@/store/slice/product/getAllSlice";
import productCreateReducer from "@/store/slice/product/createSlice";
import productDeleteReducer from "@/store/slice/product/deleteSlice";
import productDetailReducer from "@/store/slice/product/getDetailSlice";
import productUpdateReducer from "@/store/slice/product/updateSlice";


export const productReducers = {
    productList: productGetAllReducer,
    createProduct: productCreateReducer,
    deleteProduct: productDeleteReducer,
    productDetail: productDetailReducer,
    updateProduct: productUpdateReducer
};