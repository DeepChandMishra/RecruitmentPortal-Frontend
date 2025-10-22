import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";
import { ActionType } from "../action-types";


/**
 * Prefrenced Jobs ..
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getAllPrefrenceJobs = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobs/listingOnPreference`, param);
            if (response?.status) {
                dispatch({
                    type: ActionType.PREFRENCE_JOBS,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.PREFRENCE_JOBS,
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
 * Get Prefrence Job Details by ID
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getPrefrenceJobsDetails = (job_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobs/get/${job_id}`);
            if (response?.status) {
                dispatch({
                    type: ActionType.JOB_DETAILS,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.JOB_DETAILS,
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
 * Get All User's Saved Jobs
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getSavedJobByUser = (user_id, param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/savedJob/saved/${user_id}`, param);
            if (response?.status) {
                dispatch({
                    type: ActionType.SAVED_JOB_LISTING,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.SAVED_JOB_LISTING,
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
 * Get Saved Job
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getSavedJobs = (job_id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.get(`${Environment.BASE_URL}/jobs/get/${job_id}`);
            if (response?.status) {
                dispatch({
                    type: ActionType.JOB_DETAILS,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.JOB_DETAILS,
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
 * Get Job List
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const getJobsList = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/jobs/listingOnWeb`, param);
            if (response?.status) {
                dispatch({
                    type: ActionType.FILTER_JOB,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.FILTER_JOB,
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
 * Prefrenced Jobs ..
 * @param {Request} token
 * @param {Function} callback
 * @returns
 */
export const updateEmployeeDetails = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.patch(`${Environment.BASE_URL}/jobs/listingOnWeb`, param);
            if (response?.status) {
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


/**
 * Save Job
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const saveJob = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/savedJob/save-unsave`, param);
            if (response?.status) {
                toast.success(response.message == "Created successfully" ? "Saved successfully" : response.message)
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



/**
 * Applay Job
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const applyJob = (param, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/applicant/apply`, param);
            if (response?.status) {
                toast.success(response.message == "Created successfully" ? "Applied successfully" : response.message)
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


/**
 * Update Employee
 * @param {Request} token 
 * @param {Function} callback 
 * @returns 
 */
export const updateEmployee = (_id, data, callback = () => { }) => {
    return async (dispatch) => {
        console.log('datadata', data)
        try {

            const formData = new FormData();

            if (data.resume instanceof File) {
                console.log('Appending resume file:', data.resume);
                formData.append("file", data.file);
            } else {
                console.log("Resume is not a valid file:", data.resume);
                formData.append("file", data.file);
            }

            // Append other fields
            formData.append("description", data.description || '');
            formData.append("fileType", data.fileType || '')
            formData.append("title", data.title || '');
            formData.append("firstname", data.firstname || '');
            formData.append("lastname", data.lastname || '');

            formData.append("detailAdded", data.detailAdded || false);



            // Append arrays
            data.opportunityType.forEach(type => formData.append("opportunityType", type));
            data.skills.forEach(skill => formData.append("skills", skill));
            data.preferredLanguages.forEach(lang => formData.append("preferredLanguages", lang));

            // Append address object
            if (data.address) {
                formData.append("address", JSON.stringify(data.address));
            }

            // Log each entry in formData
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            const response = await ApiClient.patchFormData(`${Environment.BASE_URL}/jobseeker/edit/${_id}`, formData);
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



/**
 * Job Tracker for employee
 * @param {Request} id 
 * @param {Request} data 
 * @param {Function} callback 
 */
export const jobTracker = (id, data, callback = () => { }) => {
    return async (dispatch) => {
        console.log('datadata', data)
        try {
            const response = await ApiClient.post(`${Environment.BASE_URL}/applicant/listingByApplicant/${id}`, data);
            if (response?.status) {
                dispatch({
                    type: ActionType.TRACKED_JOB,
                    payload: response.data
                });
                return callback(response);
            } else {
                dispatch({
                    type: ActionType.TRACKED_JOB,
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