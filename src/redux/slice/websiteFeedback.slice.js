import { ActionType } from "../action-types";

const initialState = {
    websiteFeedback: [],
};

export const websiteFeedbackReducer = (state = initialState, action) => {  
    switch (action.type) {
        case ActionType.SUBMIT_WEBSITE_FEEDBACK:
            return { ...state, feedback: [...state.feedback, action.payload] };

        default:
            return state;
    }
}