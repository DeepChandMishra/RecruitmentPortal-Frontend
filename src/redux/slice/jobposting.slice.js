
import { ActionType } from "../action-types";

const initialState = {
    jobDetails: {},
    designationList: [],
    jobTypeList: [],
    jobUrgencyList:[],
};

export const jobpostingReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.JOB_DETAILS:
            return { ...state, jobDetails: action.payload }

        case ActionType.DESIGNATION_LIST:
            return { ...state, designationList: action.payload }

        case ActionType.JOBTYPE_LIST:
            return { ...state, jobTypeList: action.payload }
        
        case ActionType.HIRING_TIMELINE_LIST:
            return { ...state, jobUrgencyList: action.payload }
        default:
            return state;
    }
};
