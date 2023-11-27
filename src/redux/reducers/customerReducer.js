import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_CUSTOMERS,
    UPDATE_CUSTOMER,
    DELETE_CUSTOMER,
    ADD_CUSTOMER
} from '../constants/customerConstants';

const initialState = {
    customers: []
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CUSTOMERS:
            console.log('LOAD_CUSTOMERS = ', action.payload);
            return { ...state, customers: action.payload };
        case ADD_CUSTOMER:
            console.log('ADD_CUSTOMER = ', action.payload);
            return { ...state, customers: [...state.customers, { id: uuidv4(), ...action.payload }] };
        case UPDATE_CUSTOMER:
            console.log('UPDATE_CUSTOMER = ', action.payload);
            const edit_customers = state.customers.map((customer) => {
                return customer.id === action.payload.id ? action.payload : customer
            });
            console.log(edit_customers);
            return { ...state, customers: edit_customers };
        case DELETE_CUSTOMER:
            console.log('DELETE_CUSTOMER = ', action.payload);
            const afterDelete_customers = state.customers.filter((customer) => customer.id !== action.payload);
            return { ...state, customers: afterDelete_customers };
        default:
            return state; 
    }
}

export default customerReducer;