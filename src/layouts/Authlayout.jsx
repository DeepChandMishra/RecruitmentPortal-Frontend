import React, { useEffect, useState } from 'react';
import "./layouts.css";
import sidebannet from "../assets/images/sidebanner.svg";
import loginImg from "../assets/images/social-icons-employer.png";
import signinimage from '../assets/images/sign-in-image.png';
import welcomecandidate from '../assets/images/welcome-candidate.png';
import welcomeemployer from '../assets/images/welcome-employer.png';
import confirmverifycandidate from '../assets/images/confirm-email-candidate.png';
import confirmverifyemployer from '../assets/images/confirm-email-employer.png';
import registercandidate from '../assets/images/register-candidate.png';
import registeremployer from '../assets/images/sign-in-employer.png';
import questionMarkIcon from "../assets/images/question-mark.svg";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Authlayout = ({ children }) => {
  const [renderImage, setRenderImage] = useState()

  //Redux State 
  const { registrationRole } = useSelector((state) => state.user)

  const locaion = useLocation()

  const handleImageRender = () => {
    let pathname = locaion?.pathname;
    if (pathname == '/login') {
      setRenderImage(signinimage)
    }
    else if (pathname == '/welcome') {
      setRenderImage(registrationRole == 'employee' ? welcomecandidate : welcomeemployer)
    }
    else if (pathname == '/signup') {
      setRenderImage(registrationRole == 'employee' ? registercandidate : registeremployer)
    }
    else if (pathname == '/registeredsuccess') {
      setRenderImage(registrationRole == 'employee' ? confirmverifycandidate : confirmverifyemployer)
    }
    else {
      setRenderImage(confirmverifycandidate)
    }
  }

  useEffect(() => {
    handleImageRender()
  }, [locaion, registrationRole])

  return (


    <div className='authLayout'>
      <div className="container-fluid p-0">

        <div className="row auth-row ">
          <div className="login-banner-row p-0">
            <div className="bannerimages">
              <img src={renderImage} alt="banner" className='login-img-col' />
            </div>
          </div>
          <div className="login-row d- block">
            {/* <div class="logo-block text-center mb-5">
              <a class="homepage-navigation" href="/">
              <h5 class="back-to-homepage">Back to homepage</h5>
              <img src="/src/assets/images/logo.svg" alt="logo"/>
              </a>
              </div> */}
            {children}
            <button className='border-0 bg-transparent question-mark-icon'> <img src={questionMarkIcon} alt="icon" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authlayout