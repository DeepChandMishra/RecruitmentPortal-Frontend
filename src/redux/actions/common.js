import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * Skill Listing
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const skillsListing = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/skills/listing`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    console.log("response of skills ", response)
                    dispatch({
                        type: ActionType.SKILLS,
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


/**
 * JobType Listing
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const jobTypesListing = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobType/get`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.JOB_TYPE,
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

/**
 * JobType Listing with count
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const jobTypesListingWithCount = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobType/getwithcount`);
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.JOB_TYPE_COUNT,
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


/**
 * Get User Details
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getUsersDetails = (user_id, param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/get/${user_id}`, param);
            console.log("response in get user detail", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.USER_DETAILS,
                        payload: response?.data
                    });

                    dispatch({
                        type: ActionType.ALL_USER_DETAILS,
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

/**
 * Get User Details
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getUsersPublicProfile = (user_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/get/${user_id}`);
            console.log("response in get user detail", response)
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
 * Get categories || Domain
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getCategories = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobCategory/listing`);
            if (response?.status) {
                console.log("🚀 ~ return ~ response:", response)
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.CATEGORIES_LIST,
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



/**
 * Get Notification
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const notificationListing = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/notification/get/${id}`);
            if (response?.status) {
                console.log("🚀 ~ return ~ response:", response)
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.NOTIFICATION_LIST,
                        payload: response?.data
                    });
                }
                else {
                    dispatch({
                        type: ActionType.NOTIFICATION_LIST,
                        payload: []
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
 * Get Notification
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const notificationStatus = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/notification/changeStatus/${id}`);
            if (response?.status) {
                console.log("🚀 ~ return ~ response:", response)

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
 * Get Comments
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */

export const getComments = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/comment/lisiting`, param);
            console.log('responseee', response)
            if (response?.status) {
                dispatch({
                    type: ActionType.COMMENT_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.COMMENT_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }

        } catch (error) {
            console.error('Error fetching jobseeker data:', error);
            return callback(null);
        }
    };
};


/**
 * Logout
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const logoutUser = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/logout/${id}`);
            if (response?.status) {
                console.log("🚀 ~ return ~ response:", response)

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




export const getPublicProfileDetails = (user_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/get/${user_id}`);
            console.log("response in get user detail", response)
            if (response?.status) {
                dispatch({
                    type: ActionType.PUBLIC_PROFILE,
                    payload: response?.data
                })
                return callback(response);
            } else {
                toast.dismiss();
                dispatch({
                    type: ActionType.PUBLIC_PROFILE,
                    payload: {}
                })
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            dispatch({
                type: ActionType.PUBLIC_PROFILE,
                payload: {}
            })
            return callback(null);
        }
    };
};

export const changePassword = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/changePassword`, param);
            if (response?.status && response.statusCode === 200) {
                toast.success('Password changed successfully');
                return callback(true);
            } else {
                toast.error(response?.message || 'Failed to change password');
                return callback(false);
            }

        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error?.response?.data?.message || 'Something went wrong');
            return callback(false);
        }
    };
};

export const changeSubUserPassword = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/changeSubUserPassword`, payload);
            if (response?.status && response.statusCode === 200) {
                toast.success('Password changed successfully');
                return callback(true);
            } else {
                toast.error(response?.message || 'Failed to change password');
                return callback(false);
            }

        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error?.response?.data?.message || 'Something went wrong');
            return callback(false);
        }
    };
};