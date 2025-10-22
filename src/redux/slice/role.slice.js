import { ActionType } from "../action-types";

const initialState = {
    roleList: [],
};

export const roleReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.ROLE_LIST:
            return { ...state, roleList: action.payload };

        default:
            return state;
    }
};