
import { ActionType } from "../action-types";

const initialState = {
    loggedIn: false,
    userDetails: {},
    registrationDetails: {},
    registrationRole: '',
    settings: [],
    employeeDetails: {},
    employerDetails: {},
    isAuthenticate: false,
    userList: [],
    acknowledgment: {},
    timeLeft: {},
    subUser: {},
    subUserList: [],
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.LOGIN:
            return { ...state, loggedIn: true, userDetails: action.payload };

        case ActionType.LOGOUT:
            return initialState;

        case ActionType.USER_DETAILS:
            return { ...state, userDetails: action.payload };

        case ActionType.USER_REGISTRATION:
            return { ...state, registrationDetails: action.payload };

        case ActionType.USER_REGISTRATION_ROLE:
            return { ...state, registrationRole: action.payload };

        case ActionType.SETTINGS:
            return { ...state, settings: action.payload };

        case ActionType.EMPLOYER_DETAILS:
            return { ...state, employerDetails: action.payload }

        case ActionType.SUB_USER:
            return { ...state, subUser: action.payload }

        case ActionType.SUB_USER_LIST:
            return { ...state, subUserList: action.payload }

        case ActionType.EMPLOYEE_DETAILS:
            return { ...state, employeeDetails: action.payload };

        case ActionType.IS_AUTHENTICATE:
            return { ...state, isAuthenticate: action.payload };

        case ActionType.USER_LIST:
            return { ...state, userList: action.payload };

        case ActionType.ACKNOWLEDMENT:
            return { ...state, acknowledgment: action.payload };

        case ActionType.TIME_LEFT:
            return { ...state, timeLeft: action.payload };
        default:
            return state;
    }
};
