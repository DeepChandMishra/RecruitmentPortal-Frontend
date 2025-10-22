import React, { useEffect, useState } from "react";
import NotionIcon from "../../assets/images/notion.png";
import locationIcon from "../../assets/images/location.svg";
import clockIcon from "../../assets/images/Clock.svg";
import euroIcon from "../../assets/images/euro.svg";
import sellIcon from "../../assets/images/sell.svg";
import profileIcon from "../../assets/images/User.svg";
import fileIcon from "../../assets/images/FileArrowUp.svg";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  applyJob,
  getPrefrenceJobsDetails,
  saveJob,
} from "../../redux/actions/employee";
import { GetSalaryFormat, blankProfile } from "../../util/UtilFunction";
import EmployerCandidatesCards from "../../components/cards/EmployerCandidatesCards";
import { inactiveJob, viewCountOfJob } from "../../redux/actions/jobposting";
import {
  applicantByJobId,
  saveTalentEmployee,
} from "../../redux/actions/employer";
import { ActionType } from "../../redux/action-types";
import { commitmentTypeprofile } from "../../util/contant";
import { jobTypesListing, skillsListing } from "../../redux/actions/common";
import { useTranslation } from "react-i18next";
import Loading from "../../components/loader";

export default function JobDescription() {
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [opportunityType, setOpportunityType] = useState(null);
  const [skillType, setSkillType] = useState(null);
  const [role, setRole] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");

  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewAttachment = () => {
    setIsViewing(true); // Show the attachment when the button is clicked
  };

  const handleCloseView = () => {
    setIsViewing(false); // Close the view of the attachment
  };

  //Redux State
  const { jobDetails } = useSelector((state) => state.employee);
  const { userDetails } = useSelector((state) => state.user);
  const { appliedCandidate } = useSelector((state) => state.employer);
  const { jobType, skills } = useSelector((state) => state.common);

  const userId = localStorage.getItem("userId");
  console.log("jobDetails>>>", jobDetails);

  //Share Opportunity
  const shareOpportunity = () => {
    const shareData = {
      title: "Junior UI Designer at Notion",
      text: "Check out this job opportunity at Notion for a Junior UI Designer!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => toast.success("Link copied to clipboard"))
        .catch((error) => console.error("Error copying to clipboard:", error));
    }
  };

  const getPrefrencedJobsDetails = (id) => {
    setLoader(true);
    dispatch(
      getPrefrenceJobsDetails(id, (result) => {
        {
          setLoader(false);
        }
      })
    );
  };

  const viewJob = (id) => {
    dispatch(viewCountOfJob(id), (result) => {});
  };

  const applicantList = (id) => {
    let param = {
      sortBy: -1,
      limit: 10,
      page: currentPage,
    };
    if (role || opportunityType || skillType) param.query = {};
    if (role) param.query.role = role;
    if (skillType) param.query.skills = [skillType];
    if (opportunityType) param.query.opportunityType = [opportunityType];

    console.log("param", param);
    dispatch(
      applicantByJobId(id, param, (result) => {
        setTotalPages(result?.data?.totalPages);
      })
    );
  };

  const getJobType = () => {
    dispatch(jobTypesListing((result) => {}));
  };

  const getSkills = () => {
    dispatch(skillsListing((result) => {}));
  };

  useEffect(() => {
    getJobType();
    getSkills();
  }, []);

  useEffect(() => {
    if (param.id) {
      getPrefrencedJobsDetails(param.id);
      viewJob(param.id);
    }
  }, [param]);

  useEffect(() => {
    if (param.id) {
      applicantList(param.id);
    }
  }, [param, opportunityType, role, skillType, currentPage]);

  //Clear filter
  const HandleClearFilter = () => {
    setSkillType("");
    setOpportunityType("");
    setRole("");
  };

  const handleTypeofOpportunity = (e) => {
    setCurrentPage(1);
    setOpportunityType(e.target.value);
  };

  const handleTypeofSkills = (e) => {
    setCurrentPage(1);
    setSkillType(e.target.value);
  };

  const handleRole = (e) => {
    setCurrentPage(1);
    setRole(e.target.value);
  };

  const inactiveJobPost = (job_id) => {
    dispatch(
      inactiveJob(job_id, (result) => {
        {
          getPrefrencedJobsDetails(job_id);
        }
      })
    );
  };

  // Download Attached File

  const handleDownloadAttachment = (file) => {
    if (!file) {
      toast.error("No attachment available");
      return;
    }
    // Create an anchor element
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop(); // Use the file name from the URL
    // Append the anchor to the document body and trigger the click event
    document.body.appendChild(link);
    link.click();
    // Clean up and remove the anchor from the document
    document.body.removeChild(link);
    toast.success("Attachment download successfully");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEditOpportunity = (jobData) => {
    dispatch({
      type: ActionType.JOB_DETAILS,
      payload: { ...jobData, createJob: "2", isEditable: true },
    });
    navigate(`/job-title/${jobData?._id}`);
  };

  const saveTalent = (employee_id) => {
    let param = {
      employerId: userId,
      talentId: employee_id,
    };
    dispatch(
      saveTalentEmployee(param, (result) => {
        if (result.status) {
          applicantList(param.id);
        }
      })
    );
  };

  // Applicants handle go to tracker

  const goToTracker = () => {
    navigate("/applicant-tracker");
  };

  return (
    <div>
      {loader && <Loading />}
      <section className="job-description-section">
        <div className="container">
          <div className="job-wrapper">
            <div className="job-des-wrapper">
              <div className="img-col">
                <img
                  src={
                    jobDetails?.EmployerData?.image
                      ? jobDetails?.EmployerData?.image
                      : blankProfile()
                  }
                  alt="icon"
                  className="job-logo"
                />
              </div>
              <div className="job-details-col">
                <div className="d-flex justify-content-between btn-row ">
                  <div>
                    <span
                      className="name-col"
                      onClick={() =>
                        navigate(
                          `/employer-job-candidate/${jobDetails?.EmployerData?._id}`
                        )
                      }
                    >
                      {jobDetails?.EmployerData?.businessName}
                    </span>{" "}
                    <div className="d-flex align-items-center mb-0 active_bage">
                    <h4 className="job-title-col me-5">{jobDetails?.name}</h4>
                    <span className="ms-5 mb-2 opportunity-type-text">{ jobDetails?.isBlocked
                        ? "Not Active"
                        : "Active"}</span></div>
                  </div>
                  <div className="job_des_btn">
                    <button
                      className="btn btn-primary "
                      type="button"
                      onClick={shareOpportunity}
                    >
                      Share Opportunity
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => handleEditOpportunity(jobDetails)}
                    >
                      Edit Opportunity
                    </button>

                    <button
                      className="btn btn-primary "
                      type="button"
                      onClick={() => inactiveJobPost(jobDetails?._id)}
                      disabled={jobDetails?.hasUserApplied}
                    >
                      {jobDetails?.isBlocked
                        ? "Activate Opportunity"
                        : "Deactivate Opportunity"}
                    </button>
                  </div>
                </div>
                <div className="d-flex bottom-text-jobs align-items-center">
                  <span>
                    <img src={locationIcon} alt="icon" className="pe-2" />
                    {jobDetails?.address?.city}
                  </span>
                  <span>
                    <img src={clockIcon} alt="icon" className="pe-2" />
                    {jobDetails?.commitmentType}
                  </span>
                  <span>
                    <img src={sellIcon} alt="icon" className="pe-2" />
                    {jobDetails?.JobTypeData?.typeName}
                  </span>
                </div>

                <div className="d-flex pt-2 bottom-text-jobs align-items-center">
                  <span>
                    {/* <img src={euroIcon} alt="icon"  width="16" height="16" /> */}
                    {GetSalaryFormat(
                      jobDetails?.payType,
                      jobDetails?.payScale
                    )}{" "}
                    {jobDetails?.payScale && ""}
                  </span>
                  {/* <span>
                    {jobDetails?.isBlocked ? (
                      <span> Not Active</span>
                    ) : (
                      <span> Active</span>
                    )}{" "}
                  </span> */}
                </div>
              </div>
            </div>

            <div className="py-sm-5 py-3  d-flex flex-wrap gap-2">
              <h3 className="heading-des-col mb-0">Skill set required</h3>
              <div className="d-flex flex-wrap gap-3">
                {jobDetails &&
                  jobDetails?.SkillsData?.length > 0 &&
                  jobDetails?.SkillsData.map((skill) => (
                    <p className="opportunity-type-text mb-0">
                      {skill?.skillName}
                    </p>
                  ))}
              </div>
            </div>

            {/* <div className="des-wrapper">
                            <li className='para-des-col'>{jobDetails?.description}</li>
                        </div> */}

            <div className="des-wrapper mt-sm-2 mt-2">
              <h3 className="heading-des-col mb-0 pb-2">
                Opportunity description
              </h3>

              <p
                dangerouslySetInnerHTML={{
                  __html: jobDetails?.description,
                }}
              ></p>
            </div>

            <div className="py-sm-5 py-3">
              <h4 className="sender-details-col">
                <img src={profileIcon} alt="icon" className="pe-1" />
                {`Posted by: ${jobDetails?.EmployerData?.firstname} ${jobDetails?.EmployerData?.lastname}`}
              </h4>
              <h4
                className="sender-details-col"
                type="button"
                onClick={() => handleDownloadAttachment(jobDetails?.file)}
              >
                <img src={fileIcon} alt="icon" className="pe-1" />
                Attachment included : {jobDetails?.file ? "Yes" : "No"}
              </h4>

              {jobDetails?.file && (
                <>
                  <button className="btn-primary">Download Attachment</button>
                  <span className="px-2"></span>
                  <button
                    className="btn-primary"
                    onClick={handleViewAttachment}
                  >
                    View Attachment
                  </button>
                </>
              )}

              {isViewing && jobDetails?.file && (
                <div className="attachment-view" style={{ marginTop: "20px" }}>
                  {/* Check the file type and render it accordingly */}
                  {jobDetails.file.endsWith(".jpg") ||
                  jobDetails.file.endsWith(".png") ? (
                    <img
                      src={jobDetails.file}
                      alt="Attachment"
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        height: "100%",
                        marginTop: "20px",
                      }}
                    />
                  ) : jobDetails.file.endsWith(".pdf") ? (
                    <iframe
                      src={jobDetails.file}
                      width="800"
                      height="800"
                      title="Attachment"
                    ></iframe>
                  ) : (
                    <p>Unable to view this file type directly.</p>
                  )}
                  <div>
                    <button
                      className="btn btn-outline close_btn"
                      onClick={handleCloseView}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Display the attachment if isViewing is true */}

      <section className="applied-candidates">
        <div className="container">
          {/* <div className="d-flex employer-outer-wrapper select-employer-row">
            <select
              name="opportunity-status"
              id="opportunity-status"
              placeholder="opportunity-status"
              className="select-employer-dashboard"
              value={role}
              onChange={handleRole}
            >
              <option value="">Opportunity Role</option>
              {
                commitmentTypeprofile.map((o) => (
                  <option value={o.value}>{o.label}</option>
                ))
              }
            </select>

            <select
              name="opportunity-type"
              id="opportunity-type"
              placeholder="opportunity-type"
              className="select-employer-dashboard"
              value={opportunityType}
              onChange={handleTypeofOpportunity}
            >
              <option value="">Type of Opportunity</option>
              {jobType &&
                jobType?.map((item) => (
                  <option value={item?._id}>{item?.typeName}</option>
                ))}
            </select>

            <select
              name="support-roles"
              id="support-roles"
              placeholder="support-roles"
              className="select-employer-dashboard"
              value={skillType}
              onChange={handleTypeofSkills}
            >
              <option value="">Skill</option>
              {skills &&
                skills?.map((item) => (
                  <option value={item?._id}>{item?.skillName}</option>
                ))}
            </select>

            {(skillType || opportunityType || role) && <button className="btn btn-primary" type='button' onClick={HandleClearFilter}>{landingContent?.employerDashbaord?.employerCandidate?.clearButton}</button>}
          </div> */}
          <div className="applicants-header d-flex justify-content-between mt-3">
            <h2 className="hire-nav-heading py-2">Applicants</h2>
            <button className="btn btn-primary" onClick={goToTracker}>
              Go To Tracker
            </button>
          </div>
          <div>
            {appliedCandidate &&
              appliedCandidate?.docs?.map((item) => (
                <EmployerCandidatesCards
                  data={item?.ApplicantData}
                  saveTalent={saveTalent}
                  view={false}
                />
              ))}

            {appliedCandidate?.totalDocs == 0 && (
              <div className="no-candidate-info">
              {landingContent?.tracker?.noApplicationMessageEmployer}
            </div>
            )}

            {appliedCandidate?.totalDocs != 0 && (
              <div className="text-center candidate-icon-col mb-3">
                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
