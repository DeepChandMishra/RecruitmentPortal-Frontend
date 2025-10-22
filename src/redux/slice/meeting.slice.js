
import { ActionType } from "../action-types";

const initialState = {
    meetingEvents: [],
    meetingEventsList: [],
    meetingEventsByDate: [],
    meetingUpcommingandPast: []
};

export const meetingReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionType.MEETING_EVENTS_LIST:
            return { ...state, meetingEventsList: action.payload };

        case ActionType.MEETING_EVENTS:
            return { ...state, meetingEvents: action.payload };


        case ActionType.MEETING_EVENTS_BY_DATE:
            return { ...state, meetingEventsByDate: action.payload };

        case ActionType.MEETING_UPCOMING_PAST:
            return { ...state, meetingUpcommingandPast: action.payload };


        default:
            return state;
    }
};
