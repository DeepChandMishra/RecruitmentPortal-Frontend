import React from "react";
import plusIcon from "../../assets/images/btn-plus.svg";
import LikeIcon from "../../assets/images/HeartStraight.svg";
import moreIcon from "../../assets/images/more-icon.svg";
import profileCandidate1 from "../../assets/images/candidate-profile.png";
import profileCandidate2 from "../../assets/images/candidate-profile-2.png";
import profileCandidate3 from "../../assets/images/candidate-profile-3.png";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fillLike from '../../assets/images/fillheart.png'
import { blankProfile } from "../../util/UtilFunction";


export default function EmployerCandidatesCards({ data, saveTalent, isSaved, view }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  console.log("🚀 ~ EmployerCandidatesCards ~ location:", location)

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  //HandleView Profile
  const handleViewProfile = (_id) => {
    navigate(`/profile-user/${_id}`)
  }

  //Handle Message User
  const handleMessageUser = (_id) => {
    navigate(`/messages/${_id}`)
  }
  return (
    <div>
      <div className="inner-job-wrapper-candidate pe-0">
        <div className="img-col position-relative user-profile-active">
          <img src={(data && data?.image !== "") ? data?.image : blankProfile()} alt="icon" className="job-logo" width={50} height={50} />
          {/* <span className="active-status"></span> */}
        </div>

        <div className="job-details-col candidate-job-details">
          <div className="d-flex flex-col justify-content-between pb-3">
            <div>
              <span className="name-col-candidate">
                {data?.firstname + " " + data?.lastname}
              </span>
              <div className="d-flex align-items-center candidates-skills-row">
                <li className="skills-col">{data?.title}</li>
              </div>
              <h4 className="job-title-col">{data?.address?.city}</h4>
            </div>

            <div>
              <div className="d-flex gap-2 candidate-icon-col">

                {view != false && location.pathname !== '/employer-job-description' && (data?.isSaved || !data?.isSaved) && <img src={(!data?.isSaved) ? LikeIcon : isSaved ? fillLike : fillLike} alt="icon" className="wishlist-icon" onClick={() => saveTalent(data?._id)} style={{ cursor: 'pointer' }} width={40} height={40} />}
                {view != false && data?.isSaved == undefined && <img src={fillLike} alt="icon" className="wishlist-icon" onClick={() => saveTalent(data?._id)} style={{ cursor: 'pointer' }} width={40} height={40} />}

                <button className="btn btn-outline" type="button" onClick={() => handleMessageUser(data._id)} >{landingContent?.employerDashbaord?.employerCandidate?.messageRequestButton}</button>
                <button className="btn btn-primary" type="button" onClick={() => handleViewProfile(data._id)}>{landingContent?.employerDashbaord?.employerCandidate?.viewProfileButton}</button>
              </div>
            </div>
          </div>

          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: data?.description,
              }}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
}
