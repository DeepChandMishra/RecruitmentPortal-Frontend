import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";



export const getAllRoomList = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/message/myRoom`);
            if (response?.status) {
                dispatch({
                    type: ActionType.ROOM_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.ROOM_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }

        } catch (error) {
            console.error('Error fetching room list data:', error);
            return callback(null);
        }
    };
};

export const getRoomDetails = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/message/roomDetails/${id}`);
            console.log('getRoomDetails', response);
            
            if (response?.status) {
                dispatch({
                    type: ActionType.ROOM_DETAILS,
                    payload: response.data
                });

                return callback(response);
            } else {
                dispatch({
                    type: ActionType.ROOM_DETAILS,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }

        } catch (error) {
            console.error('Error fetching room details data:', error);
            return callback(null);
        }
    };
};


export const getReceiverUserDetails = (user_id, param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/get/${user_id}`, param);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    return callback(response);
                }
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


