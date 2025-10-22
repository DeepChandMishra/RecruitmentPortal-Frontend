import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";

/**
 * Get Candidates
 * @param {Request} token
 * @param {Function} callback
 */
export const getCandidates = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/jobseeker/filterJobseeker`, param)
            if (response?.status) {
                dispatch({
                    type: ActionType.FILTER_CANDIDATE,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.FILTER_CANDIDATE,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}


/**
 * Get Jobs Post by Employer
 * @param {Request} token
 * @param {Function} callback
 */
export const getJobPosted = (param, id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/jobs/listingOnWebByEmployer/${id}`, param)
            console.log("response in getJobPosted", response)
            if (response?.status) {
                dispatch({
                    type: ActionType.JOB_POSTED,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.JOB_POSTED,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}


/**
 * Get Applicant by Employer
 * @param {Request} token
 * @param {Function} callback
 */

export const getApplicantByEmployerId = (param, id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/applicant/listingByEmployer/${id}`, param)
            if (response?.status) {
                dispatch({
                    type: ActionType.APPLICANT_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.APPLICANT_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}

/**
 * 
 * @param {param} param 
 * @param {applicant Id} id 
 * @param {Function} callback 
 * @returns 
 */
export const editAppicantStatus = (param, id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/applicant/edit/${id}`, param)
            if (response?.status) {
                return callback(response);
            } else {
                return callback(null);
            }
        } catch (error) {

        }
    }
}

/**
 * 
 * @param {param} param 
 * @param {Employer Id} id 
 * @param {Function} callback 
 * @returns 
 */

export const hiredCandidateList = (param, id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/applicant/hiredApplicants/${id}`, param)
            if (response?.status) {
                dispatch({
                    type: ActionType.HIRED_CANDIDATE_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.HIRED_CANDIDATE_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}



export const saveTalent = (param, id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/savedTalent/listing/${id}`, param)
            if (response?.status) {
                dispatch({
                    type: ActionType.SAVED_TALENT_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.SAVED_TALENT_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}

/**
 * Update Employer
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const updateEmployer = (_id, param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patchFormData(`${Environment.BASE_URL}/employer/edit/${_id}`, param);
            if (response?.status) {
                toast.success(response.message)
                return callback(response);
            } else {
                console.error('API response not successful:', response);
                return callback(null);
            }

        } catch (error) {
            console.error('Error fetching room list data:', error);
            return callback(null);
        }
    };
};


export const applicantByJobId = (id, param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/applicant/listingByJob/${id}`, param);
            console.log("response in applicant by job", response)
            if (response?.status) {
                dispatch({
                    type: ActionType.APPLIED_CANDIDATE,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.APPLIED_CANDIDATE,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {
            return callback(null);
        }
    }
}

/**
 * Save Employee
 * @param {Request} token
 * @param {Function} callback
 */

export const saveTalentEmployee = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/savedTalent/save-unsave/`, param)
            if (response?.status) {
                if (response.data.status) {
                    toast.success('Saved successfully')
                }
                else {
                    toast.success('Unsaved successfully')
                }
                return callback(response);
            } else {
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}



/***Get Employer Services List
 * 
 */

export const getEmployerServices = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/employer/services/${id}`)
            if (response?.status) {
                dispatch({
                    type: ActionType.SERVICE_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.SERVICE_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}



/***Get Employer Services List
 * 
 */

export const getJobNames = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobs/listingByJobsEmployer/${id}`)
            if (response?.status) {
                dispatch({
                    type: ActionType.SERVICE_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.SERVICE_LIST,
                    payload: []
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {

        }
    }
}


/**
 * Get Job Names
 * @param {Object} param - Parameters for filtering job names
 * @param {Function} callback - Callback to handle response
 */
export const listingByJobs = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobs/listingByJobsEmployer/${id}`);
            console.log("Response in listingByJobs:", response);

            if (response?.status) {
                dispatch({
                    type: ActionType.JOB_NAMES,
                    payload: response.data,
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.JOB_NAMES,
                    payload: [],
                });
                console.error('API response not successful:', response);
                return callback(null);
            }
        } catch (error) {
            console.error('Error in listingByJobs API:', error);
            return callback(null);
        }
    };
};

export const getSubUsersDetails = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/employer/getSubUsersDetails`, data);
            console.log("response in getSubUsersDetails", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    dispatch({
                        type: ActionType.SUB_USER_LIST,
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

export const changeSubUserStatus = (userId, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/employer/handleToggleStatus/${userId}`);
            console.log("response in handleToggleStatus", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("Status updated successfully");
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

export const addSubUserEmail = (id, data, callback = () => {}) => {
    return async (dispatch) => {
      try {
        const response = await ApiClient.patch(`${Environment.BASE_URL}/employer/editSubUser/${id}`, data);
        if (response?.status && response.statusCode === 200) {
          toast.success("User added successfully");
          dispatch({
            type: ActionType.USER_DETAILS,
            payload: response.data,
          });
          return callback(true);
        } else {
          toast.dismiss();
          return callback(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error");
        return callback(false);
      }
    };
  };

export const changeSubUserRole = (userId, role, callback = () => {}) => {
    return async (dispatch) => {
        try {
            console.log("userId in changeSubUserRole", userId)
            console.log("role in changeSubUserRole", role)
            const response = await ApiClient.patch(`${Environment.BASE_URL}/employer/changeSubUserRole/${userId}`, { role });
            console.log("response in changeSubUserRole", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("Role updated successfully");
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

export const deleteSubUser = (userId, callback = () => {}) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/employer/deleteSubUser/${userId}`);
            console.log("response in deleteSubUser", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("User deleted successfully");
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
  
export const blockJobsByEmployer = (id, callback = () => {}) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/jobs/blockJobsByEmployer/${id}`);
            console.log("response in blockJobsByEmployer", response)
            if (response?.status) {
                if (response?.statusCode == 200) {
                    toast.success("Job blocked successfully");
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