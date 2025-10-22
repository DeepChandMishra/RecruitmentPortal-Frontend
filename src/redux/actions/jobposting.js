import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";
import { containsHttps } from "../../util/UtilFunction";


/**
 * Get All Designation List
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getAllDesignationList = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/designation/listing`);
            if (response?.status) {
                dispatch({
                    type: ActionType.DESIGNATION_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.DESIGNATION_LIST,
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

/**
 * Get JobTypes List
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getJobTypesList = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobType/get`);

            if (response?.status) {
                dispatch({
                    type: ActionType.JOBTYPE_LIST,
                    payload: response.data
                });

                return callback(response);
            } else {
                dispatch({
                    type: ActionType.JOBTYPE_LIST,
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

/**
 * Add Job Posting
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const addJobPosting = (data, callback = () => { }) => {

    return async (dispatch) => {
        try {
            console.log('Received data:', data);
            const formData = new FormData();


            formData.append("commitmentType", data.commitmentType || '');
            formData.append("description", data.description || '');
            formData.append("designation", data.designation || '');
            formData.append("employerId", data.employerId || '');
            formData.append("hiringTimeline", data.hiringTimeline || '');
            formData.append("jobType", data.jobType || '');
            formData.append("payType", data.payType || '');
            formData.append("status", data.status || '');
            formData.append("category", data.category || '');
            if (data?.file) {
                if (containsHttps(data.file.name)) {
                    formData.append("file", data?.file?.name || '');
                }
                else {
                    formData.append("file", data?.file || '');
                }
            }
            if (data?.payScale) {
                formData.append('payScale', JSON.stringify(data.payScale))
            }
            //Appending Skills Array 
            data.skills.forEach(skill => formData.append("skills", skill));
            // data.category.forEach(categories => formData.append("category", categories));
            data.language.forEach(lang => formData.append("language", lang));

            // Append address object
            if (data.address) {
                formData.append("address", JSON.stringify(data.address));
            }

            if (data?.isEditable) {
                let updateReponse = await ApiClient.patchFormData(`${Environment.BASE_URL}/jobs/editJob/${data._id}`, formData);
                if (updateReponse?.status) {
                    console.log("🚀 ~ return ~ updateReponse:", updateReponse)
                    toast.success(updateReponse.message);
                    return callback(updateReponse);
                } else {
                    toast.dismiss();
                    return callback(null);
                }
            }
            else {
                let response = await ApiClient.postFormData(`${Environment.BASE_URL}/jobs/create`, formData);
                if (response?.status) {
                    toast.success(response.message);
                    return callback(response);
                } else {
                    toast.error(response.message);
                    return callback(null);
                }
            }
        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
};

/**
 * 
 * @param {Request} id 
 * @param {Function} callback 
 * @returns 
 */
export const viewCountOfJob = (id, callback = () => { }) => {

    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/jobs/view/${id}`);
            console.log("view count", response)
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

export const inactiveJob = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/jobs/blockStatus/${id}`);
            console.log("view count", response)
            if (response?.status) {
                toast.success("Job status changed successfully")
                return callback(response);
            } else {
                return callback(null);
            }

        } catch (error) {
            console.log("error ", error);
            return callback(null);
        }
    };
}

export const hiringTimelineList = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobType/hiringTimeline/list`);
            console.log("view hiring timeline", response)
            if (response?.status) {
                dispatch({
                    type: ActionType.HIRING_TIMELINE_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.HIRING_TIMELINE_LIST,
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

export const getJobRoleList = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/manageRoles/getRoles`);
            if (response?.status) {
                dispatch({
                    type: ActionType.ROLE_LIST,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.ROLE_LIST,
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
}

export const addRole = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/manageRoles/create`, data);
            if (response?.status) {
                //   toast.success(response?.message);
                return callback(response);
            } else {
                //   toast.error(response?.message);
                return callback(null);
            }
        } catch (error) {
            // toast.error(error?.message || "Something went wrong.");
            return callback(null);
        }
    };
}