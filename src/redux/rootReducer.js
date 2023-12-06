import { combineReducers } from 'redux';
import productReducer from './reducers/productReducer';
import customerReducer from './reducers/customerReducer';
import purchaseReducer from './reducers/purchaseReducer';
import { userRegisterReducer, userLoginReducer, userReducer } from './reducers/userReducer'

export default combineReducers({
    productReducer, customerReducer, purchaseReducer, userRegisterReducer, userLoginReducer, userReducer
});