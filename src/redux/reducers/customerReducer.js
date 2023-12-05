import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_CUSTOMERS_REQUEST,
    LOAD_CUSTOMERS_SECCESS,
    LOAD_CUSTOMERS_FAIL,

    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_SECCESS,
    ADD_CUSTOMER_FAIL,

    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_SECCESS,
    UPDATE_CUSTOMER_FAIL,

    DELETE_CUSTOMER_REQUEST,
    DELETE_CUSTOMER_SECCESS,
    DELETE_CUSTOMER_FAIL,

    SUBMIT_CUSTOMER_FAIL
} from '../constants/customerConstants';

const initialState = {
    customers: []
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {

        // ---------------- Load ----------------------
        case LOAD_CUSTOMERS_REQUEST:
            console.log('LOAD_CUSTOMERS_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case LOAD_CUSTOMERS_SECCESS:
            console.log('LOAD_CUSTOMERS_SECCESS = ', action.payload);
            return { ...state, loading: false, error: null, customers: action.payload };
        case LOAD_CUSTOMERS_FAIL:
            console.log('LOAD_CUSTOMERS_FAIL = ', action.payload);
            let str_load = new String(action.payload);
            const messege_load = str_load.valueOf();
            return { ...state, loading: false, error: messege_load };

        // ---------------- Add ----------------------
        case ADD_CUSTOMER_REQUEST:
            console.log('ADD_CUSTOMER_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case ADD_CUSTOMER_SECCESS:
            console.log('ADD_CUSTOMER_SECCESS = ', action.payload);
            return { ...state, loading: false, customers: [...state.customers, action.payload] };
        case ADD_CUSTOMER_FAIL:
            console.log('ADD_CUSTOMER_FAIL = ', action.payload);
            let str_add = new String(action.payload);
            const messege_add = str_add.valueOf();
            return { ...state, loading: false, error: messege_add };

        // ---------------- Update ---------------------- 
        case UPDATE_CUSTOMER_REQUEST:
            console.log('UPDATE_CUSTOMER_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case UPDATE_CUSTOMER_SECCESS:
            console.log('UPDATE_CUSTOMER_SECCESS = ', action.payload);
            const edit_customers = state.customers.map((customer) => {
                return customer.id === action.payload.id ? action.payload : customer
            });
            console.log(edit_customers);
            return { ...state, loading: false, customers: edit_customers };
        case UPDATE_CUSTOMER_FAIL:
            console.log('UPDATE_CUSTOMER_FAIL = ', action.payload);
            let str_update = new String(action.payload);
            const messege_update = str_update.valueOf();
            return { ...state, loading: false, error: messege_update };

        // ---------------- Delete ----------------------
        case DELETE_CUSTOMER_REQUEST:
            console.log('DELETE_CUSTOMER_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case DELETE_CUSTOMER_SECCESS:
            console.log('DELETE_CUSTOMER_SECCESS = ', action.payload);
            const afterDelete_customers = state.customers.filter((customer) => customer.id !== action.payload);
            return { ...state, loading: false, customers: afterDelete_customers };
        case DELETE_CUSTOMER_FAIL:
            console.log('DELETE_CUSTOMER_FAIL = ', action.payload);
            let str_delete = new String(action.payload);
            const messege_delete = str_delete.valueOf();
            console.log(messege_delete);
            return { ...state, loading: false, error: messege_delete };

        // ---------------- Submit customer Fail  -----------
        case SUBMIT_CUSTOMER_FAIL:
            console.log('SUBMIT_CUSTOMER_FAIL = ', action.payload);
            return { ...state, loading: false, error: null };

        default:
            return state;
    }
}

export default customerReducer;