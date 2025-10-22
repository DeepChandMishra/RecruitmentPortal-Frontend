import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ActionType } from "../redux/action-types";
import { logoutUser } from "../redux/actions/common";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
// const INACTIVITY_LIMIT = 10000


export const useAutoLogout = (userId, navigate) => {
    const dispatch = useDispatch();
    const timerRef = useRef(null);

    const userLogout = (user_id) => {
        try {
            dispatch(
                logoutUser(user_id, (result) => {
                    console.log("result", result);
                    if (result.status) {
                        dispatch({ type: ActionType.IS_AUTHENTICATE, payload: false });
                        localStorage.clear();
                        navigate("/"); // redirect to login/home
                    }
                })
            );
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleLogout = () => {
        if (userId) {
            userLogout(userId);
        }
        localStorage.clear();
        console.log("⏳ User logged out due to inactivity.");
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        // Save last activity time in localStorage
        localStorage.setItem("lastActivity", Date.now().toString());

        console.log("🔄 Inactivity timer restarted...");
        timerRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        // 🔍 Check last activity on mount
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity) {
            const elapsed = Date.now() - parseInt(lastActivity, 10);
            if (elapsed > INACTIVITY_LIMIT) {
                handleLogout(); // expired
            } else {
                // Resume remaining time
                timerRef.current = setTimeout(
                    handleLogout,
                    INACTIVITY_LIMIT - elapsed
                );
            }
        } else {
            resetTimer(); // no record, start fresh
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [userId]);
};
