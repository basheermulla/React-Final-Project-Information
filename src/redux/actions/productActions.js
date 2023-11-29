import {
    LOAD_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    ADD_PRODUCT,
    UPDATE_PRODUCT_QUANTITY
} from '../constants/productConstants';

export const loadAllProducts = (products) => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
}

export const updateProduct = (product) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT, payload: product });
}

export const deleteProduct = (productID) => (dispatch) => {
    dispatch({ type: DELETE_PRODUCT, payload: productID });
}

export const addProduct = (product) => (dispatch) => {
    dispatch({ type: ADD_PRODUCT, payload: product });
}

export const updateProductQuantity = (newProductQuantity) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_QUANTITY, payload: newProductQuantity });
}