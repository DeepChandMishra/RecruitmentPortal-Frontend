import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import successSetup from "../../../assets/images/setup-success.svg";
import { verifyUser } from '../../../redux/actions/user';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from 'react-i18next';




const VerifyUserSuccess = () => {


    const param = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    const verifyRegisteredUser = async () => {
        try {
            let _token = param?.id
            if (_token) {
                dispatch(verifyUser(_token, (result) => {
                    if (result.status) {
                        toast.success("Verifed successfully")
                        navigate('/login');
                    }
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='cardcontrols'>
            <div className="logo-block text-center mb-5">
                <Link to='/' className='homepage-navigation'>
                    <h5 className='back-to-homepage'>{landingContent?.signup?.back_buttonn}</h5>
                    <img src={Logo} alt="logo" />
                </Link>
            </div>
            <div className="cards text-center">
                <div className="titlecards pb-2">

                    <h2>{landingContent?.signup?.thankYouLabel}</h2>
                    <img src={successSetup} alt="image" />
                </div>
                <div className="formdesign">
                    <form>
                        <div className="formControls">
                            <label className='customeLabel'>
                                <p>{landingContent?.signup?.verifyDescription}</p>
                            </label>
                        </div>


                        <div className="">
                            <div className="formControls text-center">
                                <button className='btn btn-primary w-100' type="button" onClick={() => verifyRegisteredUser()}>{landingContent?.signup?.verifyButton}</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default VerifyUserSuccess