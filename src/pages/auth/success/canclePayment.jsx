import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import successSetup from "../../../assets/images/setup-success.svg";
import { verifyUser } from '../../../redux/actions/user';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Logo from "../../../assets/images/logo.svg";



const CanclePayment = () => {


    const param = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const verifyRegisteredUser = async () => {
        navigate('/')
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

                    <h2>Thank You</h2>
                    <img src={successSetup} alt="image" />
                </div>
                <div className="formdesign">
                    <form>
                        <div className="formControls">
                            <label className='customeLabel'>
                                <p>Payment unsuccessfull!</p>
                            </label>
                        </div>

                        <div className="">
                            <div className="formControls text-center">
                                {/* <button className='btn btn-secondary w-100' type="button" onClick={() => verifyRegisteredUser()}>Retry</button> */}
                                <button className='btn btn-primary w-100 mt-3' type="button" onClick={() => navigate('/')}>Home</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default CanclePayment;