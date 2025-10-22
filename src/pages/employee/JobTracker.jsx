import React, { useEffect, useState } from "react";
import appliedIcon from "../../assets/images/applied.svg";
import shorlistIcon from "../../assets/images/shortlisted.svg";
import selectIcon from "../../assets/images/hired.svg";
import DropdownIcon from "../../assets/images/arrow-dropdown.svg";
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
import emojiIcon from "../../assets/images/Emoji.svg";
import { commitmentTypeprofile } from "../../util/contant";
import { useDispatch, useSelector } from "react-redux";
import { jobTypesListing } from "../../redux/actions/common";
import { jobTracker } from "../../redux/actions/employee";
import Loading from "../../components/loader";
import { useTranslation } from "react-i18next";
import { blankProfile, formatDateValue, getNotificationTimeAgo, GetSalaryFormat } from "../../util/UtilFunction";
import { useNavigate } from "react-router-dom";

export default function JobTracker() {
  const [sort, setSort] = useState(1)
  const [role, setRole] = useState(null);
  const [loader, setLoader] = useState(false)
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("applied");
  const userId = localStorage.getItem("userId");
  const [opportunityType, setOpportunityType] = useState(null);

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobType } = useSelector((state) => state.common);
  const { trackedJobList } = useSelector((state) => state.employee);

  console.log({ trackedJobList });

  const handleRole = (e) => {
    setCurrentPage(1);
    setRole(e.target.value);
  };

  const handleTypeofOpportunity = (e) => {
    setCurrentPage(1);
    console.log("value", e.target.value)
    setOpportunityType(e.target.value);
  };

  const getJobType = () => {
    try {
      setLoader(true)
      dispatch(jobTypesListing((result) => {
        if (result.status) {
          setLoader(false)
        }
      }));

    }
    catch (error) {
      console.log('Error:', error)
    }

  };
  const handleJobDetails = (job_id) => {
    navigate(`/job-description/${job_id}`)
  }


  const trackedJob = (type) => {
    setLoader(true)
    let param = {
      order_by: "",
      order: 1,
      sortBy: sort,
      page_size: 10,
      page: currentPage,
      status: status,
    };

    //   if (skillType) param.skills = [skillType];
    if (opportunityType) param.opportunityType = [opportunityType];
    if (role) param.role = role

    dispatch(
      jobTracker(userId, param, (result) => {
        console.log(result);
        setLoader(false);
      })
    );
  };

  useEffect(() => {
    getJobType();
  }, []);

  useEffect(() => {
    trackedJob();
  }, [status, opportunityType, role, sort]);

  // const GetSalaryFormat = (payType, payScale) => {
  //   if (payType == "Annual salary") {
  //     return `${payScale.from} - ${payScale.to} p.a.`;
  //   } else if (payType == "Hourly rate") {
  //     return `${payScale.from} - ${payScale.to} h.r.`;
  //   } else if (payType == "Prefer not to say") {
  //     return `Prefer not to say`;
  //   } else {
  //     return `Unpaid`;
  //   }
  // };

  const handleStatus = (data) => {
    setStatus(data);
  };

  const handleClear = () => {
    setOpportunityType("")
    setRole("")
    setSort(1)
  }

  const handleSort = (data) => {
    console.log("handle sort", data)
    setSort(data)
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

  return (
    <div>
      <main className="job-main-col">
        {loader && <Loading />}
        <div className="container">
          <h2 className="main-heading-sub-col pb-3">
            {landingContent?.tracker?.heading1}
          </h2>

          <nav>
            <div
              class="nav nav-tabs tabs-custom d-inline-flex justify-content-between"
              id="nav-tab"
              role="tablist"
            >
              <button
                class="nav-link active"
                id="nav-applied-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-applied"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={() => handleStatus("applied")}
              >

                {landingContent?.tracker?.appliedButton}
              </button>

              <button
                class="nav-link"
                id="nav-shortlisted-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-shortlisted"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
                onClick={() => handleStatus("shortlisted")}
              >
                {landingContent?.tracker?.shortListedButton}
              </button>

              <button
                class="nav-link"
                id="nav-hired-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-hired"
                type="button"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
                onClick={() => handleStatus("hired")}
              >
                {landingContent?.tracker?.hiredButton}
              </button>
            </div>
          </nav>
        </div>
      </main>

      <section className="job-tabs-section">
        <div className="container">
          <div class="tab-content">
            <div
              class="tab-pane fade show active"
              role="tabpanel"
              aria-labelledby="nav-applied-tab"
            //   tabindex="0"
            >
              <div className="d-flex pt-4 select-employer-row">
                <select
                  name="opportunity-type"
                  id="opportunity-type"
                  placeholder="opportunity-type"
                  value={sort}
                  className="select-employer-dashboard"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="1">Newest first</option>
                  <option value="-1">Oldest first</option>
                </select>

                <select
                  name="opportunity-status"
                  id="opportunity-status"
                  placeholder="opportunity-status"
                  className="select-employer-dashboard"
                  value={role}
                  onChange={handleRole}
                >
                  <option value="">Opportunity role</option>
                  {commitmentTypeprofile.map((o) => (
                    <option value={o.value}>{o.label}</option>
                  ))}
                </select>

                <select
                  name="type-of-opportunity"
                  id="type-of-opportunity"
                  placeholder="Type of Opportunity"
                  className="select-employer-dashboard"
                  value={opportunityType}
                  onChange={handleTypeofOpportunity}
                >
                  <option value="">Type of opportunity</option>
                  {jobType &&
                    jobType?.map((item) => (
                      <option value={item?._id} key={item?._id}>
                        {item?.typeName}
                      </option>
                    ))}
                </select>

                {(opportunityType || role) && <button className="btn btn-primary" onClick={handleClear}>Clear</button>}
              </div>

              {trackedJobList &&
                trackedJobList.docs &&
                trackedJobList.docs.length > 0 ? (
                trackedJobList.docs.map((item) => (
                  <div className="inner-job-wrapper" key={item?.JobData?._id} onClick={() => handleJobDetails(item?.JobData?._id)}>
                    <div className="img-col">
                      <img src={item?.JobData?.EmployerData?.image ? item?.JobData?.EmployerData?.image : blankProfile()} alt="icon" className="job-logo" />
                    </div>

                    <div className="job-details-col">
                      <div className="d-flex flex-col justify-content-between pb-3">
                        <div>
                          <span className="name-col">
                            {item?.JobData?.EmployerData?.businessName}
                          </span>
                          <h4 className="job-title-col">
                            {item?.JobData?.name}
                          </h4>
                        </div>
                      </div>

                      <div className="d-flex bottom-text-jobs align-items-center">
                        <div>
                          <span className='d-flex align-items-center'>
                            <img
                              src={locationIcon}
                              alt="icon"
                              className="pe-2"
                            />
                            {item?.JobData?.address?.city}
                          </span>
                        </div>
                        <div>
                          <span className="dot-col p-0">.</span>
                          <span className='d-flex align-items-center'>
                            <img src={clockIcon} alt="icon" className="pe-2" />
                            {item?.JobData?.commitmentType}
                          </span>
                        </div>
                        {/* <div >
                          <span className="dot-col">.</span>
                          <span className="d-flex align-items-center">
                          {GetSalaryFormat(
                            item?.JobData?.payType,
                          )}</span>
                        </div> */}
                        <div>
                          <span className="dot-col">.</span>
                          <span className='d-flex align-items-center'>
                            <img src={sellIcon} alt="icon" className="pe-2" />
                            {item?.JobData?.payType}
                          </span>
                        </div>
                        <div >
                          <span className="dot-col">.</span>
                          <span className="d-flex align-items-center">
                            Applied {getNotificationTimeAgo(
                              item?.appliedDate
                            )}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-candidate-info">{landingContent?.tracker?.noApplicationMessageEmployee}</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
