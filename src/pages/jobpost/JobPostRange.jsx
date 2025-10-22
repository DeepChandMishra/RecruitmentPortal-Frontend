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
import { payTypeList } from '../../util/contant';
import { toast } from 'react-toastify';
import { ActionType } from '../../redux/action-types';
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
    const [payType, setPayType] = useState();
    const [rateFrom, setRateFrom] = useState(0);
    const [rateTo, setRateTo] = useState(0);


    const { jobDetails } = useSelector((state) => state.jobposting)
    console.log("🚀 ~ JobPostTitle ~ jobDetails:", jobDetails)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handlePayTypeChange = (event) => {
        setPayType(event.target.value);
    };


    useEffect(() => {
        if (jobDetails) {
            setPayType(jobDetails?.payType)
            setRateFrom(jobDetails?.payScale?.from)
            setRateTo(jobDetails?.payScale?.to)
        }
    }, [])

    const handleContinue = () => {
        if (payType) {
            if ((payType == "Hourly rate" || payType == "Annual salary")) {
                // Convert rateFrom and rateTo to numbers to ensure proper comparison
                const rateFromNum = Number(rateFrom);
                const rateToNum = Number(rateTo);
                console.log('rate from', rateFromNum, 'rate to', rateToNum);
    
                

                // Check if rateFrom or rateTo are less than 0
                if (rateFromNum < 0 || rateToNum < 0) {
                    return toast.error("Amount fields cannot be less than 0");
                }

                if (rateFromNum == 0 || rateToNum == 0) {
                    return toast.error("No salary range indicated");
                }
    
                // Check if rateFrom is greater than rateTo
                console.log('rate from', rateFromNum, 'rate to', rateToNum);
                if (rateFromNum > rateToNum) {
                    return toast.error("Rate on right should be greater than rate on left");
                }
    
                // If everything is valid, proceed with job details
                let jobPostingDetails = {
                    ...jobDetails,
                    payType: payType,
                    payScale: {
                        "from": rateFromNum,
                        "to": rateToNum
                    },
                };
    
                dispatch({
                    type: ActionType.JOB_DETAILS,
                    payload: jobPostingDetails,
                });
                navigate('/job-info');
            }
            else {
                // If payType is not "Hourly rate" or "Annual salary", continue without payScale
                let jobPostingDetails = {
                    ...jobDetails,
                    payType: payType,
                };
                dispatch({
                    type: ActionType.JOB_DETAILS,
                    payload: jobPostingDetails,
                });
                navigate('/job-info');
            }
        }
        else {
            toast.error("Please select opportunity");
        }
    };
    

    const formatRate = (rate) => {
        if (!rate) return '';
        return rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };

    const parseRawInput = (formattedRate) => {
        return formattedRate.replace(/'/g, '');
    };

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


                <div className="job-wrapper job-wrapper-range">



                    <div className="d-flex job-inner-row align-items-center">
                        <div className="text-col col-4">

                            <h6 className='heading-stepper'><span>5/6</span>Post an Opportunity</h6>

                            <h2 className='job-head-col'>You're almost done. Tell us about the salary range for this opportunity</h2>

                            <p className='job-para'>Adding a pay range can be very helpful for candidates and boost your posting.</p>

                        </div>

                        <div className="input-col col-8 ">


                            <div className="grid-wrapper job-role-row pt-5">


                                {payTypeList.map((o, i) => (
                                    <div className="grid-inner-wrapper" key={o.id}>
                                        <label className="radio-card" htmlFor={`radio-card-${i}`}>
                                            <input
                                                type="radio"
                                                name="radio-card"
                                                id={`radio-card-${i}`}
                                                value={o.name}
                                                checked={payType == o.name}
                                                onClick={handlePayTypeChange}
                                            />
                                            <div className="card-content-wrapper">
                                                <div className="card-content">
                                                    <img src={o.name == 'Hourly rate' ? hourlyRateIcon : o.name == 'Annual salary' ? annualSalaryIcon : o.name == "Contract/Project" ? calenderIcon : o.name == "Prefer not to say" ? preferNotToSayIcon : o.name == "Unpaid" ? unpaidIcon : PlaneIcon} alt="clock-icon" className='pb-2' />
                                                    <h5 className='text-radio'>{o.name}</h5>
                                                </div>
                                                <span className="check-icon"></span>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="formDesign job-range">
                                {(payType == "Hourly rate" || payType == "Annual salary") && <div className="d-flex gap-3 justify-content-between pt-3">
                                    <div className="formControls">
                                        <label className='customeLabel'>
                                            From
                                        </label>

                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                type="text"
                                                className="authfields"
                                                placeholder='$0'
                                                value={formatRate(rateFrom)}
                                                autoComplete='off'
                                                onChange={(e) => setRateFrom(parseRawInput(e.target.value))}
                                            />
                                            <span className='input-span-col'>
                                                {payType == "Hourly rate" ? "/hourly" : "/annually"}
                                            </span>
                                        </div>


                                    </div>

                                    <div className="formControls">
                                        <label className='customeLabel'>
                                            To
                                        </label>

                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                type="text"
                                                className="authfields"
                                                placeholder='$0'
                                                value={formatRate(rateTo)}
                                                autoComplete='off'
                                                onChange={(e) => setRateTo(parseRawInput(e.target.value))}
                                            />
                                            <span className='input-span-col'>
                                                {payType == "Hourly rate" ? "/hourly" : "/annually"}
                                            </span>
                                        </div>

                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="d-flex justify-content-between end-btn-row py-5">
                    <div>
                        <button className='btn back border-0 bg-transparent' type='button' onClick={() => navigate('/job-role')}>Back</button>
                    </div>

                    <div>
                        <button className=" btn btn-primary" type='button' onClick={() => handleContinue()}>Continue</button>
                    </div>
                </div>




            </div>


        </div>
    )
}
