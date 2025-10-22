import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * CMS
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const pageContent = (pagename, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/content/page/${pagename}`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.CONTENT_DATA,
                        payload: response?.data
                    });
                }
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

export const pageFooterContent = (pagename, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/content/page/${pagename}`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    // dispatch({
                    //     type: ActionType.CONTENT_DATA,
                    //     payload: response?.data
                    // });
                }
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



