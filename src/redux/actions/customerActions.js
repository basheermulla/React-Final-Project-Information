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


//------------------ Get[load] All Customers Actions ------------------------------

export const loadCustomersRequest = () => (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS_REQUEST });
}

export const loadCustomersSuccess = (customers) => (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS_SECCESS, payload: customers });
}

export const loadCustomersFail = (message) => (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS_FAIL, payload: message });
}

//------------------ Add Customer Actions -----------------------------------------

export const addCustomerRequest = () => (dispatch) => {
    dispatch({ type: ADD_CUSTOMER_REQUEST });
}

export const addCustomerSuccess = (customer) => (dispatch) => {
    dispatch({ type: ADD_CUSTOMER_SECCESS, payload: customer });
}

export const addCustomerFail = (message) => (dispatch) => {
    dispatch({ type: ADD_CUSTOMER_FAIL, payload: message });
}

//------------------ Update Customer Actions --------------------------------------

export const updateCustomerRequest = () => (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMER_REQUEST });
}

export const updateCustomerSuccess = (customer) => (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMER_SECCESS, payload: customer });
}

export const updateCustomerFail = (message) => (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMER_FAIL, payload: message });
}

//------------------ Delete Customer Actions --------------------------------------

export const deleteCustomerRequest = () => (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER_REQUEST });
}

export const deleteCustomerSuccess = (customerID) => (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER_SECCESS, payload: customerID });
}

export const deleteCustomerFail = (message) => (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER_FAIL, payload: message });
}

//------------------ Submit Edit Customer Action Error ------------------------------

export const submitCustomerFail = () => (dispatch) => {
    dispatch({ type: SUBMIT_CUSTOMER_FAIL });
}