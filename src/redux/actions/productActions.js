import {
    LOAD_PRODUCTS_REQUEST,
    LOAD_PRODUCTS_SECCESS,
    LOAD_PRODUCTS_FAIL,

    ADD_PRODUCT_REQUEST,
    ADD_PRODUCT_SECCESS,
    ADD_PRODUCT_FAIL,

    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SECCESS,
    UPDATE_PRODUCT_FAIL,

    UPDATE_PRODUCT_QUANTITY_REQUEST,
    UPDATE_PRODUCT_QUANTITY_SECCESS,
    UPDATE_PRODUCT_QUANTITY_FAIL,

    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SECCESS,
    DELETE_PRODUCT_FAIL,

    SUBMIT_PRODUCT_FAIL,
} from '../constants/productConstants';

//------------------ Get[load] All Products Actions --------------------------------

export const loadProductsRequest = () => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS_REQUEST });
}

export const loadProductsSuccess = (products) => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS_SECCESS, payload: products });
}

export const loadProductsFail = (message) => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS_FAIL, payload: message });
}

//------------------ Add Product Actions -------------------------------------------

export const addProductRequest = () => (dispatch) => {
    dispatch({ type: ADD_PRODUCT_REQUEST });
}

export const addProductSuccess = (product) => (dispatch) => {
    dispatch({ type: ADD_PRODUCT_SECCESS, payload: product });
}

export const addProductFail = (message) => (dispatch) => {
    dispatch({ type: ADD_PRODUCT_FAIL, payload: message });
}

//------------------ Update Product Actions ----------------------------------------

export const updateProductRequest = () => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
}

export const updateProductSuccess = (product) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_SECCESS, payload: product });
}

export const updateProductFail = (message) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_FAIL, payload: message });
}

//------------------ Update Product Quantity Actions --------------------------------

export const updateProductQuantityRequest = () => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_QUANTITY_REQUEST });
}

export const updateProductQuantitySuccess = (newProductQuantity) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_QUANTITY_SECCESS, payload: newProductQuantity });
}

export const updateProductQuantityFail = (message) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_QUANTITY_FAIL, payload: message });
}

//------------------ Delete Product Actions -----------------------------------------

export const deleteProductRequest = () => (dispatch) => {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
}

export const deleteProductSuccess = (productID) => (dispatch) => {
    dispatch({ type: DELETE_PRODUCT_SECCESS, payload: productID });
}

export const deleteProductFail = (message) => (dispatch) => {
    dispatch({ type: DELETE_PRODUCT_FAIL, payload: message });
}

//------------------ Submit Edit Product Action Error ------------------------------

export const submitProductFail = () => (dispatch) => {
    dispatch({ type: SUBMIT_PRODUCT_FAIL });
}