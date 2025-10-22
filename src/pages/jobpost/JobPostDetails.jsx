import React, { useState } from "react";
import EditIcon from "../../assets/images/edit.svg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addJobPosting } from "../../redux/actions/jobposting";
import { ActionType } from "../../redux/action-types";
import { useCommonContext } from "../../context/commonContext";
import { GetSalaryFormat } from "../../util/UtilFunction";
import euroIcon from "../../assets/images/euro.svg";

export default function JobPostDetails() {
  //Redux State
  const { jobDetails } = useSelector((state) => state.jobposting);
  const { jobPosted, slotsPlan } = useSelector((state) => state.employer);
  const { userDetails } = useSelector((state) => state.user);
  console.log("🚀 ~ JobPostDetails ~ jobDetails:", jobDetails);
  const userId = localStorage.getItem("userId");
  const [isPosting, setIsPosting] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { fileData, saveFile } = useCommonContext();
  console.log("🚀 ~ JobPostDetails ~ fileData:", fileData);
  console.log("🚀 ~ JobPostDetails ~ slotsPlan:", slotsPlan);
  console.log("🚀 ~ JobPostDetails ~ jobPosted:", jobPosted?.docs?.length);
  console.log("🚀 ~ JobPostDetails ~ userDetails:", userDetails.defaultSlots, userDetails.addedSlots);

  //Handle Job Posting
  const handleAddJobPosting = (status) => {
    if (isPosting) return;
    setIsPosting(true);
    const { jobType, designation, ...rest } = jobDetails;
    const jobType_id = jobType?.[0]?._id;
    const designation_value = designation?._id
      ? designation?._id
      : designation?.label;
    console.log(
      "🚀 ~ handleAddJobPosting ~ designation_value:",
      designation_value
    );

    const _data = {
      ...rest,
      status: status,
      jobType: jobType_id,
      designation: designation_value,
      employerId: userId,
      file: fileData,
    };
    console.log("Processed jobDetails:", _data);
    delete _data?.opportunitiesType;
    dispatch(
      addJobPosting(_data, (result) => {
        console.log("🚀 ~ addJobPosting ~ result:", result);
        if (result?.status) {
          dispatch({
            type: ActionType.JOB_DETAILS,
            payload: {},
          });
          saveFile();
          navigate("/employer-job-post");
        }
      })
    );
  };
  const formatRate = (rate) => {
    if (!rate) return '';
    return rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };


  return (
    <div>
      <div className="container job-post pt-5">
        <div className="parent-progress pt-4 pt-xl-2">
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.designation ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.jobType ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.commitmentType ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.hiringTimeline ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.payType ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="100%"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: jobDetails?.description ? "100%" : "0" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <div className="d-flex py-5 justify-content-between align-items-center heading-row-details">
          <h2 className="main-title-col">Opportunity details</h2>
          <button
            className="btn-primary btn"
            type="button"
            onClick={() => handleAddJobPosting("Published")}
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post opportunity"}          </button>
        </div>

        <div className="job-wrapper-details">
          <div className="d-flex justify-content-between align-items-center job-inner-wrapper">
            <div>
              <h3 className="title-col m-0">
                {jobDetails?.designation?.label}
              </h3>
            </div>

            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-title")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center job-inner-wrapper">
            <div>
              <h3 className="sub-title-col">Commitment type</h3>
              <p className="sub-para-col mb-0">{jobDetails?.commitmentType}</p>
            </div>
            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-commitment")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center job-inner-wrapper">
            <div>
              <h3 className="sub-title-col">Opportunity type</h3>
              <p className="opportunity-type-text mb-0">
                {jobDetails?.jobType && jobDetails?.jobType[0]?.typeName}
              </p>
            </div>

            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-opportunity")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center job-inner-wrapper">
            <div>
              <h3 className="sub-title-col">Recruitment timeline</h3>
              <p className="sub-para-col mb-0">{jobDetails?.hiringTimeline}</p>
            </div>
            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-role")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center job-inner-wrapper">
            <div>
              <h3 className="sub-title-col">Salary range</h3>
              <p className="sub-para-col mb-0">
                {jobDetails?.payScale ? (
                  <div>
                    <img src={euroIcon} alt="Euro Icon" />
                    {`${formatRate(jobDetails?.payScale?.from)} - `}
                    <img src={euroIcon} alt="Euro Icon" />
                    {` ${formatRate(jobDetails?.payScale?.to)}`}
                    {jobDetails?.payType && jobDetails?.payType == "Annual salary"
                      ? " /annually"
                      : jobDetails?.payType == "Hourly salary"
                        ? " /hourly"
                        : ""}
                  </div>
                ) : (
                  `$${0} - $${0}`
                )}{" "}

              </p>
            </div>
            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-range")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center job-inner-wrapper last">
            <div>
              <h3 className="sub-title-col">Additional information</h3>
              <div
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                dangerouslySetInnerHTML={{ __html: jobDetails?.description }}
              ></div>
              <div className="d-flex align-items-center pt-3 gap-2">
                <div>
                  <h3 className="sub-title-col mb-0">Attached file</h3>
                </div>
                <div className="file-upload-wrapper-info">
                  <label for="file-upload" className="file-upload-label">
                    <i className="fa fa-paperclip"></i>
                    {fileData?.name}
                  </label>
                  {" "}
                  {/* <input
                    type="file"
                    id="file-upload"
                    className="file-upload-input"
                  />` */}
                </div>
              </div>
            </div>

            <div>
              <button
                className="btn border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-info")}
              >
                <img src={EditIcon} alt="icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-end gap-5 end-btn-row py-5">
          {/* <div>
            <button
              className="btn back border-0 bg-transparent fw-600"
              type="button"
              onClick={() => handleAddJobPosting("Draft")}
            >
              Save as a draft
            </button>
          </div> */}

          <div>
            <button
              className=" btn btn-primary"
              type="button"
              onClick={() => handleAddJobPosting("Published")}
              disabled={isPosting}
            >
              {isPosting ? "Posting..." : "Post opportunity"}            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
