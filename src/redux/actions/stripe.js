import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * Get Plan List .
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getPlan = (roleType, callback = () => { }) => {
    return async (dispatch) => {
        try {
            let _data = { role: roleType }
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/listing`, _data);
            console.log('response >>', response);
            
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.PLAN_LIST,
                        payload: response.data.docs
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

/**
 * Get Job Slot Plan List .
 * @param {Request} token
 * @param {Function} callback
 * @returns
 */

export const getJobSlotPlan = (roleType, callback = () => { }) => {
    return async (dispatch) => {
        try {
            let _data = { role: roleType }
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/jobSlotListing`, _data);
            console.log('response >>', response);

            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.JOB_SLOTS_PLAN_LIST,
                        payload: response.data.docs
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
}

/**
 * Get Plan Details .
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getPlanDetails = (_id, callback = () => { }) => {
    console.log("🚀 ~ return ~ response:")
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/get/${_id}`);
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



export const checkout = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/checkout/${data?.planId}/${data?.userId}`);
            console.log('response >>', response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.PLAN_LIST,
                        payload: response.data.docs
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
}

export const checkoutSlot = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/checkoutSlot/${data?.planId}/${data?.userId}`);
            console.log('response >>', response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.JOB_SLOTS_PLAN_LIST,
                        payload: response.data.docs
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
}

/**
 * Get Subcription Listing .
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */

export const getSubscriptionListing = (params, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/listing`, params);
            console.log('response >>', response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.SUBSCRIPTION_LIST,
                        payload: response.data.docs
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
}

export const subscribePlan = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/stripe/createSubscription`, data);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    // dispatch({
                    //     type: ActionType.PLAN_LIST,
                    //     payload: response.data.docs
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
}

export const jobSlotSubscribtionPlan = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/stripe/createSlotSubscription`, data);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    // dispatch({
                    //     type: ActionType.PLAN_LIST,
                    //     payload: response.data.docs
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
}

export const addedSlots = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/stripe/addedSlots`, payload);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("Slots added successfully!");
                }
                return callback(response);
            } else {
                toast.dismiss();
                toast.error("Failed to add slots");
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
}

export const logout = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            toast.dismiss()
            toast.success("Logout successfully!");
            localStorage.removeItem('_itoken')
            dispatch({
                type: ActionType.LOGOUT,
                payload: null
            });
            return callback(true);

        } catch (error) {
            console.log("error ", error);
            return callback(false);
        }
    };
};


export const getSubscriptionInfo = (_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/getSubscriptionInfo/${_id}`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.SUBSCRIPTION_INFO,
                        payload: response.data.docs
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
}

export const getSlotSubscriptionInfo = (_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/stripe/getSlotSubscriptionInfo/${_id}`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.SLOT_PLANS,
                        payload: response.data.docs
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
}
