import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT
} from '../constants/productConstants';

const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PRODUCTS:
            console.log('LOAD_PRODUCTS = ', action.payload);
            return { ...state, products: action.payload };
        case UPDATE_PRODUCT:
            console.log('UPDATE_PRODUCT = ', action.payload);
            const edit_products = state.products.map((product) => {
                return product.id === action.payload.id ? action.payload : product
            });
            console.log(edit_products);
            return { ...state, products: edit_products };
        case DELETE_PRODUCT:
            console.log('DELETE_PRODUCT = ', action.payload);
            const afterDelete_products = state.products.filter((product) => product.id !== action.payload);
            return { ...state, products: afterDelete_products };
        default:
            return state;
    }
}

export default productReducer;