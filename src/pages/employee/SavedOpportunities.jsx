import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Button, InputGroup, FormControl } from 'react-bootstrap';
import searchIcon from "../../assets/images/search-icon.svg";
import NotionIcon from "../../assets/images/notion.png";
import locationIcon from "../../assets/images/location.svg";
import clockIcon from "../../assets/images/Clock.svg";
import euroIcon from "../../assets/images/euro.svg";
import sellIcon from "../../assets/images/sell.svg";
import avatarIcon from "../../assets/images/Avatar.png";
import editIcon from "../../assets/images/edit-icon.svg";
import JobImg from "../../assets/images/ui.png";
import JobImg2 from "../../assets/images/ui-2.png";
import jobImg3 from "../../assets/images/ui-3.png";
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyJob, getSavedJobByUser, saveJob } from '../../redux/actions/employee';
import { GetSalaryFormat, blankProfile } from '../../util/UtilFunction';
import useDebounce from '../../customHook/useDebounce';
import { useTranslation } from "react-i18next";
import Loading from '../../components/loader';



export default function SavedOpportunities() {

    const [sortBy, setSortBy] = useState("recent");
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')

    const [totalPages, setTotalPages] = useState(1);
    const [loader, setLoader] = useState(false)
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 500);


    //Redux State
    const { savedJobsList } = useSelector((state) => state.employee)
    const { userDetails } = useSelector((state) => state.user)

    console.log('savedJobsList', savedJobsList)

    const navigate = useNavigate()
    const dispatch = useDispatch()



    const handleSearchBar = (e) => {
        setSearchText(e.target.value);
    };

    //Get Saved Opportunity
    const getSavedOpportunity = (userId) => {
        setLoader(true)
        let param = {
            order_by: -1,
            order: 1,
            sortBy: sortBy,
            page_size: pageSize,
            page: currentPage,
        };
        if (debouncedSearchText) {
            param.search = debouncedSearchText;
        }
        dispatch(getSavedJobByUser(userId, param, (result) => {
            console.log('result', result)
            if (result.status) {
                setLoader(false)
                setTotalPages(result?.data?.totalPages);
            }
        }))

        setLoader(false)

    }

    const handleTypeofFilter = (e) => {
        setSortBy(e.target.value)
    }

    //Apply Job
    const applyJobApplicant = (job_id) => {
        let _data = {
            applicant: userDetails?._id,
            appliedJob: job_id,
        };
        dispatch(
            applyJob(_data, (result) => {
                if (result?.status) {
                    if (userDetails) {
                        getSavedOpportunity(userDetails?._id);
                    }
                }
            })
        );
    };


    useEffect(() => {
        if (userDetails) {
            getSavedOpportunity(userDetails?._id)
        }
    }, [userDetails, currentPage, sortBy, debouncedSearchText])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Handle Job Details
    const handleJobDetails = (job_id) => {
        navigate(`/job-description/${job_id}`)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    }

    useEffect(() => {
        scrollToTop()
    }, [])

    //Save Job
    const unsaveJob = (job_id) => {
        let _data = {
            jobId: job_id,
        };
        dispatch(
            saveJob(_data, (result) => {
                console.log("result", result);
                if (result?.status) {
                    if (userDetails) {
                        getSavedOpportunity(userDetails?._id);
                    }
                }
            })
        );
    };


    return (
        <div>
            {loader && <Loading />}
            <div className="container">
                <div className="saved-opportunites-col pt-xl-5 pt-3">
                    <h2 className='heading-col'>{landingContent?.employeeDashboard?.savedOpportunity?.heading}</h2>
                    <p className='para-header'>{landingContent?.employeeDashboard?.savedOpportunity?.description}</p>

                    <div className="d-flex gap-3">

                        <InputGroup className="input-search saved-input-items">
                            <input type="search"
                                placeholder={landingContent?.employeeDashboard?.savedOpportunity?.searchButton}
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                onChange={handleSearchBar}
                            />

                            <img src={searchIcon} alt="search-icon" />
                        </InputGroup>
                        <select
                            name="sort-by"
                            id="sort-by"
                            placeholder="Sort by"
                            className="select-employer-dashboard px-4 saved-input-items"
                            value={sortBy}
                            onChange={handleTypeofFilter}
                        >
                            {/* <option value="" disabled={true}>Sort by</option> */}
                            <option value="recent">Recent</option>
                            <option value="a-z">A - Z</option>
                            <option value="z-a">Z - A</option>



                        </select>
                        {/* <button className="btn btn-search btn-primary">{landingContent?.employeeDashboard?.savedOpportunity?.searchButton}</button> */}

                    </div>



                    <div>

                        {savedJobsList && savedJobsList?.docs?.map((job) => (
                            <div className="inner-job-wrapper" key={job?._id} onClick={() => handleJobDetails(job?.jobInfo?._id)}>
                                <div className='img-col'>
                                    <img src={(job?.jobInfo?.EmployerData && job?.jobInfo?.EmployerData?.image !== "") ? job?.jobInfo?.EmployerData?.image : blankProfile()} alt="icon" className='job-logo' />
                                </div>
                                <div className='job-details-col'>
                                    <div className="d-flex flex-col justify-content-between pb-3">
                                        <div>
                                            <span className='name-col'>{job?.jobInfo?.EmployerData?.businessName}</span>
                                            <h4 className='job-title-col'>{job?.jobInfo?.name}</h4>
                                        </div>
                                        <div>
                                            <button className="btn btn-outline" type='button' onClick={(e) => { e.stopPropagation(); unsaveJob(job?.jobInfo?._id) }}>Unsave</button>
                                            {/* <button className="btn btn-primary" type='button' disabled={job?.jobInfo?.hasUserApplied} onClick={() => applyJobApplicant(job?.jobInfo?._id)}>Apply now</button> */}
                                        </div>

                                    </div>
                                    <div className="d-flex bottom-text-jobs align-items-center">
                                        <div>
                                            <span className='d-flex align-items-center'><img src={locationIcon} alt="icon" className='pe-2' />{job?.jobInfo?.address?.country ? job?.jobInfo?.address?.country : 'N/A'}</span>
                                        </div>
                                        <div className='bottom-text-jobs new-bottom-text-jobs'>
                                            <span className='dot-col'>.</span>
                                            <span className='d-flex align-items-center'><img src={clockIcon} alt="icon" className='pe-2' />{job?.jobInfo?.commitmentType}</span>
                                        </div>
                                        <div className='bottom-text-jobs new-bottom-text-jobs'>
                                            <span className='dot-col'>.</span>
                                            <span className='d-flex align-items-center'>{/*<img src={euroIcon} alt="icon" className='pe-2' />*/}{GetSalaryFormat(job?.jobInfo?.payType, job?.jobInfo?.payScale)}</span>
                                        </div>
                                        <div className='bottom-text-jobs new-bottom-text-jobs'>
                                            <span className='dot-col'>.</span>
                                            <span><img src={sellIcon} alt="icon" className='pe-2' />{job?.jobInfo?.JobTypeData?.typeName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {savedJobsList?.docs == 0 && <div className="no-candidate-info" >No saved opportunities found!</div>}

                        <div className="text-center candidate-icon-col mb-5 mt-5">
                            <button
                                className="btn btn-outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {landingContent?.pagination?.previousButton}
                            </button>
                            <span className='mx-3'>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn btn-outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {landingContent?.pagination?.nextButton}
                            </button>
                        </div>

                    </div>

                </div>

            </div>


        </div>
    )
}
