import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import reducer from './rootReducer.js'
import thunk from 'redux-thunk';

const middleware = [thunk];

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;