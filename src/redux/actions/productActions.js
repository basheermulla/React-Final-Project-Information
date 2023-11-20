import {
    LOAD_PRODUCTS
} from '../constants/productConstants';

export const getAll = (products) => (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
}