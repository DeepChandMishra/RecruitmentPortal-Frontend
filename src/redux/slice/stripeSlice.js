// import { ActionType } from "store/action-types";

import { ActionType } from "../action-types";

const initialState = {
    planList: [],
    subscriptionList: [],
    getSubscriptionInfo: [],
    jobSlotPlanList: [],
};

export const stripeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.PLAN_LIST:
            return { ...state, planList: action.payload };
        
        case ActionType.JOB_SLOTS_PLAN_LIST:
            return { ...state, jobSlotPlanList: action.payload };
            
        case ActionType.SUBSCRIPTION_LIST:
            return { ...state, subscriptionList: action.payload };
            
        case ActionType.SUBSCRIPTION_INFO:
            return { ...state, getSubscriptionInfo: action.payload };

        default:
            return state;
    }
};
