import {
    LOAD_PURCHASES_REQUEST,
    LOAD_PURCHASES_SECCESS,
    LOAD_PURCHASES_FAIL,

    ADD_PURCHASE_REQUEST,
    ADD_PURCHASE_SECCESS,
    ADD_PURCHASE_FAIL,

    DELETE_PURCHASE_REQUEST,
    DELETE_PURCHASE_SECCESS,
    DELETE_PURCHASE_FAIL,

    SUBMIT_PURCHASE_FAIL
} from '../constants/purchaseConstants';

//------------------ Get[load] All Customers Actions ------------------------------

export const loadPurchasesRequest = () => (dispatch) => {
    dispatch({ type: LOAD_PURCHASES_REQUEST });
}

export const loadPurchasesSuccess = (purchases) => (dispatch) => {
    dispatch({ type: LOAD_PURCHASES_SECCESS, payload: purchases });
}

export const loadPurchasesFail = (message) => (dispatch) => {
    dispatch({ type: LOAD_PURCHASES_FAIL, payload: message });
}

//------------------ Add Customer Actions -----------------------------------------

export const AddPurchaseRequest = () => (dispatch) => {
    dispatch({ type: ADD_PURCHASE_REQUEST });
}

export const AddPurchaseSuccess = (purchase) => (dispatch) => {
    dispatch({ type: ADD_PURCHASE_SECCESS, payload: purchase });
}

export const AddPurchaseFail = (message) => (dispatch) => {
    dispatch({ type: ADD_PURCHASE_FAIL, payload: message });
}

//------------------ Delete Customer Actions -----------------------------------------

export const deletePurchaseRequest = () => (dispatch) => {
    dispatch({ type: DELETE_PURCHASE_REQUEST });
}
export const deletePurchaseSuccess = (arr_purchaseID) => (dispatch) => {
    dispatch({ type: DELETE_PURCHASE_SECCESS, payload: arr_purchaseID });
}

export const deletePurchaseFail = (message) => (dispatch) => {
    dispatch({ type: DELETE_PURCHASE_FAIL, payload: message });
}

//------------------ Submit Edit Product Action Error ------------------------------

export const submitPurchaseFail = () => (dispatch) => {
    dispatch({ type: SUBMIT_PURCHASE_FAIL });
}