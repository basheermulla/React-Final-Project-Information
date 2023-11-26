import {
    LOAD_CUSTOMERS,
    UPDATE_CUSTOMER,
    DELETE_CUSTOMER
} from '../constants/customerConstants';

export const getAllCustomers = (customers) => (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS, payload: customers });
}

export const updateCustomer = (customer) => (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMER, payload: customer });
}

export const deleteCustomer = (customerID) => (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER, payload: customerID });
}