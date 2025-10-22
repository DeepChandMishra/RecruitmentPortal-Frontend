import React from "react";
import plusIcon from "../../assets/images/btn-plus.svg";
import LikeIcon from "../../assets/images/HeartStraight.svg";
import moreIcon from "../../assets/images/more-icon.svg";
import profileCandidate1 from "../../assets/images/candidate-profile.png";
import profileCandidate2 from "../../assets/images/candidate-profile-2.png";
import profileCandidate3 from "../../assets/images/candidate-profile-3.png";
import { useDispatch } from "react-redux";
import {
  editAppicantStatus,
  getApplicantByEmployerId,
} from "../../redux/actions/employer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fillLike from "../../assets/images/fillheart.png";
import { blankProfile } from "../../util/UtilFunction";

export default function EmployerApplicantCards({
  data,
  currentPage,
  tab,
  saveTalent,
  setLoader,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const handleStatus = (payload) => {
    setLoader(true);
    if (payload == data?.status) {
      toast.error("No change in applicant's status");
      setLoader(false);
      return;
    }
    const param = {
      status: payload,
    };
    dispatch(
      editAppicantStatus(param, data?._id, (result) => {
        getApplicantList();
        setLoader(false);
      })
    );
  };

  const getApplicantList = () => {
    let param = {
      order_by: "",
      order: 1,
      page_size: 2,
      page: currentPage,
      status: tab,
    };
    dispatch(getApplicantByEmployerId(param, userId, (result) => {}));
  };

  //HandleView Profile
  const handleViewProfile = (_id) => {
    navigate(`/profile-user/${_id}`);
  };

  //Handle Message User
  const handleMessageUser = (_id) => {
    navigate(`/messages/${_id}`);
  };

  return (
    <div>
      <div className="inner-job-wrapper-candidate">
        <div className="img-col position-relative user-profile-active">
          <img
            src={
              data?.ApplicantData?.image !== ""
                ? data?.ApplicantData?.image
                : blankProfile()
            }
            alt="icon"
            className="job-logo"
            width={50}
            height={50}
          />
          {/* <span className="active-status"></span> */}
        </div>

        <div className="job-details-col candidate-job-details">
          <div className="d-flex flex-col justify-content-between pb-3">
            <div>
              <span className="name-col-candidate">
                {data?.ApplicantData?.firstname +
                  " " +
                  data?.ApplicantData?.lastname}
              </span>
              <div className="d-flex align-items-center candidates-skills-row justify-content-center justify-content-lg-start">
                <li className="skills-col">{data?.ApplicantData?.title}</li>
              </div>
              <h4 className="job-title-col">
                {data?.ApplicantData?.address?.city}
              </h4>
            </div>

            <div>
              <div className="d-flex gap-2 candidate-icon-col flex-wrap flex-xl-nowrap">
                {data?.status && (
                  <div className="dropdown">
                    <button
                      className="form-select authfields"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {data?.status == "applied" && "Applied"}
                      {data?.status == "shortlisted" && "Shortlisted"}
                      {data?.status == "hired" && "Hired"}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li
                        className="dropdown-item"
                        onClick={() => handleStatus("shortlisted")}
                      >
                        Shortlist
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleStatus("hired")}
                      >
                        Hire
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleStatus("rejected")}
                      >
                        Reject
                      </li>
                    </ul>
                  </div>
                )}

                <img
                  src={!data?.isSaved ? LikeIcon : fillLike}
                  alt="icon"
                  className="wishlist-icon"
                  onClick={() => saveTalent(data?.ApplicantData?._id)}
                  style={{ cursor: "pointer" }}
                  width={40}
                  height={40}
                />
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => handleMessageUser(data?.ApplicantData?._id)}
                >
                  Message
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() =>
                    navigate(`/job-description-employer/${data?.appliedJob}`)
                  }
                >
                  View Job
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleViewProfile(data?.ApplicantData?._id)}
                >
                  View Profile
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() =>
                    navigate("/employer-calendar", {
                      state: {
                        selectedMember: {
                          id: data?.ApplicantData?._id,
                        },
                      },
                    })
                  }
                >
                  Schedule Event
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="candidate-details-para">{data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
