
import { ActionType } from "../action-types";

const initialState = {
    prefrenceJobsList: [],
    jobDetails: {},
    filterJob: [],
    savedJobsList: [],
    trackedJobList:[]

};

export const empoyeeReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.PREFRENCE_JOBS:
            return { ...state, prefrenceJobsList: action.payload };

        case ActionType.JOB_DETAILS:
            return { ...state, jobDetails: action.payload };

        case ActionType.FILTER_JOB:
            return { ...state, filterJob: action.payload };

        case ActionType.SAVED_JOB_LISTING:
            return { ...state, savedJobsList: action.payload }; 

        case ActionType.TRACKED_JOB:
            return { ...state, trackedJobList: action.payload };
        default:
            return state;
    }
};
