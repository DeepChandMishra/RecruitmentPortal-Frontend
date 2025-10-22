
import { ActionType } from "../action-types";

const initialState = {
   filterCandidate: [],
   jobPosted : [],
   applicantList : [],
   hiredCandidate : [],
   savedTalentList : [],
   appliedCandidate: [],
   serviceList:[],
   jobNameList:[],
   slotsPlan:[]
};

export const employerReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.FILTER_CANDIDATE:
            return { ...state, filterCandidate: action.payload };

        case ActionType.JOB_POSTED:
            console.log({action})
            return { ...state, jobPosted: action.payload };

        case ActionType.APPLICANT_LIST:
            return { ...state, applicantList: action.payload };

        case ActionType.HIRED_CANDIDATE_LIST:
            return { ...state, hiredCandidate: action.payload };
                
        case ActionType.SLOT_PLANS:
            return { ...state, slotsPlan: action.payload };
            
        case ActionType.SAVED_TALENT_LIST:
            return { ...state, savedTalentList: action.payload };

            
        case ActionType.APPLIED_CANDIDATE:
            return { ...state, appliedCandidate: action.payload };

        case ActionType.SERVICE_LIST:
            return { ...state, serviceList: action.payload };


        case ActionType.JOB_NAMES:
            return { ...state, jobNameList: action.payload };


        default:
            return state;
    }
};
