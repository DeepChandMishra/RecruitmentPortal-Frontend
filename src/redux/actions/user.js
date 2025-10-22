import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * Login User
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const login = (data, callback = () => { }) => {
    return async (dispatch) => {
        let response
        try {
            response = await ApiClient.post(`${Environment.BASE_URL}/user/login`, data);
            console.log('login', response.data.token)
            console.log('response.data.detailAdded', response);
            console.log('response.data.subUserLoggedIn', response.data.user.subUserLoggedIn)

            if (response?.status) {

                if (response?.statusCode == 200) {

                    localStorage.setItem("_itoken", response?.data?.token);
                    dispatch({
                        type: ActionType.LOGIN,
                        payload: response.data?.user
                    });
                    dispatch({
                        type: ActionType.IS_AUTHENTICATE,
                        payload: true
                    });
                    // Check if the user is a sub-user
                    dispatch({
                        type: ActionType.SUB_USER,
                        payload: response.data.user.subUserLoggedIn
                    });
                    // if(response.data.subscriptionDetails && response.data.detailAdded){
                    //     toast.success("Login Successful");
                    // }
                    if (!response.data.subscriptionDetails && !response.data.user.detailAdded && (response.data.user.role === 'employer' || response.data.user.role === 'employee')) {
                        toast.error("Please add details to continue");
                    } else if (!response.data.subscriptionDetails && response.data.user.detailAdded && response.data.user.role === 'employer') {
                        toast.error("Please subscribe to continue");
                    } else if (response.message == "Login successfully") {
                        toast.success('Login successful');
                    }
                } else {
                    toast.error(response?.message);
                    dispatch({
                        type: ActionType.IS_AUTHENTICATE,
                        payload: false
                    });
                }
                return callback(response);
            } else {
                toast.dismiss();
                toast.error(response?.message);
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            toast.error(response?.message);
            return callback(null);
        }
    };
};


/**
 * Social Login User
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const socialLogin = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/user/socialLogin`, data);
            console.log('asdsadsadsad', response.data.token, response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    localStorage.setItem("_itoken", response?.data?.token);
                    dispatch({
                        type: ActionType.LOGIN,
                        payload: response.data?.user
                    });
                    dispatch({
                        type: ActionType.IS_AUTHENTICATE,
                        payload: true
                    });
                    toast.success("Login successful");
                } else {
                    toast.error("Invalid user login!");
                    dispatch({
                        type: ActionType.IS_AUTHENTICATE,
                        payload: false
                    });
                }
                return callback(response);
            } else {
                toast.dismiss();
                toast.error("Credential not valid!");
                return callback({ newUser: true });
            }

        } catch (error) {
            console.log("error ", error);
            return callback({ status: false });
        }
    };
};


/**
 * Social SignUp  User
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const socialSocialSignUp = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/user/socialSignUp`, data);
            if (response?.status) {
                if (response?.statusCode == 200)
                    localStorage.setItem("_itoken", response?.data?.token);
                dispatch({
                    type: ActionType.LOGIN,
                    payload: response.data?.user
                });
                toast.success("Login successful");

                return callback(response);
            } else {
                toast.dismiss();
                toast.error("Credential not valid!");
                return callback({ newUser: true });
            }

        } catch (error) {
            console.log("error ", error);
            return callback({ status: false });
        }
    };
};



/**
 * Registered User
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const signup = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/user/register`, data);
            if (response?.status) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            return callback(response);

        } catch (error) {
            console.log("erroasdsfr ", error);
            toast.error("Credential not valid!");
            return callback(null);
        }
    };
};


export const forgotPassoword = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/user/forgotPassword`, data);
            console.log('asdsadsadsad', response.data.token, response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            toast.error("Credential not valid!");
            return callback(null);
        }
    };
};


export const resetPassoword = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/user/resetPassword`, data);
            console.log('asdsadsadsad', response.data.token, response)
            if (response?.status) {
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            toast.error("Credential not valid!");
            return callback(null);
        }
    };
};


/**
 * Verify Registered USer
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const verifyUser = (token, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/emailTemplates/verifyUser/${token}`,);
            console.log('asdsadsadsad', response.data.token, response)
            if (response?.status) {
                return callback(response);
            } else {
                return callback(null);
            }
        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};


export const addEmployerDetail = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/employer/addDetails/${data?.id}`, data?.employerDetails);
            // console.log('asdsadsadsad', response.data.token, response)
            if (response?.status) {
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            toast.error("Not valid!");
            return callback(null);
        }
    };
}

export const addEmployeeDetail = (data, callback = () => { }) => {
    console.log('Received data:', data, data.employeeDetails.resume);

    return async (dispatch) => {
        const formData = new FormData();

        // Ensure resume is a valid File object
        if (data.employeeDetails.resume instanceof File) {
            console.log('Appending resume file:', data.employeeDetails.resume);
            formData.append("resume", data.employeeDetails.resume);
        } else {
            console.log("Resume is not a valid file:", data.employeeDetails.resume);
        }

        // Append other fields
        formData.append("description", data.employeeDetails.description || '');
        formData.append("title", data.employeeDetails.title || '');
        formData.append("detailAdded", data.employeeDetails.detailAdded || false)


        // Append arrays
        data.employeeDetails.opportunityType.forEach(type => formData.append("opportunityType", type));
        data.employeeDetails.skills.forEach(skill => formData.append("skills", skill));
        data.employeeDetails.preferredLanguages.forEach(lang => formData.append("preferredLanguages", lang));

        // Append address object
        if (data.employeeDetails.address) {
            formData.append("address", JSON.stringify(data.employeeDetails.address));
        }

        try {
            const response = await ApiClient.patchFormData(
                `${Environment.BASE_URL}/jobseeker/addDetails/${data?.userId}`,
                formData,
            );

            if (response?.status) {
                return callback(response);
            } else {
                toast.dismiss();
                return callback(null);
            }
        } catch (error) {
            console.log("API error:", error);
            return callback(null);
        }
    };
};

export const getAcknowledgment = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/acknowledgment/get`);
            console.log('acknowledgment', response)
            if (response?.status) {
                console.log("if entered")
                dispatch({
                    type: ActionType.ACKNOWLEDMENT,
                    payload: response.data,
                });
                return callback(response);
            } else {
                toast.dismiss();
                dispatch({
                    type: ActionType.ACKNOWLEDMENT,
                    payload: null,
                });
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            dispatch({
                type: ActionType.ACKNOWLEDMENT,
                payload: null,
            });
            toast.error("Not valid!");
            return callback(null);
        }
    };
}



export const logout = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            toast.dismiss();
            toast.success("Logout successfully!");
            localStorage.removeItem('_itoken');

            dispatch({
                type: ActionType.LOGOUT,
                payload: null,
            });

            // Navigate to login
            window.location.href = "/login";

            // Callback for success
            return callback(true);
        } catch (error) {
            console.error("Logout Error: ", error);
            return callback(false);
        }
    };
};

export const userSlotSubscriptionPlan = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/employer/userSlotSubscriptionPlan`);
            console.log('subscription', response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("Subscription plan fetched successfully");
                    dispatch({
                        type: ActionType.SLOT_PLANS,
                        payload: response.data,
                    });
                }
                return callback(response);
            } else {
                toast.dismiss();
                toast.error("Not valid!");
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            toast.error("Not valid!");
            return callback(null);
        }
    };
}