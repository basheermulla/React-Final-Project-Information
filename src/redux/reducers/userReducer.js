import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_ERROR
} from '../constants/userConstants';

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userLogin: userInfoFromStorage,
};

export const userLoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            console.log('login request');
            return { ...state, loading: true, error: null };
        case USER_LOGIN_SUCCESS:
            console.log('login success');
            const userLogin = {
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
                accessToken: action.payload.accessToken,
                role: action.payload.role
            }
            localStorage.setItem('userInfo', JSON.stringify(userLogin));
            return { ...state, loading: false, error: null, userLogin };
        case USER_LOGIN_FAIL:
            console.log('signin error');
            let errorMessage = '';
            switch (action.payload.Code) {
                case 'auth/invalid-login-credentials':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('invalid'), action.payload.Message.indexOf(')'))
                        .replaceAll('-', ' ');
                    break;
                case 'auth/too-many-requests':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('Access'), action.payload.Message.indexOf('r.'))
                    break;
                default:
                    errorMessage = action.payload.Message
                    break;
            }
            return { ...state, loading: false, error: errorMessage };
        case USER_LOGOUT:
            console.log('user logout');
            return {};
        default:
            return state;
    }
};

export const userRegisterReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNUP_REQUEST:
            console.log('signup request');
            return { ...state, authError: null, loading: true };
        case USER_SIGNUP_SUCCESS:
            console.log('signup success');
            return { ...state, loading: false, authError: null };
        case USER_SIGNUP_ERROR:
            console.log('signup error');
            let errorMessage = '';
            switch (action.payload.Code) {
                case 'auth/email-already-in-use':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('email'), action.payload.Message.indexOf(')'))
                        .replaceAll('-', ' ')
                    break;
                case 'auth/invalid-email':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('invalid'), action.payload.Message.indexOf(')'))
                        .replaceAll('-', ' ')
                    break;
                case 'auth/weak-password':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('Password '), action.payload.Message.indexOf('('))
                    break;
                case 'auth/missing-password':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('missing'), action.payload.Message.indexOf(')'))
                        .replaceAll('-', ' ')
                    break;
                case 'auth/missing-email':
                    errorMessage = action.payload.Message
                        .substring(action.payload.Message.indexOf('missing'), action.payload.Message.indexOf(')'))
                        .replaceAll('-', ' ')
                    break;
                default:
                    errorMessage = action.payload.Message
                    break;
            }
            return { ...state, loading: false, authError: errorMessage };
        default:
            return state;
    }
}