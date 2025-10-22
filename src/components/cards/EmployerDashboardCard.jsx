import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotionIcon from "../../assets/images/notion.png";
import locationIcon from "../../assets/images/location.svg";
import clockIcon from "../../assets/images/Clock.svg";
import euroIcon from "../../assets/images/euro.svg";
import sellIcon from "../../assets/images/sell.svg";
import eyeIcon from "../../assets/images/Eye.svg";
import likeIconCol from "../../assets/images/ThumbsUp.svg";
import bookmarkIcon from "../../assets/images/BookmarkSimple.svg";
import dotsIcon from "../../assets/images/DotsThree.svg";
import { useNavigate } from "react-router-dom";
import blankProfile from '../../assets/images/blank-profile.png'
import { GetSalaryFormat } from "../../util/UtilFunction";

export default function EmployerDashboardCard({ data }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/job-description-employer/${data?._id}`)}>
      <div className="inner-job-wrapper">
        <div className="img-col">
          <img src={data?.EmployerData?.image !== "" ? data?.EmployerData?.image : blankProfile} alt="icon" className="job-logo" />
        </div>

        <div className="job-details-col">
          <div className="d-flex flex-col justify-content-between pb-3">
            <div>
              <span className="name-col">{data?.EmployerData?.businessName}</span>
              <h4 className="job-title-col">{data?.name}</h4>
            </div>

            <div>
              <div className="d-flex gap-2">
                <span className="opportunity-type-text mb-0 d-inline-flex gap-2 align-items-center">
                  <img src={eyeIcon} alt="icon" /> {data?.viewCount}
                </span>
                {/* <span className="opportunity-type-text mb-0 d-inline-flex gap-2 align-items-center">
                  <img src={likeIconCol} alt="icon" />
                  23
                </span> */}
                <span className="opportunity-type-text mb-0 d-inline-flex gap-2 align-items-center">
                  <img src={bookmarkIcon} alt="icon" />
                  {data?.saveCount}
                </span>
                {/* <button className="border-0 opportunity-type-text">
                  <img src={dotsIcon} alt="icon" />
                </button> */}
              </div>
            </div>
          </div>

          <div className="d-flex bottom-text-jobs new-bottom-text-jobs align-items-center flex-wrap">
            <div className="bottom-inner-text job-details-bottom-col">
              <span className="d-flex align-items-center">
                <img src={locationIcon} alt="icon" className="pe-2" />
                {data?.address?.city}
              </span>
            </div>
            <div className="bottom-inner-text job-details-bottom-col">
              <span className="dot-col">.</span>
              <span className="d-flex align-items-center">
                <img src={clockIcon} alt="icon" className="pe-2" />
                {data?.commitmentType}
              </span>
            </div>
            {/* {/* {data?.payType == "Hourly rate" || */}
              {/* // (data?.payType == "Annual salary" && ( */}
                <div className="bottom-inner-text job-details-bottom-col"> 
                  <span className="dot-col">.</span>
                  <span className="d-flex align-items-center">
                    {/* <img src={euroIcon} alt="icon" className="pe-2" />   */}
                    {GetSalaryFormat(data.payType, data.payScale)} {" "}
                    {/* {data?.payType == "Annual salary" ? "p.a." : "p.h."} */}
                  </span>
                </div>
           
            <div className="bottom-inner-text job-details-bottom-col">
              <span className="dot-col">.</span>
              <span className="d-flex align-items-center">
                <img src={sellIcon} alt="icon" className="pe-2" />
                {data?.JobTypeData?.typeName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
