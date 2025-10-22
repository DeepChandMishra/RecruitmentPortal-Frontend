import React, { useEffect, useState, useTransition } from 'react';
import { getUsersDetails } from '../../../redux/actions/common';
import EyeIcon from "../../../assets/images/password-icon.svg";
import { login, socialLogin } from '../../../redux/actions/user';
import FacebookIcon from "../../../assets/images/fb-icon.svg";
import { loginSchema } from '../../../util/validationSchema';
import eyeClose from "../../../assets/images/eye-close.svg";
import GoogleIcon from "../../../assets/images/google.svg";
import loginImg from "../../../assets/images/login.png";
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import './login.css';
import { ActionType } from '../../../redux/action-types';
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from 'react-i18next';
import { languageMultiList } from '../../../util/contant';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState()

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)



  //Redx State
  const { userDetails } = useSelector((state) => state.user)

  const socketId = localStorage.getItem("socketId");
  const rememberMe = Cookies.get('rememberMe') === 'true';
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Use Form Define
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle login submission
  const loginUser = async (data) => {
    try {
      setIsLoading(true);
      const userDataDetails = {
        email: data?.email,
        password: data?.password,
      };
      dispatch(login(userDataDetails, (result) => {
        if (result.statusCode === 200) {

          console.log(result.data.user.createdAt, 'create');
          const createdAt = new Date(result.data.user.createdAt);
          const currentTime = new Date();
          const timeDifference = (currentTime - createdAt);
          const remainingTime = (72 * 60 * 60 * 1000) - timeDifference;
          localStorage.setItem('remainingTime', remainingTime)
          getUserDetails(result?.data?.user?.id)
          let detailsVerify = result?.data?.user?.detailAdded;
          let userData = result?.data?.user;
          const userId = result?.data?.user?.id;
          localStorage.setItem('userId', userId);
          const _data = { userId, socketId };

          // Store cookies for remember me
          if (data.rememberMe) {
            Cookies.set('email', data.email, { expires: 180 });
            Cookies.set('password', data.password, { expires: 180 });
            Cookies.set('rememberMe', true, { expires: 180 });
          } else {
            Cookies.remove('email');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          window.socketIO.emit('updateSocketId', _data);
          if (!detailsVerify && userData.role == 'employee') {
            dispatch({
              type: ActionType.EMPLOYEE_DETAILS,
              payload: {},
            });
            navigate('/details-title')
          } else if (detailsVerify && userData.role == 'employee') {
            navigate('/employee-dashboard')
          }
          else if (!detailsVerify && userData.role == 'employer') {
            dispatch({
              type: ActionType.EMPLOYER_DETAILS,
              payload: {}
            });
            navigate('/details-employer');
          }
          else if (!result?.data?.subscriptionDetails && userData.role == 'employer' && detailsVerify) {
            navigate('/details-organization-plan')
          }
          else if (detailsVerify && userData.role == 'employer') {
            dispatch({
              type: ActionType.TIME_LEFT,
              payload: remainingTime > 0 ? remainingTime : 0
            });
            navigate('/employer-dashboard')
          }
          else {
            navigate('/')
          }
        }
      }));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  //Handle Google Login 
  const handleGoogleLogin = (credentialResponse) => {

    let credentialDetails = jwtDecode(credentialResponse.credential)
    let userDataDetails = {
      'email': credentialDetails?.email
    }
    dispatch(socialLogin(userDataDetails, (result) => {
      if (result.status) {
        console.log(result.data.user.createdAt, 'create');
        const createdAt = new Date(result.data.user.createdAt);
        const currentTime = new Date();
        const timeDifference = (currentTime - createdAt);
        const remainingTime = (72 * 60 * 60 * 1000) - timeDifference;
        localStorage.setItem('remainingTime', remainingTime)
        getUserDetails(result?.data?.user?.id)
        let detailsVerify = result?.data?.user?.detailAdded;
        let userData = result?.data?.user;
        const userId = result?.data?.user?.id;
        localStorage.setItem('userId', userId);
        const _data = { userId, socketId };
        window.socketIO.emit('updateSocketId', _data);
        if (!detailsVerify && userData.role == 'employee') {
          dispatch({
            type: ActionType.EMPLOYEE_DETAILS,
            payload: {},
          });
          navigate('/details-title')
        } else if (detailsVerify && userData.role == 'employee') {
          navigate('/employee-dashboard')
        }
        else if (!detailsVerify && userData.role == 'employer') {
          dispatch({
            type: ActionType.EMPLOYER_DETAILS,
            payload: {}
          });
          navigate('/details-employer');
        }
        else if (detailsVerify && userData.role == 'employer') {
          navigate('/employer-dashboard')
        }
        else {
          navigate('/')
        }
      }
      else {
        const socailLogin = {
          "firstname": credentialDetails?.given_name,
          "lastname": credentialDetails?.family_name,
          "email": credentialDetails?.email,
          "image": credentialDetails?.picture,
          socailLogin: true
        };
        navigate('/welcome', { state: socailLogin })
      }
      setIsLoading(false);
    }));

  }

  // Wrap input value updates with startTransition
  const handleChange = (event) => {
    const { name, value } = event.target;
    startTransition(() => {
      setValue(name, value, { shouldValidate: true });
    });
  };

  // Wrap login user function with startTransition
  const onSubmit = (data) => {
    startTransition(() => {
      loginUser(data);
    });
  };

  //handleSignup
  const handleSignup = () => {
    const socailLogin = {
      socailLogin: false
    };
    dispatch({
      type: ActionType.USER_REGISTRATION_ROLE,
      payload: ''
    });
    navigate('/welcome', { state: socailLogin })
  }

  const getUserDetails = (user_id) => {
    let param = {
      "timezone": timezone,
      "timezoneOffset": timezoneOffset
    }
    dispatch(getUsersDetails(user_id, param, (result) => { }));
  }


  useEffect(() => {
    const savedEmail = Cookies.get('email');
    const savedPassword = Cookies.get('password');

    if (Cookies.get('rememberMe') === 'true') {
      setValue('email', savedEmail || '');
      setValue('password', savedPassword || '');
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    console.log("asdad", languageValue);
    setLanguage(languageValue);
    i18n.changeLanguage(languageValue);
  };

  return (
    <div className='cardcontrols'>
      <div className="logo-block text-center mb-5">

        <Link to='/' className='homepage-navigation'>
          <h5 className='back-to-homepage'>Back to homepage</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="cards">
        <div className="titlecards">{landingContent?.signup?.signInLabel}</div>
        <div className="formdesign">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formControls">
              <label className='customeLabel'>{landingContent?.signup?.email_input_label}</label>
              <input
                type="text"
                className="authfields"
                {...register('email')}
                onChange={handleChange}
                placeholder='Email address'
                autoComplete='off'
              />
              {errors.email && <div className="errorMsg">{errors.email.message}</div>}
            </div>

            <div className="formControls">
              <label className='customeLabel'>{landingContent?.signup?.password_input_label}</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="authfields"
                  placeholder='Password'
                  {...register('password')}
                  onChange={handleChange}
                  autoComplete='off'
                />
                <button type='button' onClick={togglePasswordVisibility} className='icon-password border-0 bg-transparent'>
                  <img
                    src={showPassword ? EyeIcon : eyeClose}
                    alt="Toggle Password Visibility"
                    className='eye-close-password'

                  />
                </button>
              </div>
              {errors.password && <div className="errorMsg">{errors.password.message}</div>}
            </div>

            <div className="formControls d-flex align-items-center justify-content-between">
              <div className='checkboxdesign'>
                <label htmlFor="rememberMe">
                  <input type="checkbox" id="rememberMe" {...register('rememberMe')} />
                  <div className="checkbox__checkmark"></div>
                  <span>{landingContent?.signup?.rememberme_label}</span>
                </label>
              </div>
              <Link className='links' to="/forgetpassword">{`${landingContent?.signup?.forgot_password_label}?`}</Link>
            </div>

            <div className="formControls">
              <button className='btn btn-primary w-100' type='submit' disabled={isLoading}>
                {isLoading ? `${landingContent?.signup?.signing_label}` : `${landingContent?.signup?.signInLabel}`}
              </button>
            </div>

            <div className="formControls text-center">{landingContent?.signup?.or_label}</div>

            <div className='googleLogin'>
              <div className="formControls text-center">
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    handleGoogleLogin(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>
            </div>

            <div className="formControls text-center pt-3">
              <p onClick={() => handleSignup()} className='form-text-light'>{`${landingContent?.signup?.noAccount_label}?`} <span className='links'>{landingContent?.signup?.register_label}</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
