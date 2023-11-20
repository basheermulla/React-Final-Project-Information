import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_PRODUCTS
} from '../constants/productConstants';

const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PRODUCTS:
            console.log('LOAD_PRODUCTS');
            return { ...state, products: action.payload };
        default:
            return state;
    }
}

export default productReducer;