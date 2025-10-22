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
import { commitmentType } from '../../util/contant';
import { ActionType } from '../../redux/action-types';
import { toast } from 'react-toastify';
import paidIcon from '../../assets/images/salary.svg';
import volunteerIcon from '../../assets/images/volunteer.svg';
import proBanoIcon from '../../assets/images/pro-bano.svg';
import casualIcon from '../../assets/images/casual.svg';
import seasonalIcon from '../../assets/images/seasonal.svg';
import contractIcon from '../../assets/images/contract.svg';
import hourlyRateIcon from '../../assets/images/hourly-rate.svg';
import preferNotToSayIcon from '../../assets/images/prefer-noto-to-say.svg';
import annualSalaryIcon from '../../assets/images/salary.svg';
import unpaidIcon from '../../assets/images/unpaid.svg';



export default function JobPostOpportunity() {

    const [value, setValue] = useState('');
    const [selectCommitment, setSelectCommitment] = useState()

    const { jobDetails, jobTypeList } = useSelector((state) => state.jobposting)
    console.log('jobDetails', jobDetails)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleCommitSelect = (e) => {
        console.log('adasd', e.target.value)
        setSelectCommitment(e.target.value)
    }

    useEffect(() => {
        if (jobDetails) {
            setSelectCommitment(jobDetails?.commitmentType)
        }
    }, [])

    const handleContinue = () => {
        if (selectCommitment) {
            let jobPostingDetails = {
                ...jobDetails,
                commitmentType: selectCommitment
            }
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: jobPostingDetails,
            });
            navigate('/job-role')
        }
        else {
            toast.error("Please select opportunity")
        }
    }


    return (
        <div>
            <div className="container job-post">
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

                            <h6 className='heading-stepper'><span>3/6</span>Post an Opportunity</h6>

                            <h2 className='job-head-col'>What type of commitment are you looking for?</h2>

                            {/* <p className='job-para'>Select one from the drop down menu. If the role is not available, click "other" and type in the role.</p> */}

                        </div>

                    </div>

                    <FormControl>

                        {/* <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Create a new opportunities post" />

                        </RadioGroup> */}
                    </FormControl>
                    <div class="grid-wrapper job-commitment">
                        {commitmentType.map((o, i) => (
                            <div className="grid-inner-wrapper" key={o._id}>
                                <label className="radio-card" htmlFor={`radio-card-${i}`}>
                                    <input
                                        type="radio"
                                        name="radio-card"
                                        id={`radio-card-${i}`}
                                        value={o.name}
                                        checked={selectCommitment == o.name}
                                        onClick={handleCommitSelect}
                                    />
                                    <div className="card-content-wrapper">
                                        <div className="card-content">
                                            <img src={o.name == 'Full time' ? ClockIcon : o.name == 'Part time' ? timeControl : o.name == "Contract/Project" ? contractIcon : o.name == "Casual" ? casualIcon : seasonalIcon} alt="clock-icon" className='pb-2' />
                                            <h5 className='text-radio'>{o.name}</h5>
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
                        <button className='btn back border-0 bg-transparent' type='button' onClick={() => navigate('/job-opportunity')}>Back</button>
                    </div>

                    <div>
                        <button className=" btn btn-primary" type='button' onClick={() => handleContinue()} >Continue</button>
                    </div>
                </div>


            </div>
        </div>
    );
}
