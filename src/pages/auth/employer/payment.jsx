import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import DropdownIcon from "../../../assets/images/arrow-dropdown.svg";

const Payment = () => {
    const navigate = useNavigate()
    return (
        <div className='cardcontrols'>
            <div className="cards">
                <div className="titlecards">
                    Add organisation details
                </div>
                <div className="formdesign">
                    <form>
                        <div className="formControls">
                            <label className='customeLabel'>
                                Card number
                            </label>
                            <input type="number" className="authfields" placeholder='1234 1234 1234' autoComplete='off' />
                        </div>


                        <div className="d-flex justify-content-between gap-2">

                            <div className="formControls">
                                <label className='customeLabel'>
                                    Expiration
                                </label>
                                <input type="number" className="authfields" placeholder=' MM / YY' autoComplete='off' />
                            </div>

                            <div className="formControls">
                                <label className='customeLabel'>
                                    CVC
                                </label>
                                <input type="number" className="authfields" placeholder='CVC' autoComplete='off' />
                            </div>

                        </div>


                        <div className="formControls">
                            <label className="customelabel">Country</label>
                            <div class="dropdown">
                                <button class="btn border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Select
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                                <img src={DropdownIcon} alt="dropdown-icon" className='dropdown-icon' />
                            </div>

                        </div>

                        <div className="formControls ">
                            <button className='btn btn-primary payment-button w-100' type='button' onClick={() => navigate('/login')}>Make Payment</button>
                        </div>


                    </form>
                </div>

            </div>
        </div>
    )
}

export default Payment