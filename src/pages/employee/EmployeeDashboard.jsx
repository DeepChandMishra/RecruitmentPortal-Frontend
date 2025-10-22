import React, { useEffect, useState } from 'react';
import NotionIcon from "../../assets/images/notion.png";
import locationIcon from "../../assets/images/location.svg";
import clockIcon from "../../assets/images/Clock.svg";
import euroIcon from "../../assets/images/euro.svg";
import sellIcon from "../../assets/images/sell.svg";
import avatarIcon from "../../assets/images/Avatar.png";
import editIcon from "../../assets/images/edit-icon.svg";
import emojiIcon from "../../assets/images/Emoji.svg";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPrefrenceJobs, applyJob, saveJob } from '../../redux/actions/employee';
import { GetSalaryFormat, blankProfile, getContentByHeading } from '../../util/UtilFunction';
import { useTranslation } from "react-i18next";
import { useSocket } from '../../context/socketContext';
import { pageContent } from '../../redux/actions/cms';
import { getUsersDetails } from '../../redux/actions/common';
import { toast } from 'react-toastify';

export default function EmployeeDashboard() {
    const [loader, setLoader] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showMore, setShowMore] = useState(false);

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    let lang = i18n.language;
    console.log('langlang', lang)

    // Redux state 
    const { prefrenceJobsList } = useSelector((state) => state.employee)
    const { contentData } = useSelector((state) => state.cms);
    const { userDetails } = useSelector((state) => state.user);
    const userId = localStorage.getItem('userId');

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = useSocket()

    // Get all Prefrenced Jobs 
    const getAllPrefrencedJobs = () => {
        let param = {
            order_by: -1,
            order: 1,
            page_size: pageSize,
            page: currentPage,
        };
        dispatch(
            getAllPrefrenceJobs(param, (result) => {
                if (result.status) {
                    setTotalPages(result?.data?.totalPages);
                }
            })
        );
    }

    useEffect(() => {
        getAllPrefrencedJobs()
    }, [pageSize, currentPage])

    // Handle Jobs Details 
    const handleJobDetails = (job_id) => {
        navigate(`/job-description/${job_id}`)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        scrollToTop()
    }, [])

    const handleShowMore = () => {
        setPageSize(pageSize + 10)
    }

    const handleJobSearch = (type) => {
        navigate('/job-search', { state: { type, address: type !== "all" && userDetails?.address } });
    }

    //Get Page Content
    const getPageContent = (page_name) => {
        try {
            dispatch(
                pageContent(page_name, (result) => {
                })
            );
        } catch (error) {
            console.log('Error:', error)
        }
    }

    useEffect(() => {
        getPageContent('Employee Dashboard')
    }, [])
    const getUser = (userId) => {
        let param = {
        };

        dispatch(getUsersDetails(userId, param, (result) => {
            console.log("🚀 ~ getUser ~ reslt:", result?.data?.deleted);
            if (result?.data?.deleted === true) {
                toast.error("Your account has been removed.");

                // Clear user session
                localStorage.clear();

                // Navigate to login page
                navigate('/login');

            }
        }));
    };
    useEffect(() => {
        getUser(userId);
    }
        , [userId]);

    // Save Job 
    const saveJobApplicant = (job_id) => {
        let _data = {
            jobId: job_id,
        }
        dispatch(
            saveJob(_data, (result) => {
                if (result.status) {
                    getAllPrefrencedJobs()
                }
            })
        );
    }

    // Apply Job
    const applyJobApplicant = (job_id) => {
        let _data = {
            applicant: userDetails?._id,
            appliedJob: job_id
        }
        dispatch(
            applyJob(_data, (result) => {
                if (result.status) {
                    getAllPrefrencedJobs()
                }
            })
        );
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <main className='job-main-col'>
                <div className="container">
                    <h2 className='main-heading-col'>{getContentByHeading(contentData?.content, 'Welcome Heading', lang)} <span>{`${userDetails?.firstname} ${userDetails?.lastname}`}.</span> {getContentByHeading(contentData?.content, 'Welcome SubHeading', lang)}  <img src={emojiIcon} alt="image" /> </h2>
                    <p>{getContentByHeading(contentData?.content, 'Welcome Description', lang)}</p>

                    <div className='pt-2 pt-sm-5 text-center mobile-view'>
                        <button className='btn btn-primary btn-main w-50' type='button' onClick={() => handleJobSearch('all')}>{landingContent.employeeDashboard.searchButton}</button>
                    </div>

                    <div className='d-flex py-3 py-md-5 btn-dashboard-main justify-content-between btn-col'>
                        <div className='col-sm-6 col-12'>
                            <button className='btn btn-primary btn-main' type='button' onClick={() => handleJobSearch('Volunteer')}>{landingContent.employeeDashboard.searchButton1}</button>
                        </div>
                        <div className='col-sm-6 col-12'>
                            <button className='btn btn-primary btn-main' type='button' onClick={() => handleJobSearch('Paid')}>{landingContent.employeeDashboard.searchButton2}</button>
                        </div>
                    </div>
                </div>
            </main>

            <section className='job-lists'>
                <div className="container">
                    <div className="d-flex row-main-dashboard">
                        <div className="col-xl-9 job-lists-col">
                            <div className="job-wrapper">
                                <h3 className='wrapper-heading-col'>Opportunities based on your preferences </h3>
                                {prefrenceJobsList?.docs?.length > 0 ? (
                                    prefrenceJobsList.docs.map((job) => (
                                        <div className="inner-job-wrapper" key={job?._id} onClick={() => handleJobDetails(job?._id)}>
                                            <div className='img-col'>
                                                <img
                                                    src={(job?.EmployerData?.image !== "") ? job?.EmployerData.image : blankProfile()}
                                                    alt="icon"
                                                    className='job-logo'
                                                />
                                            </div>

                                            <div className='job-details-col'>
                                                <div className="d-flex flex-col justify-content-between pb-3 align-items-center">
                                                    <div>
                                                        <span className='name-col'>{job?.EmployerData?.businessName}</span>
                                                        <h4 className='job-title-col'>{job?.name}</h4>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline"
                                                            onClick={(e) => { e.stopPropagation(); saveJobApplicant(job?._id); }}
                                                            disabled={job?.isSaved}
                                                        >
                                                            {landingContent.employeeDashboard.jobCardButton1}
                                                        </button>
                                                        {/* {!job?.hasUserApplied ? ( */}
                                                        <button
                                                            className="btn btn-primary new-btn-primary"
                                                            //onClick={(e) => { e.stopPropagation(); applyJobApplicant(job._id); }}
                                                            onClick={() => handleJobDetails(job?._id)}
                                                        >
                                                            {landingContent.employeeDashboard.seemore_button}
                                                        </button>
                                                        {/* // ) : (
                                                        //     <button
                                                        //         className="btn btn-primary"
                                                        //         disabled
                                                        //     >
                                                        //         {landingContent.employeeDashboard.jobCardButton3}
                                                        //     </button>
                                                        // )
                                                        )} */}
                                                    </div>
                                                </div>

                                                <div className="d-flex bottom-text-jobs new-bottom-text-jobs align-items-center">
                                                    <div className='bottom-inner-text job-details-bottom-col'>
                                                        <span><img src={locationIcon} alt="icon" className='pe-2' />{job?.EmployerData?.address?.city}</span>
                                                    </div>

                                                    <div className='bottom-inner-text job-details-bottom-col'>
                                                        <span className='dot-col'>.</span>
                                                        <span className='d-flex align-items-center'>
                                                            <img src={clockIcon} alt="icon" className='pe-2' />{job?.commitmentType}
                                                        </span>
                                                    </div>

                                                    <div className='bottom-inner-text job-details-bottom-col'>
                                                        <span className='dot-col'>.</span>
                                                        <span className='d-flex align-items-center'>{GetSalaryFormat(job.payType, job.payScale)}</span>
                                                    </div>

                                                    <div className='bottom-inner-text job-details-bottom-col job-details-last-col'>
                                                        <span className='dot-col'>.</span>
                                                        <span className='d-flex align-items-center'>
                                                            <img src={sellIcon} alt="icon" className='pe-2' />{job?.JobTypeData?.typeName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-candidate-info">
                                        < div className='no-job-text'>{landingContent?.employeeDashboard?.searchOpportunities?.noSearchMessage}</div>
                                    </div>
                                )}

                                {/* <div className='flex-grow-1 text-end'>
                                        <button type="button" className="btn btn-outline" onClick={(e) => { e.stopPropagation(); saveJobApplicant(job?._id) }}
                                            disabled={job?.isSaved}>{landingContent.employeeDashboard.jobCardButton1}</button>
                                        {!job?.hasUserApplied ? <button className="btn btn-primary new-btn-primary" onClick={(e) => { e.stopPropagation(); applyJobApplicant(job._id) }}
                                        >{landingContent.employeeDashboard.jobCardButton2}</button>
                                            :
                                            <button className="btn btn-primary "
                                                disabled={job?.hasUserApplied}>{landingContent.employeeDashboard.jobCardButton3}</button>
                                        }
                                    </div> */}
                                <div className="text-center candidate-icon-col">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        {landingContent.pagination.previousButton}
                                    </button>
                                    <span class="mx-3">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        {landingContent.pagination.nextButton}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 px-3 profile-row text-center">
                            <div className="user-profile-wrapper text-xl-center">
                                <img src={editIcon} alt="edit" className='edit-icon' onClick={() => navigate('/profile-user')} />
                                <div>
                                    <img src={userDetails?.image !== "" ? userDetails?.image : blankProfile()} alt="profile-icon" className='avatar newAvatar pb-3' width={70} height={70} />
                                </div>
                                <div>
                                    <h4 className='user-name-col'>{`${userDetails?.firstname} ${userDetails?.lastname}`}.</h4>
                                    <h6 className='user-bio'>{userDetails?.title}</h6>
                                    <p className={`user-description ${showMore ? 'show-full' : 'show-limited'}`}>
                                        <p dangerouslySetInnerHTML={{ __html: userDetails?.description }}></p>
                                    </p>
                                    <div className='user-bio mb-2' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</div>


                                    {userDetails.profilePercentage !== '100' && <button className='btn btn-primary' type='button' onClick={() => navigate('/profile-user')}>{landingContent.employeeDashboard.profileButton}</button>}
                                    <div className="employee-dashboard-actionBtn ">
                                        <button className='btn btn-primary mt-3' type='button' onClick={() => navigate('/job-tracker')}>{landingContent.employeeDashboard.applicationButton}</button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
