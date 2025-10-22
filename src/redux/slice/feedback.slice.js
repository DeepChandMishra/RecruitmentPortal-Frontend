import { ActionType } from "../action-types";

const initialState = {
    feedback: [],
};

export const feedbackReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.SUBMIT_FEEDBACK:
            return { ...state, feedback: [...state.feedback, action.payload] };

        default:
            return state;
    }
};

