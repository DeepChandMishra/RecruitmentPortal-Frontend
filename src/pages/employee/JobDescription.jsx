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
import { viewCountOfJob } from "../../redux/actions/jobposting";

export default function JobDescription() {
  const [loader, setLoader] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

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

  const userId = localStorage.getItem("userId")
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
    dispatch(viewCountOfJob(id), (result) => {

    })
  }

  useEffect(() => {
    if (param.id) {
      getPrefrencedJobsDetails(param.id);
      viewJob(param.id)
    }
  }, [param]);

  //Save Job
  const saveJobApplicant = (job_id) => {
    let _data = {
      jobId: job_id,
    };
    dispatch(
      saveJob(_data, (result) => {
        console.log("result", result);
        if (result?.status) {
          if (param.id) {
            getPrefrencedJobsDetails(param.id);
          }
        }
      })
    );
  };

  //Apply Job
  const applyJobApplicant = (job_id) => {
    let _data = {
      applicant: userDetails?._id,
      appliedJob: job_id,
    };
    dispatch(
      applyJob(_data, (result) => {
        if (result?.status) {
          if (param.id) {
            getPrefrencedJobsDetails(param.id);
          }
        }
      })
    );
  };

  // Download Attached File
  const handleDownloadAttachment = async (file) => {
    if (!file) {
      toast.error("No attachment available");
      return;
    }
    // Create an anchor element
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop();
    document.body.appendChild(link);
    link.click();
    await document.body.removeChild(link);
    toast.success("Attachment download successfully");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scrolling smooth
    });
  }

  useEffect(() => {
    scrollToTop()
  }, [])


  return (
    <div>
      <section className="job-description-section">
        <div className="container">
          <div className="job-wrapper">
            <div className="job-des-wrapper">
              <div className="img-col">
                <img src={(jobDetails?.EmployerData && jobDetails?.EmployerData?.image !== "") ? jobDetails?.EmployerData?.image : blankProfile()} alt="icon" className="job-logo" />
              </div>
              <div className="job-details-col">
                <div className="d-flex justify-content-between btn-row ">
                  <div>
                    <span
                      className="name-col"
                      onClick={() =>
                        navigate(
                          `/profile-user-employee/${jobDetails?.EmployerData?._id}`
                        )
                      }
                    >
                      {jobDetails?.EmployerData?.businessName}
                    </span>{" "}
                    <h4 className="job-title-col">{jobDetails?.name}</h4>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => shareOpportunity()}
                    >
                      Share opportunity
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => saveJobApplicant(jobDetails?._id)}
                    // disabled={jobDetails?.isSaved}
                    >
                      {!jobDetails?.isSaved ? "Save opportunity" : "Unsave opportunity"}
                    </button>

                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => applyJobApplicant(jobDetails?._id)}
                      disabled={jobDetails?.hasUserApplied}
                    >
                      Apply now
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

                <div className="pt-2 bottom-text-jobs">
                  <span className="d-flex align-items-center">
                    {/* <img src={euroIcon} alt="icon" className="" /> */}
                    {GetSalaryFormat(
                      jobDetails?.payType,
                      jobDetails?.payScale
                    )}{" "}
                    {jobDetails?.payScale && ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-sm-5 py-3 d-flex flex-wrap gap-2">
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
              <p className={`para-des-col user-description ${showMore ? 'show-full' : 'show-limited'}`} dangerouslySetInnerHTML={{
                __html: jobDetails?.description,
              }}></p>
              <div className='user-bio mb-2 pointer-cursor' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</div>
            </div>

            <div className="py-sm-5 py-3 d-flex align-items-center justify-content-between gap-2">
              <div className="attchment-inner-items">


                <h4 className="sender-details-col">
                  <img src={profileIcon} alt="icon" className="pe-1" />
                  {`Posted by: ${jobDetails?.EmployerData?.firstname} ${jobDetails?.EmployerData?.lastname}`}
                </h4>
                <h4
                  className="sender-details-col"
                  type="button"
                >
                  <img src={fileIcon} alt="icon" className="pe-1" />
                  Attachment Included : {jobDetails?.file ? "Yes" : "No"}
                </h4>
              </div>
            </div>
            {jobDetails?.file &&
              <div className="attachment-actionbtn mt-0" >
                <button className="btn btn-primary" onClick={() => handleDownloadAttachment(jobDetails?.file)}>Download Attachment</button>
                <span className="px-2"></span>
                <button
                  className="btn btn-primary"
                  onClick={handleViewAttachment}
                >
                  View Attachment
                </button>
              </div>
            }
            {isViewing && jobDetails?.file && (
              <div className="attachment-view mt-3" >
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
                    className="btn btn-outline mt-5"
                    onClick={handleCloseView}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
