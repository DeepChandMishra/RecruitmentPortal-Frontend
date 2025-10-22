import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import DropdownIcon from "../../../assets/images/arrow-dropdown.svg";
import { skillSchema } from "../../../util/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { jobTypesListing, skillsListing } from "../../../redux/actions/common";
import { ActionType } from "../../../redux/action-types";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import locationIcon from "../../../assets/images/location-icon.svg";
import currentLocation from "../../../assets/images/current-location.svg";
import { languageList } from "../../../util/contant";
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from "react-i18next";

const SkillsDetails = () => {

  const [lat, setLat] = useState()
  const [city, setCity] = useState()
  const [lang, setLang] = useState()
  const [state, setState] = useState()
  const [address, setAddress] = useState()
  const [country, setCountry] = useState()
  const [pincode, setPincode] = useState()

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);

  //Redux State 
  const { employeeDetails } = useSelector((state) => state.user);
  const { skills, jobType } = useSelector((state) => state.common);


  const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
  const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';
  const apiKey = 'AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg'


  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)

  //Use Form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(skillSchema),
  });


  const skillOptions = skills?.map((skill) => ({
    value: skill._id,
    label: skill.skillName,
  }));



  useEffect(() => {
    if (employeeDetails) {
      // Filter the skills that match employeeDetails.skills
      let skillsFilter = skillOptions?.filter((o) =>
        employeeDetails?.skills?.includes(o.value)
      );
      let languageFilter = languageList?.filter((o) =>
        employeeDetails?.preferredLanguages?.includes(o.value)
      )
      setValue('skills', skillsFilter);
      setValue('languages', languageFilter)
      setValue('opportunities', employeeDetails?.opportunityType)
      setCity(employeeDetails?.address?.city)
      setState(employeeDetails?.address?.state)
      setCountry(employeeDetails?.address?.country)
      setPincode(employeeDetails?.address?.postal_code)
      setLang(employeeDetails?.address?.location?.coordinates[1])
      setLat(employeeDetails?.address?.location?.coordinates[0])
      if (employeeDetails?.address?.city)
        searchInput.current.value = employeeDetails?.address?.city
    }
  }, []);


  //Location
  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const city = this.city ? this.city + " " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return city;
        // return city + zip + state + this.country;
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


  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  };

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



  const onSubmit = (data) => {
    const selectedSkills = data.skills.map((skill) => skill.value);
    const selectedLanguages = data.languages.map((language) => language.value);
    const SkillsDetails = {
      ...employeeDetails,
      skills: selectedSkills,
      address: {
        city: city,
        state: state,
        country: country,
        postal_code: pincode,
        location: {
          type: "Point",
          coordinates: [
            lat,
            lang
          ]
        }
      },
      preferredLanguages: selectedLanguages,
      opportunityType: data.opportunities,
    };
    dispatch({
      type: ActionType.EMPLOYEE_DETAILS,
      payload: SkillsDetails,
    });
    navigate("/details-file");
  };

  const skillListing = async () => {
    try {
      dispatch(skillsListing((result) => { }));
    } catch (error) { }
  };

  const jobTypeList = async () => {
    try {
      dispatch(
        jobTypesListing((result) => {
        })
      );
    } catch (error) { }
  };

  useEffect(() => {
    skillListing();
    jobTypeList();
  }, []);

  const onerror = (errors) => {
    console.log(errors);
  }

  return (
    <div className="cardcontrols">
      <div className="logo-block text-center mb-5">
        <Link to='/' className='homepage-navigation'>
          <h5 className='back-to-homepage'>{landingContent?.signup?.backButton}</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="cards">
        <div className="titlecards">{landingContent?.signup?.addDetailLabel}</div>
        <div className="formdesign">
          <form onSubmit={handleSubmit(onSubmit, onerror)} autoComplete="off">
            <div className="formControls">
              <label className="customeLabel">{landingContent?.signup?.skillLabel}</label>
              <div>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={skillOptions}
                      isMulti
                      className={`basic-multi-select ${errors.skills ? "is-invalid" : ""
                        }`}
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.skills && (
                  <span className="text-danger">{errors.skills.message}</span>
                )}
                {/* <img
                  src={DropdownIcon}
                  alt="dropdown-icon"
                  className="dropdown-icon"
                /> */}
              </div>
              {/* {errors.skills && (
                <div className="invalid-feedback">{errors.skills.message}</div>
              )} */}
            </div>
            <div className="formControls">
              <label className='customeLabel'>{landingContent?.signup?.location}</label>

              <div className="position-relative">

                <img src={locationIcon} alt="location" className='location-icon' />

                <ReactGoogleAutocomplete
                  className="authfields location-input-col"
                  ref={searchInput}
                  apiKey={process.env.REACT_APP_GOOGLE_API}
                  types={["(regions)"]}
                  required
                  onPlaceSelected={handlePlaceSelected}
                  autoComplete="off"
                />     <div className="formControls mt-3">
                  <span className='current-location skill-current-location'
                    onClick={fetchCurrentLocation}
                    type='button'
                  >
                    <img src={currentLocation} alt="current-location" />
                  </span>
                </div>
              </div>

            </div>
            <div className="formControls">
              <label className="customeLabel">{landingContent?.signup?.lnguagesLabel}</label>
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={languageList}
                    isMulti
                    className={`basic-multi-select ${errors.languages ? "is-invalid" : ""
                      }`}
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.languages && (
                <div className="invalid-feedback">
                  {errors.languages.message}
                </div>
              )}
              <img
                src={DropdownIcon}
                alt="dropdown-icon"
                className="dropdown-icon"
              />
            </div>

            <div className="checkboxes-skills">
              <div className="formControls">
                <label className="customeLabel">{landingContent?.signup?.opportunitiesLabel}</label>
              </div>
              {jobType &&
                jobType.map((jt, index) => (
                  <div className="formControls" key={jt._id}>
                    <div className="checkboxdesign">
                      <label htmlFor={`opportunity-${jt._id}`}>
                        <input
                          type="checkbox"
                          id={`opportunity-${jt._id}`}
                          {...register("opportunities")}
                          value={jt._id}
                          autoComplete="off"
                        />
                        <div className="checkbox__checkmark"></div>
                        <span className="ps-2">{jt.typeName}</span>
                      </label>
                    </div>
                  </div>
                ))}

              {errors.opportunities && (
                <div className="invalid-feedback d-block">
                  {errors.opportunities.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <div className="formControls mt-5">
                <button
                  className="btn border-0 bg-transparent btn-back  w-100"
                  type="button"
                  onClick={() => navigate(-1)} // Go back to the previous page
                >
                  {landingContent?.signup?.backButtonLabel}
                </button>
              </div>
              <div className="formControls mt-5">
                <button className="btn btn-primary w-100" type="submit">
                  {landingContent?.signup?.next_button}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillsDetails;
