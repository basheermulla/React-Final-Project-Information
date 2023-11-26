import {
    LOAD_CUSTOMERS,
    UPDATE_CUSTOMERS
} from '../constants/customerConstants';

export const getAllCustomers = (customers) => (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS, payload: customers });
}

export const updateCustomer = (customer) => (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMERS, payload: customer });
}