import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import CandidateImg from "../../../assets/images/candidate.svg";
import EmployerImg from "../../../assets/images/employee.svg";
import { ActionType } from '../../../redux/action-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { socialSocialSignUp } from '../../../redux/actions/user';
import { getPlan } from '../../../redux/actions/stripe';
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from 'react-i18next';



const WelcomeCandidate = () => {

    const [isLoading, setIsLoading] = useState(false)

    //Redux State
    const { registrationRole } = useSelector((state) => state.user)

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const socialLogin = location?.state?.socailLogin
    const socketId = localStorage.getItem("socketId");

    // Handle Role Selection .
    const handleRoleType = (type) => {
        dispatch({
            type: ActionType.USER_REGISTRATION_ROLE,
            payload: type
        });
    }

    const handlePageChange = () => {
        if (registrationRole == '')
            toast.error('Please select role!')
        else if (!socialLogin)
            navigate('/signup')
        else {
            let _data = location.state;
            delete _data?.socailLogin;
            _data.role = registrationRole
            registeredUser(_data)
        }
    }

    const handleBackHomePage = () => {
        dispatch({
            type: ActionType.USER_REGISTRATION_ROLE,
            payload: ''
        });

        navigate('/')
    }

    const registeredUser = async (data) => {
        try {
            setIsLoading(true);
            dispatch(socialSocialSignUp(data, (result) => {
                if (result.status) {
                    let detailsVerify = result?.data?.user?.detailAdded;
                    let userData = result?.data?.user;
                    console.log('result', result)
                    const userId = result?.data?.user?.id;
                    const _data = { userId, socketId };
                    window.socketIO.emit('updateSocketId', _data);
                    if (!detailsVerify && userData.role == 'employer') {
                        navigate('/details-employer')
                    }
                    else if ((!detailsVerify && userData.role == 'employee')) {
                        navigate('/details-title')
                    }
                    else {
                        navigate('/')
                    }
                }
                setIsLoading(false);
            }));
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };


    return (
        <div className='cardcontrols'>
            <div className="logo-block text-center mb-5">
                <Link to='/' className='homepage-navigation'>
                    <h5 className='back-to-homepage'>Back to homepage</h5>
                    <img src={Logo} alt="logo" />
                </Link>
            </div>
            <div className="cards text-center">
                <div className="titlecards pb-2">

                    <h2>{landingContent?.signup?.welcomeHeading}</h2>
                    {/* <img src={successSetup} alt="image" /> */}
                </div>


                <div className='parent-progress pt-2'>
                    <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="progress new-progress" role="progressbar" aria-label="Basic example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar"></div>
                    </div>
                </div>

                <div className="formdesign">
                    <form>
                        <div className="formControls">
                            <label className='customeLabel'>
                                <p>{landingContent?.signup?.welcome_description}</p>
                            </label>
                        </div>

                        <div className="radio-images d-flex justify-content-between pb-5 gap-4">
                            <label className="img-btn" onClick={() => handleRoleType('employee')}>
                                <input type="radio" name="country-flags" className="img-input" checked={registrationRole == 'employee'} />
                                <div className="content-wrapper">
                                    <img src={CandidateImg} alt="candidate-image" className='img-fluid pb-2' />
                                    <h4 className='text-col'>{landingContent?.signup?.candidate_label}</h4>
                                </div>
                            </label>

                            <label className="img-btn" onClick={() => handleRoleType('employer')}>
                                <input type="radio" name="country-flags" className="img-input" checked={registrationRole == 'employer'} />
                                <div className="content-wrapper">
                                    <img src={EmployerImg} alt="employer-image" className='img-fluid pb-2' />
                                    <h4 className='text-col'>{landingContent?.signup?.employer_label}</h4>
                                </div>
                            </label>

                        </div>

                        <div className="d-flex btn-row justify-content-between">
                            <div className="formControls ">
                                <button className='btn btn-outline back' type='button' onClick={handleBackHomePage}>{landingContent?.signup?.back_buttonn}</button>
                            </div>

                            <div className="formControls text-center">
                                {!socialLogin && <button className='btn btn-primary w-100' type='button' onClick={() => handlePageChange()}>{landingContent?.signup?.next_button}</button>}
                                {socialLogin && <button className='btn btn-primary w-100' type='button' onClick={() => handlePageChange()}>{landingContent?.signup?.signInLabel}</button>}
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default WelcomeCandidate