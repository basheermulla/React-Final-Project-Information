import {
    LOAD_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT
} from '../constants/productConstants';

export const getAllProducts = (products) => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
}

export const updateProduct = (product) => (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT, payload: product });
}

export const deleteProduct = (productID) => (dispatch) => {
    dispatch({ type: DELETE_PRODUCT, payload: productID });
}