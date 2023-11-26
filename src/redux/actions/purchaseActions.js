import {
    LOAD_PURCHASES,
    ADD_PURCHASE
} from '../constants/purchaseConstants';

export const getAllPurchase = (purchases) => (dispatch) => {
    dispatch({ type: LOAD_PURCHASES, payload: purchases });
}

export const AddPurchase = (purchase) => (dispatch) => {
    dispatch({ type: ADD_PURCHASE, payload: purchase });
}
