import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jobTypesListing, skillsListing } from "../../redux/actions/common";
import { getJobPosted } from "../../redux/actions/employer";
import plusIcon from "../../assets/images/btn-plus.svg";
import EmployerDashboardCard from "../../components/cards/EmployerDashboardCard";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import LocationIcon from "../../assets/images/MapPinLine.svg";
import currentLocation from "../../assets/images/current-location.svg";
import { commitmentTypeprofile } from "../../util/contant";
import { ActionType } from "../../redux/action-types";
import { useTranslation } from "react-i18next";
import Loading from "../../components/loader";
import { useCommonContext } from "../../context/commonContext";
import { toast } from "react-toastify";
import { hiringTimelineList } from "../../redux/actions/jobposting";
import { userSlotSubscriptionPlan } from "../../redux/actions/user";

export default function EmployerJobPosted() {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [opportunityType, setOpportunityType] = useState(null);
  const [skillType, setSkillType] = useState(null);
  const [role, setRole] = useState(null);
  const [lat, setLat] = useState();
  const [city, setCity] = useState();
  const [lang, setLang] = useState();
  const [state, setState] = useState();
  const [address, setAddress] = useState();
  const [country, setCountry] = useState();
  const [pincode, setPincode] = useState();
  const [loader, setLoader] = useState(false)
  const [hiringTimeline, setHiringTimeline] = useState();


  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";

  //Redux State
  const { jobPosted } = useSelector((state) => state.employer);
  const { userDetails } = useSelector((state) => state.user);
  const { jobType, skills } = useSelector((state) => state.common);
  const { jobUrgencyList } = useSelector((state) => state.jobposting)

  const userId = localStorage.getItem("userId");
  const { fileData, saveFile } = useCommonContext();

  //Clear filter
  const HandleClearFilter = () => {
    searchInput.current.value = "";
    setSkillType("")
    setOpportunityType("")
    setRole("")
    setHiringTimeline("")
    setLat()
    setLang()
    setAddress()
    setCity()
    setCountry()
  }

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
  // console.log("lat", lat, "lng", long);

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

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  };

  const getJobType = () => {
    dispatch(jobTypesListing((result) => { }));
  };

  const getSkills = () => {
    dispatch(skillsListing((result) => { }));
  };

  const getjobPost = () => {
    console.log("jobPosted", hiringTimeline,role)
    try {
      setLoader(true)
      let param = {
        order_by: "",
        order: -1,
        page_size: pageSize,
        page: currentPage,
      };

      if (role || opportunityType || skillType || lat || lang || hiringTimeline) param.query = {};
      if (role) param.query.role = role;
      if (opportunityType) param.query.jobType = [opportunityType];
      if (skillType) param.query.skills = [skillType];
      if (lat) param.query.latitude = lat;
      if (lang) param.query.longitude = lang;
      if (hiringTimeline) param.query.hiringTimeline = hiringTimeline;

      dispatch(
        getJobPosted(param, userId, (result) => {
          if (result.status) {
            setTotalPages(result?.data?.totalPages);
            setLoader(false)

          }
        })
      );
    }
    catch (error) {
      console.log('Error:', Error)
    }
    finally {
    }
  };

  const getHiringTimeline = () => {
    dispatch(hiringTimelineList((result) => {
      if (result.status) {
        console.log("result:", result)
      }
    }
    ));
  }

  useEffect(() => {
    getJobType();
    getSkills();
    getHiringTimeline();
  }, []);

  useEffect(() => {
    getjobPost();
  }, [role, opportunityType, skillType, currentPage, lat,hiringTimeline,lang]);

  const handleTypeofOpportunity = (e) => {
    setCurrentPage(1)
    setOpportunityType(e.target.value);
  };

  const handleHiringTimeline = (e) => {
    setHiringTimeline(e.target.value)
  }
  const handleTypeofSkills = (e) => {
    setCurrentPage(1)
    setSkillType(e.target.value);
  };

  const handleRole = (e) => {
    setCurrentPage(1)
    setRole(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateJob = () => {
    const defaultSlots = userDetails?.defaultSlots || 0;
    const addedSlots = userDetails?.addedSlots || 0;
    const totalAllowed = defaultSlots + addedSlots;
    const postedJobsCount = jobPosted?.docs?.length || 0;
  console.log("totalAllowed", totalAllowed, "postedJobsCount", postedJobsCount)
    if (postedJobsCount >= totalAllowed) {
      toast.error("You have reached the maximum limit of job posting");
      return;
    }
    // dispatch(userSlotSubscriptionPlan((result) => {
    //   if (result.status) {
    //     console.log("of plans:", result)
    //   }
    // }));
    dispatch({
      type: ActionType.JOB_DETAILS,
      payload: {},
    });
    saveFile(null)
    navigate("/job-title")
  }

  return (
    <div>
      {loader && <Loading />}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between pb-3 flex-column-mobile">
            <h2 className="section-heading-employer">
              {landingContent?.employerDashbaord?.employerOpportunityPost?.heading} <span>({(jobPosted && jobPosted?.totalDocs) ? jobPosted?.totalDocs : 0})</span>
            </h2>

            <button
              className="btn-primary primary-employer-btn employer-img-button"
              type="button"
              onClick={() =>
                handleCreateJob()
              }
            >
              {landingContent?.employerDashbaord?.employerOpportunityPost?.addOpprtunityButton}
              <img src={plusIcon} alt="icon" />
            </button>
          </div>

          <div className="d-flex employer-outer-wrapper select-employer-row newjob-select-employers">
            <div className="newjob-select-items emplyoer-selection-items">
              <select
                name="opportunity-status"
                id="opportunity-status"
                placeholder="opportunity-status"
                className="select-employer-dashboard"
                value={role}
                onChange={handleRole}
              >
                <option value="">Opportunity role</option>
                {
                  commitmentTypeprofile.map((o) => (
                    <option value={o.value}>{o.label}</option>
                  ))
                }
              </select>
            </div>

            <div className="newjob-select-items emplyoer-selection-items">
              <select
                name="opportunity-type"
                id="opportunity-type"
                placeholder="opportunity-type"
                className="select-employer-dashboard"
                value={opportunityType}
                onChange={handleTypeofOpportunity}
              >
                <option value="">Type of opportunity</option>
                {jobType &&
                  jobType?.map((item) => (
                    <option value={item?._id}>{item?.typeName}</option>
                  ))}
              </select>
            </div>

            {/* joburgency */}
            <div className="newjob-select-items emplyoer-selection-items">
              <select
               name="hiringTimeline"
                id="hiringTimeline"
                placeholder="hiringTimeline"
                className="select-employer-dashboard"
                 value={hiringTimeline}
                  onChange={handleHiringTimeline}>
                <option value="">Job urgency</option>
                {
                  jobUrgencyList?.map((urgency, index) => (
                    <option key={index} value={urgency}>{urgency}</option>
                  ))
                }

              </select>
            </div>

            <div className="newjob-select-items emplyoer-selection-items">

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
            </div>


            <div className="newjob-select-items emplyoer-selection-items">

              <div className="position-relative employer-main-input-col">
                <img
                  src={LocationIcon}
                  alt="location"
                  className="icon-input"
                  placeholder="Location"
                />
                <ReactGoogleAutocomplete
                  ref={searchInput}
                  apiKey={process.env.REACT_APP_GOOGLE_API}
                  types={["(regions)"]}
                  onPlaceSelected={handlePlaceSelected}
                  className=" location-input-col new-location-input-col bordered-loc-col"

                />{" "}
                <div className="formControls mt-3">
                  <span
                    className="current-location"
                    onClick={fetchCurrentLocation}
                  >
                    <img src={currentLocation} alt="current-location" />
                  </span>
                </div>
                {/* {errors.country && <div className="errorMsg">{errors.country.message}</div>} */}
              </div>
            </div>
            {(skillType || opportunityType || role || lat || lang || hiringTimeline) && <button className="btn btn-primary" type='button' onClick={HandleClearFilter}>{landingContent?.employerDashbaord?.employerOpportunityPost?.clearButton}</button>}
          </div>
          {loader ? <Loading /> : <div className="">
            {jobPosted && jobPosted?.totalDocs !== 0 ?
              jobPosted?.docs?.map((item) => (
                <div key={item?._id}>
                  <EmployerDashboardCard data={item} key={item?._id} />
                </div>
              )) : <div className="no-candidate-info">No record available </div>}

            {jobPosted?.totalDocs !== 0 && <div className="text-center candidate-icon-col">
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {landingContent?.pagination?.previousButton}
              </button>
              <span class="mx-3">
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
          </div>}

        </div>
      </section>
    </div>
  );
}