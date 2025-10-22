import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import DropdownIcon from "../../../assets/images/arrow-dropdown.svg";
import { selectPlanSchema } from '../../../util/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import '../../../assets/css/card.css';
import { checkout, getPlan, getPlanDetails } from '../../../redux/actions/stripe';
import Logo from "../../../assets/images/logo.svg";

const SelectPlan = () => {

    const [selectedPlan, setSelectedPlan] = useState()

    //Redux State
    const { employeeDetails } = useSelector((state) => state.user);
    const { planList } = useSelector((state) => state.stripe)
    const { userDetails } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Use Form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(selectPlanSchema),
    });


    //Get Employee Plan List.
    useEffect(() => {
        dispatch(getPlan('employee', (result) => {
            console.log('result', result)
        }))
    }, [])

    const onSubmit = (data) => {
        console.log(data);
        const _data = {
            userId: userDetails?._id,
            planId: data?.plan
        }

        dispatch(checkout(_data, (result) => {
            window.open(result?.data?.url);
        }))
        // Replace with your next page route
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        getPlanDetail(value)
        setValue(name, value, { shouldValidate: true });
    };

    //Get plan Details
    const getPlanDetail = (_id) => {
        dispatch(getPlanDetails(_id, (result) => {
            if (result.status) {
                setSelectedPlan(result.data)
            }
        }))
    }

    return (

        <>
            <div className='cardcontrols'>
                <div className="logo-block text-center mb-5">
                    <Link to='/' className='homepage-navigation'>
                        <h5 className='back-to-homepage'>Back to homepage</h5>
                        <img src={Logo} alt="logo" />
                    </Link>
                </div>
                <div className="cards">
                    <div className="titlecards">
                        Add Your Details
                    </div>
                    <div className="formdesign">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="formControls">
                                <label className='customeLabel'>
                                    Select Your  Plan
                                </label>
                                <select
                                    className="form-select authfields"
                                    {...register('plan')}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Your  Plan</option>
                                    {
                                        planList && planList.map((o, i) => (
                                            <option value={o?._id} key={i}>{o.title}</option>
                                        ))
                                    }
                                </select>
                                {errors.plan && <div className="errorMsg">{errors.plan.message}</div>}
                                <div className="text-end pt-2 pb-5">
                                    {selectedPlan && <a type='button' className='link-col' data-bs-toggle="modal" data-bs-target="#exampleModal">Click here to View Plan details</a>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="formControls mt-5">
                                    <button
                                        className='btn border-0 bg-transparent btn-back w-100'
                                        type="button"
                                        onClick={() => navigate(-1)} // Go back to the previous page
                                    >
                                        Back
                                    </button>
                                </div>
                                <div className="formControls mt-5">
                                    <button
                                        className='btn btn-primary w-100'
                                        type="submit"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </div>


            {/* Plan Modal  */}
            <div
                className="modal modal-plans-tabs fade"
                id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Plan Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="cards-tab">
                                <div className="title-card">
                                    <h3>{selectedPlan?.title}</h3>
                                    <h4>{`$${selectedPlan?.amount}`}</h4>
                                    <span>{`per user/${selectedPlan?.planType}, billed annually`}</span>
                                </div>
                                <div className="body-card">
                                    <h5>show details</h5>
                                    <p dangerouslySetInnerHTML={{ __html: selectedPlan?.description }}></p>

                                    <div className='text-center'>
                                        <button className='get-started' data-bs-dismiss="modal" >Get Started</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>



            </div>

        </>
    )
}

export default SelectPlan;
