import { v4 as uuidv4 } from 'uuid';
import {
    LOAD_PURCHASES,
    ADD_PURCHASE
} from '../constants/purchaseConstants';

const initialState = {
    purchases: []
};

const purchaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PURCHASES:
            console.log('LOAD_PURCHASES = ', action.payload);
            return { ...state, purchases: action.payload };
        case ADD_PURCHASE:
            console.log('ADD_PURCHASE = ', action.payload);
            return { ...state, purchases: [...state.purchases, { id: uuidv4(), ...action.payload }]};
        default:
return state;
    }
}

export default purchaseReducer;