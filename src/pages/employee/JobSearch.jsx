import React, { useEffect, useRef, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getJobTypesList,
  hiringTimelineList,
} from "../../redux/actions/jobposting";
import { applyJob, getJobsList, saveJob } from "../../redux/actions/employee";
import { GetSalaryFormat, blankProfile } from "../../util/UtilFunction";
import Loading from "../../components/loader";
import currentLocation from "../../assets/images/current-location.svg";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { getCategories } from "../../redux/actions/common";
import { commitmentType } from "../../util/contant";
import { useTranslation } from "react-i18next";

export default function JobSearch() {
  const [lat, setLat] = useState();
  const [city, setCity] = useState();
  const [lang, setLang] = useState();
  const [state, setState] = useState();
  const [address, setAddress] = useState();
  const [country, setCountry] = useState();
  const [pincode, setPincode] = useState();
  const [loader, setLoader] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [showMore, setShowMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [opportunityType, setOpportunityType] = useState();
  const [commitment, setCommitment] = useState();
  const [domain, setDomain] = useState();
  const [urgencyList, setUrgencyList] = useState([]);
  const [hiringTimeline, setHiringTimeline] = useState();

  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");

  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";

  //Redux State
  const { jobTypeList, jobUrgencyList } = useSelector(
    (state) => state.jobposting
  );
  const { filterJob } = useSelector((state) => state.employee);
  const { userDetails } = useSelector((state) => state.user);
  const { categoriesList } = useSelector((state) => state.common);
  console.log("🚀 ~ JobSearch ~ categoriesList:", categoriesList);
  console.log("🚀 ~ JobSearch ~ filterJob:", filterJob);
  console.log("jobUrgencyList:", jobUrgencyList);
  console.log("🚀 ~ JobSearch ~ userDetails:", userDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("🚀 ~ JobSearch ~ location:", location);
  const searchInput = useRef(null);

  const filterJobList = (type, opportunity) => {
    scrollToTop();
    setLoader(true);
    let clearParam = {
      order_by: "",
      order: 1,
      page_size: pageSize,
      page: currentPage,
      query: {
        role: "",
        categories: [],
        jobType: [],
        hiringTimeline: "",
      },
    };
    let param = {
      order_by: "",
      order: 1,
      page_size: pageSize,
      page: currentPage,
      query: {
        commitmentType: commitment,
        jobType: opportunity
          ? [opportunity]
          : opportunityType != ""
            ? [opportunityType]
            : [],
        latitude: lang,
        longitude: lat,
        hiringTimeline: hiringTimeline,
      },
    };
    if (domain) {
      param.query.categories = [domain];
    }

    if (!opportunityType && !opportunity) {
      delete param.query.jobType;
    }
    dispatch(
      getJobsList(type == "clear" ? clearParam : param, (result) => {
        if (result.status) {
          console.log("result", result);
          setTotalPages(result?.data?.totalPages);
          setLoader(false);
        }
      })
    );
  };

  //Get Categories
  const getCategoriesList = () => {
    dispatch(
      getCategories((result) => {
        {
          console.log("result", result);
        }
      })
    );
  };

  useEffect(() => {
    console.log("jobUrgencyListjobUrgencyList", jobUrgencyList);
    if (jobUrgencyList) setUrgencyList(jobUrgencyList);
  }, [jobUrgencyList]);

  //get hiring timeline
  const getHiringTimeline = () => {
    dispatch(
      hiringTimelineList((result) => {
        if (result.status) {
          console.log("result:", result);
        }
      })
    );
  };

  useEffect(() => {
    getHiringTimeline();
    getCategoriesList();
  }, []);

  useEffect(() => {
    if (location?.state?.address !== false) {
      let lat = location?.state?.address?.location?.coordinates[0];
      let lng = location?.state?.address?.location?.coordinates[1];

      console.log("🚀 ~ useEffect ~ lat:", lat, lng);
      reverseGeocode({ latitude: lat, longitude: lng });
    }
  }, [location?.state]);

  useEffect(() => {
    filterJobList();
  }, [pageSize, location.state, currentPage]);

  // Get all opportunity
  useEffect(() => {
    dispatch(getJobTypesList((result) => { }));
  }, []);

  //Handle Pre Select Filter
  useEffect(() => {
    const getOpportunityType = async () => {
      let opportunityType = location?.state?.type;
      if (opportunityType == "Volunteer" || opportunityType == "Paid") {
        let result = await jobTypeList.filter(
          (o) => o.typeName == opportunityType
        );
        setOpportunityType(result[0]?._id);
        filterJobList("", result[0]?._id);
      } else {
        setOpportunityType("");
      }
    };
    getOpportunityType();
  }, []);

  //Handle Opportunity Select
  const handleTypeofOpportunity = (e) => {
    setOpportunityType(e.target.value);
  };

  //hanndle hiring timeline
  const handleHiringTimeline = (e) => {
    setHiringTimeline(e.target.value);
  };

  //Handle Commitment Select
  const handleCommitmentSelect = (e) => {
    setCommitment(e.target.value);
  };

  //Handle Domain Select
  const handleDomainSelect = (e) => {
    setDomain(e.target.value);
  };

  //Handle page size
  const handlePageSize = () => {
    console.log("pafe", pageSize);
    setPageSize(pageSize + 10);
  };

  //Handle Jobs Details
  const handleJobDetails = (job_id) => {
    navigate(`/job-description/${job_id}`);
  };

  //Handle Clear Filter
  const HandleClearFilter = async () => {
    setOpportunityType("");
    setLat();
    setLang();
    setAddress();
    setCity();
    setCountry();
    setCommitment("");
    setDomain("");
    setHiringTimeline("");
    searchInput.current.value = "";
    navigate(location.pathname, { state: "all", address: {} });
    //Calling Job Listing.
    filterJobList("clear");
  };

  //Location Function

  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return city + zip + state + this.country;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;

      if (types.includes("locality")) {
        address.city = value;
      }

      if (types.includes("administrative_area_level_1")) {
        address.state = value;
      }

      if (types.includes("postal_code")) {
        address.zip = value;
      }

      if (types.includes("country")) {
        address.country = value;
      }
    });

    return address;
  };

  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
    searchInput.current.value = "Getting your location...";
    fetch(url)
      .then((response) => response.json())
      .then((location) => {
        const place = location.results[0];
        const _address = extractAddress(place);
        setAddress(_address);
        setCountry(_address.country);
        setState(_address.state);
        setCity(_address.city);
        setPincode(_address.zip);
        setLat(lat);
        setLang(lng);
        searchInput.current.value = _address.plain();
      });
  };

  const handlePlaceSelected = (place) => {
    if (place) {
      const { geometry } = place;
      const lat = geometry.location.lat();
      const lng = geometry.location.lng();
      reverseGeocode({ latitude: lat, longitude: lng });
    } else {
      console.log("No geometry information available for this place.");
    }
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        reverseGeocode(position.coords);
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //Save Job
  const saveJobApplicant = (job_id) => {
    let _data = {
      jobId: job_id,
    };
    dispatch(
      saveJob(_data, (result) => {
        if (result.status) {
          filterJobList();
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
        if (result.status) {
          filterJobList();
        }
      })
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scrolling smooth
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [location]);

  return (
    <div>
      <main className="job-main-col opportunity_inner">
        <div className="container">
          <h2 className="main-heading-col">
            {landingContent?.employeeDashboard?.searchOpportunities?.heading}
          </h2>

          <div className="d-flex dropdown-row py-4 ">
            <select
              name="cars"
              id="Opportunity-Role"
              value={commitment}
              onChange={handleCommitmentSelect}
            >
              <option value="">Type of commitment</option>
              {commitmentType &&
                commitmentType?.map((o, index) => (
                  <option key={index} value={o.value}>
                    {o.name}
                  </option>
                ))}
            </select>

            <select
              name="cars"
              id="Type-of-Opportunity"
              value={opportunityType}
              onChange={handleTypeofOpportunity}
            >
              <option value="">Type of opportunity</option>
              {jobTypeList?.map((job, index) => (
                <option key={index} value={job?.id}>
                  {job?.typeName}
                </option>
              ))}
            </select>

            <select
              name="hiringTimeline"
              id="hiringTimeline"
              value={hiringTimeline}
              onChange={handleHiringTimeline}
            >
              <option value="">Job urgency</option>
              {urgencyList?.length > 0 &&
                urgencyList?.map((urgency, index) => (
                  <option key={index} value={urgency}>
                    {urgency}
                  </option>
                ))}
            </select>

            <select
              name="cars"
              id="Domain"
              value={domain}
              onChange={handleDomainSelect}
            >
              <option value="">Domain</option>
              {categoriesList?.map((o, index) => (
                <option key={index} value={o?.id}>
                  {o?.name}
                </option>
              ))}
            </select>

            <div className="formControls">
              <div className="position-relative ">
                <img
                  src={locationIcon}
                  alt="location"
                  className="location-icon"
                />
                <ReactGoogleAutocomplete
                  className="authfields location-input-col bg-transparent"
                  ref={searchInput}
                  apiKey={process.env.REACT_APP_GOOGLE_API}
                  types={["(regions)"]}
                  onPlaceSelected={handlePlaceSelected}
                />{" "}
                <div className="formControls">
                  <span
                    className="current-location"
                    onClick={fetchCurrentLocation}
                    type="button"
                  >
                    <img src={currentLocation} alt="current-location" />
                  </span>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary search-btn asdsad"
              type="button"
              style={{ width: 'auto', whiteSpace: 'nowrap' }}
              onClick={filterJobList}
            >
              {
                landingContent?.employeeDashboard?.searchOpportunities
                  ?.searchOpportunityButton
              }
            </button>
          </div>
          <div className="text-end pb-3 clear-block">
            {(opportunityType ||
              lat ||
              lang ||
              commitment ||
              domain ||
              hiringTimeline) && (
                <button
                  className="btn btn-primary search-btn mx-0 new-search"
                  type="button"
                  onClick={HandleClearFilter}
                >
                  Clear
                </button>
              )}
          </div>
        </div>
      </main>

      <section className="job-lists">
        <div className="container">
          <div className="d-flex row-main-dashboard">
            {loader && <Loading />}
            <div className="job-wrapper job-wrapper-seach">
              <h3 className="wrapper-heading-col">
                {
                  landingContent?.employeeDashboard?.searchOpportunities
                    ?.searchMessage
                }
              </h3>

              {filterJob?.docs?.map((job, index) => (
                <div
                  className="inner-job-wrapper"
                  key={job?._id}
                  onClick={() => handleJobDetails(job?._id)}
                >
                  <div className="img-col">
                    <img
                      src={
                        job?.EmployerData && job?.EmployerData?.image !== ""
                          ? job?.EmployerData?.image
                          : blankProfile()
                      }
                      alt="icon"
                      className="job-logo"
                    />
                  </div>
                  <div className="job-details-col">
                    <div className="d-flex flex-col justify-content-between pb-3">
                      <div>
                        <span className="name-col">
                          {job?.EmployerData?.businessName}
                        </span>
                        <h4 className="job-title-col">{job?.name}</h4>
                      </div>
                      <div>
                        <button
                          className="btn btn-outline"
                          type="button"
                          disabled={job?.isSaved}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent click event from bubbling up
                            saveJobApplicant(job?._id);
                          }}
                        >
                          {landingContent.employeeDashboard.jobCardButton1}
                        </button>

                        {!job?.hasUserApplied ? (
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyJobApplicant(job._id);
                            }}
                          >
                            {landingContent.employeeDashboard.jobCardButton2}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            disabled={job?.hasUserApplied}
                          >
                            {landingContent.employeeDashboard.jobCardButton3}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="d-flex bottom-text-jobs new-bottom-text-jobs align-items-center flex-wrap">
                      <div className="bottom-inner-text job-details-bottom-col">
                        <span className="d-flex align-items-center">
                          <img src={locationIcon} alt="icon" className="pe-2" />
                          {job?.address?.city ? job?.address?.city : "N/A"}
                        </span>
                      </div>

                      <div className="bottom-inner-text job-details-bottom-col">
                        <span className="dot-col p-0">.</span>
                        <span className="d-flex align-items-center">
                          <img src={clockIcon} alt="icon" className="pe-2" />
                          {job?.commitmentType}
                        </span>
                      </div>

                      <div className="bottom-inner-text job-details-bottom-col">
                        <span className="dot-col p-0">.</span>
                        {/* <img src={euroIcon} alt="icon" className='pe-2' />*/}
                        <span className="d-flex align-items-center">
                          {GetSalaryFormat(job.payType, job.payScale)}
                        </span>
                      </div>

                      <div className="bottom-inner-text job-details-bottom-col">
                        <span className="dot-col p-0">.</span>
                        <span>
                          <img src={sellIcon} alt="icon" className="pe-2" />
                          {job?.JobTypeData?.typeName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filterJob?.totalDocs == 0 && (
                <div className="no-candidate-info">
                  {
                    landingContent?.employeeDashboard?.searchOpportunities
                      ?.noSearchMessage
                  }
                </div>
              )}

              {filterJob?.docs?.length > 0 && (
                <div className="text-center candidate-icon-col">
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {landingContent.pagination.previousButton}
                  </button>
                  <span className="mx-3">
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
              )}
              {/* {filterJob?.docs?.length != filterJob?.totalDocs && <div className='show-more-function'>
                                <button className=" btn btn-outline" type='button' onClick={() => (handlePageSize)}>Show more</button>
                            </div>
                            } */}

              {/* <div className="col-xl-3 px-3 profile-row text-center">
                                <div className="user-profile-wrapper text-xl-center">
                                    <img src={editIcon} alt="edit" className='edit-icon' onClick={() => navigate('/profile-user')} />
                                    <div>
                                        <img src={userDetails?.image !== "" ? userDetails?.image : blankProfile()} alt="profile-icon" className='avatar pb-3' width={70} height={70} />
                                    </div>
                                    <div>
                                        <h4 className='user-name-col'>{`${userDetails?.firstname} ${userDetails?.lastname}`}.</h4>
                                        <h6 className='user-bio'>{userDetails?.title}</h6>
                                        {/* <p >
                                            {userDetails.description}
                                        </p> 
                                        <p className={`user-description ${showMore ? 'show-full' : 'show-limited'}`} dangerouslySetInnerHTML={{ __html: userDetails.description }}></p>
                                        <div className='user-bio mb-2' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</div>


                                        {userDetails.profilePercentage !== '100' && <button className='btn btn-primary' type='button' onClick={() => navigate('/profile-user')}>{landingContent.employeeDashboard.profileButton}</button>}
                                    </div>
                                </div>
                                <button className='btn btn-primary mt-3' type='button' onClick={() => navigate('/job-tracker')}>{landingContent.employeeDashboard.applicationButton}</button>
                            </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
