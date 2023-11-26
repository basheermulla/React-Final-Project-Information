import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_CUSTOMERS,
    UPDATE_CUSTOMERS
} from '../constants/customerConstants';

const initialState = {
    customers: []
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CUSTOMERS:
            console.log('LOAD_CUSTOMERS = ', action.payload);
            return { ...state, customers: action.payload };
        case UPDATE_CUSTOMERS:
            console.log('UPDATE_CUSTOMERS = ', action.payload);
            const edit_customers = state.customers.map((customer) => {
                return customer.id === action.payload.id ? action.payload : customer
            });
            console.log(edit_customers);
            return { ...state, customers: edit_customers };
        default:
            return state;
    }
}

export default customerReducer;