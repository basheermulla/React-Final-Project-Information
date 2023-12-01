import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_ERROR
} from '../constants/userConstants';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

//------------------ Sing Up ------------------------------

export const signUpRequest = () => (dispatch) => {
    dispatch({ type: USER_SIGNUP_REQUEST });
}

export const signUpSuccess = () => (dispatch) => {
    dispatch({ type: USER_SIGNUP_SUCCESS });
}

export const signUpError = (error) => (dispatch) => {
    const errCode = error.code;
    const errMessage = error.message;
    const obj_error = {
        Code: errCode,
        Message: errMessage
    }
    dispatch({ type: USER_SIGNUP_ERROR, payload: obj_error });
}

//------------------ Sing In ------------------------------

export const signInRequest = () => (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
}

export const login = (user) => (dispatch) => {
    dispatch({ type: USER_LOGIN_SUCCESS, payload: user });
}

export const signInError = (error) => (dispatch) => {
    const errCode = error.code;
    const errMessage = error.message;
    const obj_error = {
        Code: errCode,
        Message: errMessage
    }
    dispatch({ type: USER_LOGIN_FAIL, payload: obj_error });
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
}