import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * Meeting Create
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const createMeeting = (params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/meeting/create`, params);
            console.log('response >>', response);
            if (response?.status) {
                console.log('called called', response)
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};


export const updateMeeting = (id, params, callback = () => { }) => {
    return async (dispatch) => {
      try {
        const response = await ApiClient.patch(`${Environment.BASE_URL}/meeting/update/${id}`, params);
        console.log('response >>', response);
        if (response?.status) {
          return callback(response);
        } else {
          toast.dismiss();
          return callback(null);
        }
      } catch (error) {
        console.log("error ", error);
        return callback(null);
      }
    };
  };
  
/**
 * Get Meeting Events
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getMeetingEvents = (id, params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/meeting/getAllEvents/${id}`);
            if (response?.status) {
                dispatch({
                    type: ActionType.MEETING_EVENTS,
                    payload: response?.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.MEETING_EVENTS,
                    payload: []
                });
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};

/**
 * Get Meeting Events List with pagination
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getMeetingEventsList = (id, params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/meeting/getEvents/${id}`, params);
            if (response?.status) {
                dispatch({
                    type: ActionType.MEETING_EVENTS_LIST,
                    payload: response?.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.MEETING_EVENTS_LIST,
                    payload: []
                });
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};



/**
 * Get Meeting Events
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getAllUsers = (params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/user/userList`, params);
            if (response?.status) {
                dispatch({
                    type: ActionType.USER_LIST,
                    payload: response?.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.USER_LIST,
                    payload: []
                });
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};

/**
 * Meeting Cancel
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const cancelMeeting = (meet_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/meeting/cancel/${meet_id}`);
            if (response?.status) {
                console.log('called called', response)
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};


/**
 * Events by Date
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const EventsByDate = (params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/meeting/eventsByDate`, params);
            if (response?.status) {
                console.log('called called', response)
                dispatch({
                    type: ActionType.MEETING_EVENTS_BY_DATE,
                    payload: response?.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.MEETING_EVENTS_BY_DATE,
                    payload: []
                });
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};


/**
 * Get Upcomming or past Events
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getUpcomingOrPastEvent = (params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/meeting/getUpcomingOrPastEvent`, params);
            if (response?.status) {
                dispatch({
                    type: ActionType.MEETING_UPCOMING_PAST,
                    payload: response?.data
                });
                console.log('called called', response)
                return callback(response);
            } else {
                toast.dismiss();
                dispatch({
                    type: ActionType.MEETING_UPCOMING_PAST,
                    payload: []
                });
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};
