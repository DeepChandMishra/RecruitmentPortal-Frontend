
import { ActionType } from "../action-types";

const initialState = {
    contentData: []
};

export const cmsReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.CONTENT_DATA:
            return { ...state, contentData: action.payload };



        default:
            return state;
    }
};
