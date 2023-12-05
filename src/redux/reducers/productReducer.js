import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_PRODUCTS_REQUEST,
    LOAD_PRODUCTS_SECCESS,
    LOAD_PRODUCTS_FAIL,

    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SECCESS,
    UPDATE_PRODUCT_FAIL,

    UPDATE_PRODUCT_QUANTITY_REQUEST,
    UPDATE_PRODUCT_QUANTITY_SECCESS,
    UPDATE_PRODUCT_QUANTITY_FAIL,

    ADD_PRODUCT_REQUEST,
    ADD_PRODUCT_SECCESS,
    ADD_PRODUCT_FAIL,

    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SECCESS,
    DELETE_PRODUCT_FAIL,

    SUBMIT_PRODUCT_FAIL
} from '../constants/productConstants';

const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {

        // ---------------- Load ----------------------
        case LOAD_PRODUCTS_REQUEST:
            console.log('LOAD_PRODUCTS_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case LOAD_PRODUCTS_SECCESS:
            console.log('LOAD_PRODUCTS_SECCESS = ', action.payload);
            return { ...state, loading: false, error: null, products: action.payload };
        case LOAD_PRODUCTS_FAIL:
            console.log('LOAD_PRODUCTS_FAIL = ', action.payload);
            let str_load = new String(action.payload);
            const messege_load = str_load.valueOf();
            return { ...state, loading: false, error: messege_load };

        // ---------------- Add ----------------------
        case ADD_PRODUCT_REQUEST:
            console.log('ADD_PRODUCT_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case ADD_PRODUCT_SECCESS:
            console.log('ADD_PRODUCT_SECCESS = ', action.payload);
            return { ...state, loading: false, error: null, products: [...state.products, action.payload] };
        case ADD_PRODUCT_FAIL:
            console.log('ADD_PRODUCT_FAIL = ', action.payload);
            let str_add = new String(action.payload);
            const messege_add = str_add.valueOf();
            return { ...state, loading: false, error: messege_add };

        // ---------------- Update ----------------------
        case UPDATE_PRODUCT_REQUEST:
            console.log('UPDATE_PRODUCT_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case UPDATE_PRODUCT_SECCESS:
            console.log('UPDATE_PRODUCT_SECCESS = ', action.payload);
            const update_products = state.products.map((product) => {
                return product.id === action.payload.id ? action.payload : product
            });
            console.log(update_products);
            return { ...state, loading: false, error: null, products: update_products };
        case UPDATE_PRODUCT_FAIL:
            console.log('UPDATE_PRODUCT_FAIL = ', action.payload);
            let str_update = new String(action.payload);
            const messege_update = str_update.valueOf();
            return { ...state, loading: false, error: messege_update };

        // ---------------- Update Quentity ----------------------
        case UPDATE_PRODUCT_QUANTITY_REQUEST:
            console.log('UPDATE_PRODUCT_QUANTITY_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case UPDATE_PRODUCT_QUANTITY_SECCESS:
            console.log('UPDATE_PRODUCT_QUANTITY_SECCESS = ', action.payload);
            const update_quantity = state.products.find((product) => product.id === action.payload.id);
            const product_with_new_quantity = { ...update_quantity, quantity: action.payload.quantity }
            const update_product_quentity = state.products.map((product) => {
                return product.id === action.payload.id ? product_with_new_quantity : product
            });
            return { ...state, loading: false, error: null, products: update_product_quentity };
        case UPDATE_PRODUCT_QUANTITY_FAIL:
            console.log('UPDATE_PRODUCT_QUANTITY_FAIL = ', action.payload);
            let str_update_quentity = new String(action.payload);
            const messege_update_quentity = str_update_quentity.valueOf();
            return { ...state, loading: false, error: messege_update_quentity };

        // ---------------- Delete ----------------------
        case DELETE_PRODUCT_REQUEST:
            console.log('DELETE_PRODUCT_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case DELETE_PRODUCT_SECCESS:
            console.log('DELETE_PRODUCT_SECCESS = ', action.payload);
            const afterDelete_products = state.products.filter((product) => product.id !== action.payload);
            return { ...state, loading: false, error: null, products: afterDelete_products };
        case DELETE_PRODUCT_FAIL:
            console.log('DELETE_PRODUCT_FAIL = ', action.payload);
            let str_delete = new String(action.payload);

            const messege_delete = str_delete.valueOf();
            console.log(messege_delete);
            return { ...state, loading: false, error: messege_delete };

        // ---------------- Submit product Fail  -----------
        case SUBMIT_PRODUCT_FAIL:
            console.log('SUBMIT_PRODUCT_FAIL = ', action.payload);
            return { ...state, loading: false, error: null };

        default:
            return state;
    }
}

export default productReducer;