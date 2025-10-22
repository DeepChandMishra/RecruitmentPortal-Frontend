import React, { Component, Suspense, lazy, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from './components/toaster';
// import routers from './routes';
import Messages from './pages/dashboard/messages';
import { SocketProvider, useSocket } from './context/socketContext.jsx';
import PublicRoutes from './routes/PublicRoutes';
import { getUsersDetails } from './redux/actions/common';
import { ActionType } from './redux/action-types';
import { useAutoLogout } from './customHook/useAutoLogout';


const App = () => {

  const dispatch = useDispatch()
  const socketId = localStorage.getItem("socketId");
  const socket = useSocket()
  console.log("🚀 ~ App ~ socket:", socket?.id)
  let userId = localStorage.getItem('userId')
  let _token = localStorage.getItem('_itoken')
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


  //Get User Details
  const getUserDetails = (user_id) => {
    let param = {
      "timezone": timezone,
      "timezoneOffset": timezoneOffset
    }
    dispatch(getUsersDetails(user_id, param, (result) => { }));
  }


  useAutoLogout(userId);
  useEffect(() => {
    if (userId && _token) {
      dispatch({
        type: ActionType.IS_AUTHENTICATE,
        payload: true
      });
      getUserDetails(userId)
    }
    else {
      dispatch({
        type: ActionType.LOGOUT,
        payload: null
      });
    }
  }, [])

  useEffect(() => {
    if (userId) {
      let socketId = socket?.id
      const _data = { userId, socketId };
      window?.socketIO?.emit('updateSocketId', _data);
      console.log("🚀 ~ useEffect ~ _data:", _data)
      console.log("🚀 ~ useEffect ~ socketId:");
    }
  }, [socket])



  return (
    <GoogleOAuthProvider
      clientId="28588358542-hfmvl3higdbabrmhvq89q1cvtfhunigl.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
      <PublicRoutes />
      <Toaster />
    </GoogleOAuthProvider>
  );
}

export default App;
