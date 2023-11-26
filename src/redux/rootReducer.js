import { combineReducers } from 'redux';
import productReducer from './reducers/productReducer';
import customerReducer from './reducers/customerReducer';
import purchaseReducer from './reducers/purchaseReducer';

export default combineReducers({
    productReducer, customerReducer, purchaseReducer
});