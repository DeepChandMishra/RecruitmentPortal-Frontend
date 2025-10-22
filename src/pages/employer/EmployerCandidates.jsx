import React, { useEffect, useRef, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import currentLocation from "../../assets/images/current-location.svg";
import searchIcon from "../../assets/images/MagnifyingGlass.svg";
import filterIcon from "../../assets/images/icon-filter.svg";
import LocationIcon from "../../assets/images/MapPinLine.svg";
import arrowRight from "../../assets/images/ArrowRight.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import profileIcon1 from "../../assets/images/profile-employer.png";
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
import eyeIcon from "../../assets/images/Eye.svg";
import likeIconCol from "../../assets/images/ThumbsUp.svg";
import bookmarkIcon from "../../assets/images/BookmarkSimple.svg";
import dotsIcon from "../../assets/images/DotsThree.svg";
import plusIcon from "../../assets/images/btn-plus.svg";
import LikeIcon from "../../assets/images/HeartStraight.svg";
import moreIcon from "../../assets/images/more-icon.svg";
import profileCandidate1 from "../../assets/images/candidate-profile.png";
import profileCandidate2 from "../../assets/images/candidate-profile-2.png";
import profileCandidate3 from "../../assets/images/candidate-profile-3.png";
import EmployerCandidatesCards from "../../components/cards/EmployerCandidatesCards";
import { jobTypesListing, skillsListing } from "../../redux/actions/common";
import { useDispatch, useSelector } from "react-redux";
import { getCandidates, saveTalentEmployee } from "../../redux/actions/employer";
import { commitmentTypeprofile } from "../../util/contant";
import { useNavigate } from "react-router-dom";
import { ActionType } from "../../redux/action-types";
import { useTranslation } from "react-i18next";


export default function EmployerCandidates() {

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

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";

  //Redux State
  const { jobType, skills } = useSelector((state) => state.common);
  const { filterCandidate } = useSelector((state) => state.employer);
  console.log("🚀 ~ EmployerCandidates ~ filterCandidate:", filterCandidate)
  const userId = localStorage.getItem("userId");
  const searchInput = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const getJobType = () => {
    dispatch(jobTypesListing((result) => { }));
  };

  const getSkills = () => {
    dispatch(skillsListing((result) => { }));
  };

  //Clear filter
  const HandleClearFilter = () => {
    searchInput.current.value = "";
    setSkillType("")
    setOpportunityType("")
    setRole("")
    setLat()
    setLang()
    setAddress()
    setCity()
    setCountry()

  }


  //LOCATION
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
  console.log("lat", lat, "lng", lang);

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


  //Fetch current location 
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  };

  //Get Candidate List
  const getCandidatesList = () => {
    let param = {
      order_by: -1,
      order: 1,
      page_size: 10,
      page: currentPage,
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
          setTotalPages(result?.data?.totalPages)
          setLoader(false);
        }
      })
    );
  };

  useEffect(() => {
    getJobType();
    getSkills();
  }, []);

  useEffect(() => {
    getCandidatesList();
  }, [opportunityType, skillType, currentPage, role, lat, lang]);

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


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateJob = () => {
    dispatch({
      type: ActionType.JOB_DETAILS,
      payload: {},
    });
    navigate("/job-title")
  }

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

  return (
    <div>
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between pb-3 flex-column-mobile">
            <h2 section-heading-employer>
              {landingContent?.employerDashbaord?.employerCandidate?.heading} <span>({filterCandidate.totalDocs})</span>
            </h2>

            {/* <button className="btn-primary employer-img-button" type="button"
              onClick={() => handleCreateJob()
              }>
              {landingContent?.employerDashbaord?.employerCandidate?.addOpprtunityButton}
              <img src={plusIcon} alt="icon" />
            </button> */}
          </div>



          <div className="d-flex employer-outer-wrapper select-employer-row newjob-select-employers over">
            {/* <div className="newjob-select-items">
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
            </div> */}

            <div className="newjob-select-items emplyoer-selection-items">

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
            </div>

            <div className="newjob-select-items emplyoer-selection-items">
              <select
                name="support-roles"
                id="support-roles"
                placeholder="support-roles"
                className="select-employer-dashboard "
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
                  className="location-input-col new-location-input-col bordered-loc-col pac-target-input"
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
            {(skillType || opportunityType || role || lat || lang) && <button className="btn btn-primary m-0" type='button' onClick={HandleClearFilter}>{landingContent?.employerDashbaord?.employerCandidate?.clearButton}</button>}
          </div>

          <div className="">
            {filterCandidate &&
              filterCandidate?.docs?.map((item) => <EmployerCandidatesCards key={item?._id} data={item} saveTalent={saveTalent} />)}
            {filterCandidate?.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.tracker?.noApplicationMessageEmployer}</div>}

            <div className="text-center candidate-icon-col mt-5">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
