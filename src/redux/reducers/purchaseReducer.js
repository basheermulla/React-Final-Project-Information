import { v4 as uuidv4 } from 'uuid';
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

    SUBMIT_PURCHASE_FAIL,
    SUBMIT_ADD_PURCHASE_FAIL
} from '../constants/purchaseConstants';

const initialState = {
    purchases: []
};

const purchaseReducer = (state = initialState, action) => {
    switch (action.type) {

        // ---------------- Load ----------------------
        case LOAD_PURCHASES_REQUEST:
            console.log('LOAD_PURCHASES_REQUEST = ', action.payload);
            return { ...state, purchases: action.payload };
        case LOAD_PURCHASES_SECCESS:
            console.log('LOAD_PURCHASES_SECCESS = ', action.payload);
            return { ...state, loading: false, error: null, purchases: action.payload };
        case LOAD_PURCHASES_FAIL:
            console.log('LOAD_PURCHASES_FAIL = ', action.payload);
            let str_load = new String(action.payload);
            const messege_load = str_load.valueOf();
            return { ...state, loading: false, error: messege_load };


        // ---------------- Add ----------------------
        case ADD_PURCHASE_REQUEST:
            console.log('ADD_PURCHASE_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case ADD_PURCHASE_SECCESS:
            console.log('ADD_PURCHASE_SECCESS = ', action.payload);
            return { ...state, loading: false, error_add_purchase: null, purchases: [...state.purchases, action.payload] };
        case ADD_PURCHASE_FAIL:
            console.log('ADD_PURCHASE_FAIL = ', action.payload);
            let str_add = new String(action.payload);
            const messege_add = str_add.valueOf();
            const show_messege_add = messege_add
                .substring(messege_add.indexOf('Function'), messege_add.indexOf('purchases/'))
                // .replaceAll('-', ' ');
                console.log(show_messege_add);
            return { ...state, loading: false, error_add_purchase: show_messege_add + ')' };

        // ---------------- Delete ----------------------
        case DELETE_PURCHASE_REQUEST:
            console.log('DELETE_PURCHASE_REQUEST = ', action.payload);
            return { ...state, loading: true };
        case DELETE_PURCHASE_SECCESS:
            console.log('DELETE_PURCHASE_SECCESS = ', action.payload);
            const afterDelete_purchases = state.purchases.filter((purchase) => !action.payload.includes(purchase.id));
            console.log(afterDelete_purchases);
            return { ...state, loading: false, error: null, purchases: afterDelete_purchases };
        case DELETE_PURCHASE_FAIL:
            console.log('DELETE_PURCHASE_FAIL = ', action.payload);
            let str_delete = new String(action.payload);
            const messege_delete = str_delete.valueOf();
            return { ...state, loading: false, error: messege_delete };

        // ---------------- Submit purchase Fail  -----------
        case SUBMIT_PURCHASE_FAIL:
            console.log('SUBMIT_PURCHASE_FAIL = ', action.payload);
            return { ...state, loading: false, error: null };
        case SUBMIT_ADD_PURCHASE_FAIL:
            console.log('SUBMIT_ADD_PURCHASE_FAIL = ', action.payload);
            return { ...state, loading: false, error_add_purchase: null };

        default:
            return state;
    }
}

export default purchaseReducer;