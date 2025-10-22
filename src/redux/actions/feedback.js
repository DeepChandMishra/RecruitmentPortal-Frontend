import { toast } from "react-toastify";
import ApiClient from "../../api-client";
import Environment from "../../environment";

export const submitFeedback = (data, callback = () => { }) => {
    return async (dispatch) => {
        try {
        const response = await ApiClient.post
            (`${Environment.BASE_URL}/feedback/createFeedback`,
            data
        );
        if (response.statusCode === 201) {
            toast.success("Feedback submitted successfully");
        } else {
            toast.error("Failed to submit feedback");
        }
        } catch (error) {
        toast.error("An error occurred while submitting feedback");
        }
    };
    }