import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import PlaneIcon from "../../assets/images/AirplaneTilt.svg";
import calenderIcon from "../../assets/images/CalendarBlank.svg"
import ClockIcon from "../../assets/images/ClockCountdown.svg";
import timeControl from "../../assets/images/HourglassMedium.svg";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ActionType } from '../../redux/action-types';



const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];



export default function JobPostTitle() {
    const [value, setValue] = useState('');
    const [roleType, setRoleType] = useState()

    const { jobDetails } = useSelector((state) => state.jobposting)

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleChange = (event) => {
        setRoleType(event.target.value);
    };


    useEffect(() => {
        if (jobDetails) {
            setRoleType(jobDetails?.hiringTimeline)
        }
    }, [])

    const handleContinue = () => {
        if (roleType) {
            let jobPostingDetails = {
                ...jobDetails,
                hiringTimeline: roleType
            }
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: jobPostingDetails,
            });
            navigate('/job-range')
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
                    <div className="d-flex job-inner-row align-items-center gap-3">
                        <div className="text-col ">

                            <h6 className='heading-stepper'><span>4/6</span>Post an Opportunity</h6>

                            <h2 className='job-head-col'>When do you need them to start?</h2>

                            <p className='job-para'>This increases proposals from talent in specific region, but still opens your opportunities post to all candidates.</p>

                        </div>

                        <div className="input-col">


                            <div class="grid-wrapper justify-content-center job-grid-wrapper">
                                <div className="grid-inner-wrapper">
                                    <label class="radio-card" for="radio-card-1">
                                        <input type="radio"
                                            name="radio-card"
                                            id="radio-card-1"
                                            value={"ASAP"}
                                            onClick={handleChange}
                                            checked={roleType == "ASAP"}
                                        />
                                        <div class="card-content-wrapper">

                                            <div class="card-content text-center d-flex justify-content-center align-items-center gap-2">
                                                <img src={ClockIcon} alt="clock-icon" className='m-0' />
                                                <h5 className='text-radio m-0'>ASAP</h5>
                                            </div>
                                            <span class="check-icon"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid-wrapper job-role-row new-job-role">
                                <div className="grid-inner-wrapper">
                                    <label class="radio-card" for="radio-card-2">
                                        <input type="radio"
                                            name="radio-card"
                                            id="radio-card-2"
                                            value={"Within 2 months"}
                                            onClick={handleChange}
                                            checked={roleType == "Within 2 months"}
                                        />
                                        <div class="card-content-wrapper">
                                            <div class="card-content text-centerr d-flex justify-content-center align-items-center gap-2">
                                                <img src={timeControl} alt="clock-icon" className='m-0' />
                                                <h5 className='text-radio m-0'>Within 2 months</h5>
                                            </div>
                                            <span class="check-icon"></span>
                                        </div>
                                    </label>
                                </div>

                                <div className="grid-inner-wrapper">
                                    <label class="radio-card" for="radio-card-3">
                                        <input type="radio"
                                            name="radio-card"
                                            id="radio-card-3"
                                            value={"More than 2 months"}
                                            checked={roleType == "More than 2 months"}
                                            onClick={handleChange} />
                                        <div class="card-content-wrapper">

                                            <div class="card-content text-centerr d-flex justify-content-center align-items-center gap-2">
                                                <img src={calenderIcon} alt="clock-icon" className='m-0' />
                                                <h5 className='text-radio m-0'>More than 2 months</h5>
                                            </div>
                                            <span class="check-icon"></span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between end-btn-row py-5">
                    <div>
                        <button className='btn back border-0 bg-transparent' type='button' onClick={() => navigate('/job-commitment')} >Back</button>
                    </div>

                    <div>
                        <button className=" btn btn-primary" type='button' onClick={() => handleContinue()}>Continue</button>
                    </div>
                </div>



            </div>


        </div>
    )
}
