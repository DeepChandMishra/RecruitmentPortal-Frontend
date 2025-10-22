import React, { useEffect, useRef, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import currentLocation from "../../assets/images/current-location.svg";
import searchIcon from "../../assets/images/MagnifyingGlass.svg";
import filterIcon from "../../assets/images/icon-filter.svg";
import LocationIcon from "../../assets/images/MapPinLine.svg";
import copyIcon from "../../assets/images/copyIcon.svg";
import arrowRight from "../../assets/images/ArrowRight.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import profileIcon1 from "../../assets/images/profile-employer.png";
import LikeIcon from "../../assets/images/HeartStraight.svg";
import plusIcon from "../../assets/images/btn-plus.svg";
import moreIcon from "../../assets/images/more-icon.svg";
import EmployerDashboardCard from "../../components/cards/EmployerDashboardCard.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { getCandidates, getJobPosted, saveTalentEmployee } from "../../redux/actions/employer";
import { useDispatch, useSelector } from "react-redux";
import { getUsersDetails, jobTypesListing, skillsListing } from "../../redux/actions/common";
import { getJobsList } from "../../redux/actions/employee";
import Calendar from 'react-calendar';
import { commitmentTypeprofile } from "../../util/contant";
import { ActionType } from "../../redux/action-types";
import { useTranslation } from "react-i18next";
import Loading from '../../components/loader';
import fillLike from '../../assets/images/fillheart.png'
import 'react-calendar/dist/Calendar.css';
import { EventsByDate } from "../../redux/actions/meeting";
import { blankProfile, formatDate, formatDateValue, getCalenderEventTimeZone, getContentByHeading } from "../../util/UtilFunction";
import { useCommonContext } from "../../context/commonContext";
import { toast } from "react-toastify";
import { pageContent } from "../../redux/actions/cms";
import { blockJobsByEmployer } from "../../redux/actions/employer";

const SimpleSlider = (props) => {
  const { jobType, skills, landingContent, latitude, longitude, saveTalent } = props;

  const [pageSize, setPageSize] = useState(10);
  const [settings, setSettings] = useState({
    dots: true,
    infinite: false,  // Set to false if you want the slider to stop at the last slide
    speed: 500,
    slidesToShow: 2,  // Default number of slides to show
    slidesToScroll: 1,  // Scroll one slide at a time
    initialSlide: 0,  // Start from the first slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,  // Show 3 slides for larger screens
          slidesToScroll: 1,  // Scroll one slide at a time
          infinite: true,  // Keep infinite scrolling on larger screens
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,  // Show 2 slides on medium screens
          slidesToScroll: 1  // Scroll one slide at a time
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,  // Show 1 slide on smaller screens
          slidesToScroll: 1  // Scroll one slide at a time
        }
      }
    ]
  });



  //Redux State
  const { filterCandidate } = useSelector((state) => state.employer);


  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth;

      if (width <= 680) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          slidesToShow: 1,
          infinite: filterCandidate?.docs?.length > 1,
        }));
      } else if (width <= 992) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          slidesToShow: 2,
          infinite: filterCandidate?.docs?.length > 2,
        }));
      } else if (width <= 1324) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          slidesToShow: 2,
          infinite: filterCandidate?.docs?.length > 3,
        }));
      } else {
        setSettings((prevSettings) => ({
          ...prevSettings,
          slidesToShow: 4,
          infinite: filterCandidate?.docs?.length > 4,
        }));
      }
    };

    window.addEventListener("resize", updateSettings);
    updateSettings();
    return () => {
      window.removeEventListener("resize", updateSettings);
    };
  }, [filterCandidate]);


  //Handle Profile View
  const handleProfileView = (id) => {
    console.log('idididid', id)
    if (id)
      navigate(`/profile-user/${id}`)
  }



  return (
    <div>
      {/* <h2>Simple Slick Slider</h2> */}
      <Slider {...settings} className="candidtaes-slider">
        {filterCandidate &&
          filterCandidate.docs &&
          filterCandidate.docs.length > 0 ? (
          filterCandidate.docs.map((candidate, index) => (
            <div key={index}>
              <div className="profile-card-employer new-profile-card-employer">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <div>
                        <img
                          src={candidate.image ? candidate.image : blankProfile()}
                          alt="profile-icon"
                          className="profile-img"
                        />
                      </div>
                      <div>
                        <span className="user-name-col elipsis-username-col mb-0">
                          {candidate.firstname + " " + candidate.lastname}
                        </span>
                        <p className="location-col loc-col  mb-0">
                          {candidate.address?.city} {candidate.address?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src={candidate?.isSaved ? fillLike : LikeIcon} alt="icon" className="wishlist-icon" width={40} height={40} onClick={() => saveTalent(candidate?._id)} />
                  </div>
                </div>
                <div>
                  <h4 className="status-col py-2">Available Now</h4>
                  <div className="d-flex gap-3 flex-wrap opportunity-text">
                    { }
                    {candidate?.SkillsData?.length > 0 &&
                      candidate?.SkillsData?.map((item) => (
                        <span
                          key={item._id}
                          className="opportunity-type-text mb-0"
                        >
                          {item.skillName}
                        </span>
                      ))}
                  </div>
                  <button className="btn w-100 mt-4 mx-0 btn-outline" type="button" onClick={() => handleProfileView(candidate._id)}>
                    {landingContent?.employerDashbaord?.viewProfileButton}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-candidate-info my-5">{landingContent?.tracker?.noApplicationMessageEmployer}</div>
        )}
      </Slider>
    </div>
  );
};

export default function EmployerFlowDashboard() {
  const [filterOn, setFilterOn] = useState(false);
  const [opportunityType, setOpportunityType] = useState(null);
  const [skillType, setSkillType] = useState(null);
  const [skillSet, setSkillSet] = useState(null);
  const [role, setRole] = useState(null);
  const [page_Size, setPage_Size] = useState(10);
  const [mapFilterType, setMapFilterType] = useState();
  const [lat, setLat] = useState();
  const [city, setCity] = useState();
  const [lang, setLang] = useState();
  const [state, setState] = useState();
  const [address, setAddress] = useState();
  const [country, setCountry] = useState();
  const [pincode, setPincode] = useState();
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setLoader] = useState(false)
  const [value, onChange] = useState(new Date());


  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage');
  let lan = i18n.language;
  console.log('langlang', lan)


  //Redux State
  const { contentData } = useSelector((state) => state.cms);
  const { userDetails, employerDetails } = useSelector((state) => state.user);
  const { jobPosted } = useSelector((state) => state.employer);
  console.log("🚀 ~ EmployerFlowDashboard ~ employerDetails", employerDetails);

  const { jobType, skills } = useSelector((state) => state.common);
  const { meetingEventsByDate } = useSelector((state) => state.meeting)
  //Redux State
  const { filterCandidate } = useSelector((state) => state.employer);
  console.log("🚀 ~ EmployerFlowDashboard ~ userDetails:", userDetails)
  const { fileData, saveFile } = useCommonContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const { timeLeft } = useSelector((state) => state.user)
  console.log('userDetailsrole', userDetails.role);
  console.log('userDetailsapprove', userDetails.isApproved);
  console.log('userDetailstimeleft', timeLeft, userDetails);

  useEffect(() => {
    if (
      userDetails?.role === "employer" &&
      typeof timeLeft === 'number'
    ) {
      const logoutUser = async () => {
        if (userDetails?.isApproved === false) {
          try {
            await dispatch(blockJobsByEmployer(userDetails._id));
          } catch (error) {
            console.error("Error blocking jobs after logout:", error);
          }
          dispatch({ type: ActionType.LOGOUT, payload: null });

          localStorage.removeItem('userId');
          localStorage.removeItem('_itoken');
          localStorage.removeItem('socketId');

          toast.warning("You have been logged out. Admin approval is required.");
        }
      };

      if (timeLeft <= 0) {
        logoutUser();
      } else {
        const timeout = setTimeout(logoutUser, timeLeft);
        return () => clearTimeout(timeout);
      }
    }
  }, [userDetails, timeLeft, dispatch]);


  const userId = localStorage.getItem("userId");
  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";


  //Get Meeting Events
  const getMeetEvents = (value) => {
    let param = {
      "id": userId,
      "date": formatDateValue(value),
      "sortBy": -1,
      "limit": 5,
      "page": 1
    }
    dispatch(EventsByDate(param, (result) => {
      if (result.status) {
        console.log('result', result)
      }
    }))
  }

  useEffect(() => {
    getMeetEvents(value)
  }, [value])

  //Location
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
      }
    }
    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    place.address_components.forEach(component => {
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
  }

  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
    searchInput.current.value = "Getting your location...";
    fetch(url)
      .then(response => response.json())
      .then(location => {
        const place = location.results[0];
        const _address = extractAddress(place);
        setAddress(_address);
        setCountry(_address.country);
        setState(_address.state);
        setCity(_address.city);
        setPincode(_address.zip);
        setLat(lat)
        setLang(lng)
        searchInput.current.value = _address.plain();
      })
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

  const getJobType = () => {
    dispatch(jobTypesListing((result) => { }));
  };

  const getSkills = () => {
    dispatch(skillsListing((result) => {
      console.log("skills listing in employer flow", result)
    }));
  };

  useEffect(() => {
    console.log("useEffect called")
    getJobType();
    getSkills();
    getPageContent('Employer Dashboard')
  }, [])

  const handlePlaceSelected = (place) => {
    if (place) {
      const { geometry } = place;
      const lat = geometry.location.lat();
      const lng = geometry.location.lng();
      reverseGeocode({ latitude: lat, longitude: lng });
    } else {
      console.log('No geometry information available for this place.');
    }
  };

  //Handle Calendar Details
  const handleCalendarDetails = () => {
    navigate('/employer-calendar')
  }


  //Handle Copy link
  const CopyLink = (meetLink) => {
    if (meetLink) {
      navigator.clipboard.writeText(meetLink).then(() => {
        toast.success("Copied successfully.")
      }).catch(err => {
        console.error("Failed to copy link: ", err);
      });
    }
  };


  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  };

  //Get Job Post
  const getjobPost = () => {
    try {
      setLoader(true)
      let param = {
        order_by: "",
        order: -1,
        page_size: pageSize,
        page: currentPage,
      };
      if (role || opportunityType || skillType || lat || lang) param.query = {};
      if (role) param.query.role = role;
      if (opportunityType) param.query.jobType = [opportunityType];
      if (skillType) param.query.skills = [skillType];
      if (lat) param.query.latitude = lang
      if (lang) param.query.longitude = lat

      dispatch(getJobPosted(param, userId, (result) => {
        console.log('result', result)
        if (result.status) {
          setTotalPages(result?.data?.totalPages);
        }
      }));
    }
    catch (error) {
      console.log('Error:', error)
    }
    finally {
      setLoader(false)
    }
  };



  // useEffect(() => {

  // }, []);

  useEffect(() => {
    getjobPost();
  }, [currentPage]);




  const handleSearch = () => {
    getCandidatesList()
  }

  //Get CandidatesList
  const getCandidatesList = () => {
    let param = {
      order_by: -1,
      order: 1,
      page_size: 12,
      page: 1,
    };
    if (role || opportunityType || skillType || lat || lang) param.query = {};
    if (role) param.query.role = role;
    if (opportunityType) param.query.opportunityType = [opportunityType];
    if (skillType) param.query.skills = [skillType];
    if (lat) param.query.latitude = lang
    if (lang) param.query.longitude = lat

    dispatch(
      getCandidates(param, (result) => {
        {
          setLoader(false);
        }
      })
    );
  };

  const handleTypeofOpportunity = (e) => {
    setCurrentPage(1)
    setOpportunityType(e.target.value);
  };

  const handleTypeofSkills = (e) => {
    setCurrentPage(1)
    setSkillType(e.target.value);
  };

  const handleRole = (e) => {
    setCurrentPage(1)
    setRole(e.target.value);
  };

  console.log("employerDetailssize", userDetails.defaultSlots);
  const handleCreateJob = () => {
    const defaultSlots = userDetails?.defaultSlots || 0;
    const addedSlots = userDetails?.addedSlots || 0;
    const totalAllowed = defaultSlots + addedSlots;
    const postedJobsCount = jobPosted?.docs?.length || 0;

    if (postedJobsCount >= totalAllowed) {
      toast.error("You have reached the maximum limit of job posting");
      return;
    }
    dispatch({
      type: ActionType.JOB_DETAILS,
      payload: {},
    });
    saveFile(null)
    navigate("/job-title")
  }

  const handleClear = () => {
    try {
      searchInput.current.value = "";
      setOpportunityType("")
      setSkillType("")
      setRole("")
      setLat()
      setLang()
      setAddress()
      setCity()
      setCountry()
      setCommitment("")
      setDomain("")
    }
    catch (error) {
      console.log('Error:', error)
    }
    finally {
      getCandidatesList()
    }
  }
  const getUser = (userId) => {
    let param = {
    };

    dispatch(getUsersDetails(userId, param, (result) => {
      console.log("🚀 ~ getUser ~ result:", result);
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

  useEffect(() => {
    if (!skillType && !opportunityType)
      getCandidatesList();
  }, [skillType, opportunityType]);

  const saveTalent = (employee_id) => {
    let param = {
      "employerId": userId,
      "talentId": employee_id
    }
    dispatch(saveTalentEmployee(param, (result) => {
      if (result.status) {
        getCandidatesList()
      }
    }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log("skills>>>>>>>>>>", skills)

  return (
    <>
      {loader ? <Loading /> : <div>
        <main className="employer-main-col">
          <div className="container">
            <h1 className="employer-main-text mb-0 ms-0">{getContentByHeading(contentData?.content, 'Welcome Heading', lan)} </h1>
            <p className="employer-p-text">
              {getContentByHeading(contentData?.content, 'Welcome text', lan)}
            </p>
            <div className="d-flex flex-wrap collapsed-selction-items ">
              <div className="emplyoer-selection-items">
                <select
                  name="opportunity-type"
                  id="opportunity-type"
                  placeholder="Type of Opportunity"
                  className="select-employer-dashboard new-select-employer"
                  value={opportunityType}
                  onChange={handleTypeofOpportunity}
                >
                  <option value="">Type of Opportunity</option>
                  {jobType &&
                    jobType?.map((item) => (
                      <option value={item?._id}>{item?.typeName}</option>
                    ))}
                </select>
              </div>
              {/* <select
                name="opportunity-status"
                id="opportunity-status"
                placeholder="opportunity-status"
                className="select-employer-dashboard new-select-employer"
                value={role}
                onChange={handleRole}
              >
                <option value="">Opportunity Role</option>
                {
                  commitmentTypeprofile.map((o) => (
                    <option value={o.value}>{o.label}</option>
                  ))
                }
              </select> */}
              <div className="emplyoer-selection-items">
                <select
                  name="support-roles"
                  id="support-roles"
                  placeholder="support-roles"
                  className="select-employer-dashboard new-select-employer"
                  value={skillType}
                  onChange={handleTypeofSkills}
                >
                  <option value="">Skill</option>
                  {skills &&
                    skills?.map((item) => (
                      <option value={item?._id}>{item?.skillName}</option>
                    ))}
                </select>
              </div>

              <div className="position-relative employer-main-input-col">
                <img
                  src={LocationIcon}
                  alt="location"
                  className="icon-input new-icon-input"
                  placeholder="Location"
                />
                <ReactGoogleAutocomplete
                  className="authfields location-input-col new-location-input-col bg-transparent"
                  ref={searchInput}
                  apiKey={process.env.REACT_APP_GOOGLE_API}
                  types={["(regions)"]}
                  onPlaceSelected={handlePlaceSelected}
                />     <div className="formControls">
                  <span className='current-location new-current-location'
                    onClick={fetchCurrentLocation}
                    type='button'
                  >
                    <img src={currentLocation} alt="current-location" />
                  </span>
                </div>


                {/* {errors.country && <div className="errorMsg">{errors.country.message}</div>} */}
              </div>
              <button className="btn btn-primary search-btn" onClick={() => handleSearch()}>{landingContent?.employerDashbaord?.Search}</button>
              {(skillType || opportunityType || role || lat || lang) && <button className="btn btn-primary clear-btn" onClick={() => handleClear()}>
                {landingContent?.employerDashbaord?.clearButton}
              </button>}
            </div>

          </div>
        </main>

        <section className="py-3">
          <div className="container">
            <div className="d-flex justify-content-between pb-3 flex-column-mobile">
              <div>
                <span className="section-heading-employer">
                  {landingContent?.employerDashbaord?.discoverCandidateHeading}
                </span>
                {/* <button
                className="bg-transparent filter-button-employer"
                onClick={() => {
                  setFilterOn(!filterOn);
                }}
              >
                <img src={filterIcon} alt="filter-icon" />
              </button> */}
              </div>

              <button className="btn-primary employer-img-button" type="button" onClick={() => navigate('/employer-candidates')}>
                {landingContent?.employerDashbaord?.moreCandidateButton} <img src={arrowRight} alt="icon" />
              </button>
            </div>

            {false && (
              <></>
            )}
            {console.log("jobPosted", jobPosted)}
            {jobPosted?.totalDocs > 0 && <div className="employer-outer-wrapper my-5">
              <SimpleSlider jobType={opportunityType} skills={skillType} landingContent={landingContent} latitude={lat} longitude={lang} saveTalent={saveTalent} />
            </div>}

            {jobPosted?.totalDocs == 0 && <div className="no-candidate-info my-5">{landingContent?.tracker?.noApplicationMessageEmployer}</div>}

            <div className="d-flex flex-wrap">
              <div className="column-candidate-cards px-4">
                <div className="d-flex justify-content-between flex-column-mobile">
                  <h2 className="section-heading-employer" >{`${userDetails?.businessName}'s live opportunities`}</h2>

                  <button
                    className="btn-primary employer-img-button"
                    type="button"
                    onClick={() => handleCreateJob()}
                  >
                    {landingContent?.employerDashbaord?.addOpportunityButton}
                    <img src={plusIcon} alt="icon" />
                  </button>
                </div>

                {jobPosted &&
                  jobPosted?.docs?.map((item) => (
                    <EmployerDashboardCard data={item} key={item?._id} />
                  ))}

                {jobPosted?.docs?.length == 0 && <div className="no-candidate-info">No live opportunities yet</div>}

                {/* Pagination */}
                {jobPosted?.docs?.length != 0 && <div className="text-center candidate-icon-col">
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {landingContent?.pagination?.previousButton}
                  </button>
                  <span className="mx-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {landingContent?.pagination?.nextButton}
                  </button>
                </div>}
              </div>

              <div className="column-schedule col-12 px-4">
                <div className="schedule-outer-wrapper custom-calender-block">
                  {/* <Calendar onChange={onChange}
                    value={value}
                    nextLabel={"next"}
                    // next2Label={"next year"}
                    prevLabel={"back"}
                  // prev2Label={"prev year"}
                  /> */}

                  <Calendar onChange={onChange} value={value} />

                  <div className="d-flex pb-2 mt-3 align-items-center schedule-heading-col justify-content-between">
                    <h4 className="mb-0 section-heading-employer">{landingContent?.employerDashbaord?.calenderHeading}</h4>
                    {/* <img src={moreIcon} alt="icon" /> */}
                  </div>

                  {meetingEventsByDate?.docs?.map((o) => (
                    <div className="d-flex gap-1 py-2">
                      <div>
                        <span className="span-cola">
                        </span>
                      </div>
                      <div>
                        <h3 className="title-schedule ">{getCalenderEventTimeZone(o.meetingTime)}</h3>
                        <h5 className="schedule-details">{o.title}</h5>

                        <span className="d-flex align-items-center gap-3">
                          <h4 className="schedule-link mb-0">
                            {o.meetingLink}
                          </h4>
                          <button className="copy-btn" type="button" onClick={() => CopyLink(o.meetingLink)}><img src={copyIcon} alt="copy" /></button>
                        </span>

                      </div>
                    </div>
                  ))}


                  {meetingEventsByDate?.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.employerDashbaord?.No_events_found}</div>}

                  <button className="btn-primary mx-0 w-100 btn" type={'button'} onClick={() => handleCalendarDetails()}>
                    {landingContent?.employerDashbaord?.calenderDetailsButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>}
    </>

  );
}
