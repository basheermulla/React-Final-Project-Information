import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    ADD_PRODUCT,
    UPDATE_PRODUCT_QUANTITY
} from '../constants/productConstants';

const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PRODUCTS:
            console.log('LOAD_PRODUCTS = ', action.payload);
            return { ...state, products: action.payload };
        case ADD_PRODUCT:
            console.log('ADD_PRODUCT = ', action.payload);
            return { ...state, products: [...state.products, { id: uuidv4(), ...action.payload }] };
        case UPDATE_PRODUCT:
            console.log('UPDATE_PRODUCT = ', action.payload);
            const edit_products = state.products.map((product) => {
                return product.id === action.payload.id ? action.payload : product
            });
            console.log(edit_products);
            return { ...state, products: edit_products };
        case UPDATE_PRODUCT_QUANTITY:
            console.log('UPDATE_PRODUCT_QUANTITY = ', action.payload);
            const update_quantity = state.products.find((product) => product.id === action.payload.id);
            const product_with_new_quantity = { ...update_quantity, quantity: action.payload.quantity }  
            const update_products = state.products.map((product) => {
                return product.id === action.payload.id ? product_with_new_quantity : product
            });
            return { ...state, products: update_products };
        case DELETE_PRODUCT:
            console.log('DELETE_PRODUCT = ', action.payload);
            const afterDelete_products = state.products.filter((product) => product.id !== action.payload);
            return { ...state, products: afterDelete_products };
        default:
            return state;
    }
}

export default productReducer;