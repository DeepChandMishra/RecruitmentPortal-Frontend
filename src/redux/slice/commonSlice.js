
import { ActionType } from "../action-types";

const initialState = {
    skills: [],
    jobType: [],
    jobTypeCount: [],
    allUserDetails: {},
    categoriesList: [],
    notificationList: [],
    commentListing: [],
    publicProfile : {}
}

export const commonReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.SKILLS:
            return { ...state, skills: action.payload };

        case ActionType.JOB_TYPE:
            return { ...state, jobType: action.payload };

        case ActionType.JOB_TYPE_COUNT:
            return { ...state, jobTypeCount: action.payload };

        case ActionType.ALL_USER_DETAILS:
            return { ...state, allUserDetails: action.payload };

        case ActionType.CATEGORIES_LIST:
            return { ...state, categoriesList: action.payload };

        case ActionType.NOTIFICATION_LIST:
            return { ...state, notificationList: action.payload };

        case ActionType.NOTIFICATIONS_LIST:
            return { ...state, notificationList: action.payload };

        case ActionType.COMMENT_LIST:
            return { ...state, commentListing: action.payload };

        case ActionType.PUBLIC_PROFILE:
            return { ...state, publicProfile: action.payload };
    



        default:
            return state;
    }
};
