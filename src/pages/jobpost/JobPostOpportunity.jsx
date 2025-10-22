import React, { useEffect, useState } from 'react';
import PlaneIcon from "../../assets/images/AirplaneTilt.svg";
import calenderIcon from "../../assets/images/CalendarBlank.svg"
import ClockIcon from "../../assets/images/ClockCountdown.svg";
import timeControl from "../../assets/images/HourglassMedium.svg";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Flight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobTypesList } from '../../redux/actions/jobposting';
import { toast } from 'react-toastify';
import { ActionType } from '../../redux/action-types';
import paidIcon from '../../assets/images/paid-search.svg';
import volunteerIcon from '../../assets/images/volunteer.svg';
import proBanoIcon from '../../assets/images/pro-bano.svg';
import temporayrCoverIcon from '../../assets/images/temporary-cover.svg';





export default function JobPostOpportunity() {

    const [value, setValue] = React.useState('')
    const [selectOpportunity, setSelectOpportunity] = useState()
    const { jobDetails, jobTypeList } = useSelector((state) => state.jobposting)
    console.log('jobDetails', jobDetails, 'dsfsfdsf', jobTypeList)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (event) => {
        setValue(event.target.value);
        console.log('adadasdasd', event.target.value)
        let opportunitiesCreate = {
            ...jobDetails,
            opportunitiesType: event.target.value
        }
        dispatch({
            type: ActionType.JOB_DETAILS,
            payload: opportunitiesCreate,
        });
    };

    console.log('select', selectOpportunity)

    const handleopportunitySelect = (e) => {
        // let filterJobType = jobTypeList.filter((o) => o._id == e.target.value)
        setSelectOpportunity(e.target.value)
    }

    // Get all Designations.
    useEffect(() => {
        dispatch(getJobTypesList((result) => {
            console.log('result>>>', result);
        }));
    }, []);

    useEffect(() => {
        if (jobDetails && Array.isArray(jobDetails?.jobType)) {
            setSelectOpportunity(jobDetails?.jobType[0]?._id)
        }
        else {
            setSelectOpportunity(jobDetails?.jobType)
        }
    }, [])


    const handleContinue = () => {
        if (selectOpportunity) {
            let filterJobType = jobTypeList.filter((o) => o._id == selectOpportunity)
            let jobPostingDetails = {
                ...jobDetails,
                jobType: filterJobType
            }
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: jobPostingDetails,
            });
            navigate('/job-commitment')
        }
        else {
            toast.error("Please select opportunity")
        }
    }


    return (
        <div>
            <div className="container job-post pt-3 pt-xl-5">
                <div className='parent-progress pt-4 pt-xl-2'>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.designation ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.jobType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.commitmentType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.hiringTimeline ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.payType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.description ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>

                <div className="job-wrapper">



                    <div className=" job-inner-row">
                        <div className="text-col">

                            <h6 className='heading-stepper'><span>2/6</span>Post an Opportunity</h6>

                            <h2 className='job-head-col'>What about the type of opportunity?</h2>

                        </div>

                    </div>

                    <div class="grid-wrapper py-2 ">

                        {jobTypeList.map((o, i) => (
                            <div className="grid-inner-wrapper" key={o._id}>
                                <label className="radio-card" htmlFor={`radio-card-${i}`}>
                                    <input
                                        type="radio"
                                        name="radio-card"
                                        id={`radio-card-${i}`}
                                        value={o._id}
                                        checked={selectOpportunity == o._id}
                                        onClick={handleopportunitySelect}
                                    />
                                    <div className="card-content-wrapper">
                                        <div className="card-content">
                                            <img src={o.typeName == 'Pro Bono' ? temporayrCoverIcon : o.typeName == 'Paid' ? paidIcon : o.typeName == "Volunteer" ? volunteerIcon :  proBanoIcon} alt="clock-icon" className='pb-2' />
                                            <h5 className='text-radio'>{o.typeName}</h5>
                                        </div>
                                        <span className="check-icon"></span>
                                    </div>
                                </label>
                            </div>
                        ))}


                    </div>




                </div>

                <div className="d-flex justify-content-between end-btn-row py-5">
                    <div>
                        <button className='btn back border-0 bg-transparent' type="button" onClick={() => navigate('/job-title')}>Back</button>
                    </div>

                    <div>
                        <button className=" btn btn-primary" type='button' onClick={() => handleContinue()}>Continue</button>
                    </div>
                </div>


            </div>
        </div>
    );
}
