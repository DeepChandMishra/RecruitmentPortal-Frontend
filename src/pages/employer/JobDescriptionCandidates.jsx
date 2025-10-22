import React, { useEffect, useRef, useState } from "react";
import bookMarkIcon from "../../assets/images/BookmarkSimple.svg";
import eyeIcon from "../../assets/images/eyenav.svg";
import EmployerHiresCards from "../../components/cards/EmployerHiresCards";
import PreviousHiresCards from "../../components/cards/PreviousHiresCards";
import facebookIcon from "../../assets/images/facebook.svg";
import linkedInIcon from "../../assets/images/linked-in.svg";
import instagramIcon from "../../assets/images/instagram.svg";
import webIcon from "../../assets/images/fb.svg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ListGroup,
  Badge,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import searchIcon from "../../assets/images/search-icon.svg";
import DownloadIcon from "../../assets/images/DownloadSimple.svg";
import searchWhite from "../../assets/images/magnifying-white.svg";
import filterIcon from "../../assets/images/filter.svg";
import EmployerCandidatesCards from "../../components/cards/EmployerCandidatesCards";
import EmployerDashboardCard from "../../components/cards/EmployerDashboardCard";
import editIcon from "../../assets/images/edit-icon-job.svg";
import profileIcon from "../../assets/images/candidate-profile-col.png";
import verifiedIcon from "../../assets/images/verified.svg";
import locationIcon from "../../assets/images/loc.svg";
import bagIcon from "../../assets/images/bags.svg";
import peopleIcon from "../../assets/images/people.svg";
import buildingIcon from "../../assets/images/building.svg";
import fbIcon from "../../assets/images/fbook.svg";
import instIcon from "../../assets/images/inst.svg";
import linkedinIcon from "../../assets/images/li.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getUsersDetails } from "../../redux/actions/common";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployerServices,
  getJobPosted,
  updateEmployer,
} from "../../redux/actions/employer";
import useDebounce from "../../customHook/useDebounce";
import currentLocation from "../../assets/images/current-location.svg";
import { businessSize } from "../../util/contant";
import {
  getSlotSubscriptionInfo,
  getSubscriptionInfo,
} from "../../redux/actions/stripe";
import { formatDateValue } from "../../util/UtilFunction";
import { useTranslation } from "react-i18next";

export default function JobDescriptionCandidates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [lat, setLat] = useState();
  const [city, setCity] = useState();
  const [lang, setLang] = useState();
  const [file, setFile] = useState();
  const [state, setState] = useState();
  const [address, setAddress] = useState();
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState();
  const [pincode, setPincode] = useState();
  const [description, setDescription] = useState("");
  const [businessSizes, setBusinessSizes] = useState();
  const [facebookLink, setFacebookLink] = useState();
  const [instaLink, setInstaLink] = useState();
  const [linkedInLink, setLinkedInLink] = useState();
  const [businessName, setBusinessName] = useState();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [updateEmployerDetails, setUpdateEmployerDetails] = useState();
  const [expanded, setExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState();
  const [uploadType, setUploadType] = useState();
  const [selectedSlotPlan, setSelectedSlotPlan] = useState([]);

  //Redux State
  const { userDetails, subUser } = useSelector((state) => state.user);
  console.log("subUser", subUser);
  const { jobPosted, serviceList } = useSelector((state) => state.employer);
  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  console.log('landingContent', landingContent)

  const debouncedSearchText = useDebounce(searchText, 500);
  const searchInput = useRef(null);

  //showing slots for slot management
  const defaultSlots = userDetails?.defaultSlots || 0;
  const addedSlots = userDetails?.addedSlots || 0;
  const postedJobsCount = jobPosted?.docs?.length || 0;

  console.log('jobs', jobPosted)

  const totalSlots = defaultSlots + addedSlots;
  const availableSlots = Math.max(totalSlots - postedJobsCount, 0);

  //Geo location keys
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";
  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Function to trim text to 4 lines (about 150-200 characters)
  const trimText = (text) => {
    return text?.length > 200 && !expanded ? text.slice(0, 200) + "..." : text;
  };
  //get plan details
  const getPlanDetail = () => {
    dispatch(
      getSubscriptionInfo(id, (result) => {
        if (result.status) {
          setSelectedPlan(result.data[0]);
        }
      })
    );

    dispatch(
      getSlotSubscriptionInfo(id, (result) => {
        if (result.status) {
          setSelectedSlotPlan(result.data);
        }
      })
    );
  };

  console.log("🚀 ~ JobDescriptionCandidates ~ selectedPlan", selectedPlan);

  //Get USer Details
  const getUserDetail = () => {
    dispatch(
      getUsersDetails(id, (result) => {
        console.log("result in job des cand", result);
      })
    );
  };

  useEffect(() => {
    if (userDetails) setUpdateEmployerDetails(userDetails);
  }, [userDetails]);

  //Get Services
  const getServices = () => {
    console.log("getServices");
    dispatch(getEmployerServices(id, (result) => { }));
  };
  //Get Job Post
  const getJobPost = () => {
    let param = {
      sortBy: "",
      limit: 5,
      page_size: 10,
      page: currentPage,
    };

    if (debouncedSearchText !== undefined) {
      param.query = {};
      param.query.search = debouncedSearchText;
    }
    console.log("useEffect called");
    dispatch(
      getJobPosted(param, id, (result) => {
        console.log(result);
        setTotalPages(result?.data?.totalPages);
      })
    );
  };

  console.log("descriptiondesss", description);

  useEffect(() => {
    getJobPost();
  }, [currentPage, debouncedSearchText]);

  useEffect(() => {
    if (id) {
      getUserDetail();
      getServices();
      getJobPost();
      getPlanDetail();
    }
  }, [id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //Location function (Geo Location)
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
        setAddress(_address.plain());
        setCountry(_address.country);
        setState(_address.state);
        setCity(_address.city);
        setPincode(_address.zip);
        setLat(lat);
        setLang(lng);
        searchInput.current.value = _address.plain();
      });
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        reverseGeocode(position.coords);
      });
    }
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

  //Binding Data

  useEffect(() => {
    if (userDetails) handleBindingUserDetails();
    setDescription(userDetails?.description);
  }, [userDetails]);
  console.log("🚀 ~ JobDescriptionCandidates ~ userDetails:", userDetails);

  const handleBindingUserDetails = () => {
    if (userDetails) {
      console.log("called called");
      setInstaLink(userDetails?.instagram);
      setFacebookLink(userDetails?.facebook);
      setBusinessSizes(userDetails?.businessSize);
      setLinkedInLink(userDetails?.linkedIn);
      setBusinessName(userDetails?.businessName);
      setCity(userDetails?.address?.city);
      setState(userDetails?.address?.state);
      setCountry(userDetails?.address?.country);
      setPincode(userDetails?.address?.postal_code);
      setLang(userDetails?.address?.location?.coordinates[1]);
      setLat(userDetails?.address?.location?.coordinates[0]);
      setAddress(userDetails?.address?.complete_address);
      searchInput.current.value = userDetails?.address?.complete_address;
    }
  };

  // Function to handle save
  const handleSave = () => {
    let updatedDetails = { ...updateEmployerDetails };
    updatedDetails.businessName = businessName;
    updatedDetails.linkedIn = linkedInLink;
    updatedDetails.instagram = instaLink;
    updatedDetails.facebook = facebookLink;
    updatedDetails.businessSize = businessSizes;
    updatedDetails.description = description;
    updatedDetails.address = {
      city,
      state,
      country,
      complete_address: address,
      postal_code: pincode,
      location: {
        type: "Point",
        coordinates: [lat, lang],
      },
    };

    setUpdateEmployerDetails({});
    const formData = new FormData();
    if (uploadedImage) {
      formData.append("image", uploadedImage); // Add image to form data
    }

    // Add other form fields
    formData.append("businessName", updatedDetails?.businessName || "");
    formData.append("businessSize", updatedDetails?.businessSize || "");
    formData.append("description", updatedDetails?.description || "");
    formData.append("facebook", updatedDetails?.facebook || "");
    formData.append("instagram", updatedDetails?.instagram || "");
    formData.append("linkedIn", updatedDetails?.linkedIn || "");

    // Add other fields as necessary

    formData.append("address", JSON.stringify(updatedDetails.address));
    const user_id = userDetails?._id;
    console.log("updatedDetails", updatedDetails);

    dispatch(
      updateEmployer(user_id, formData, (result) => {
        if (result?.status) {
          getUserDetail();
        }
      })
    );
  };

  // Dropzone configuration
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 1048576, // 1MB
  });

  return (
    <div>
      <section className="py-5">
        <div className="container">
          <div className="applicant-profile-wrapper pb-3">
            <div className=" applicant-banner">
              <h2 className="text-end">
                We Connect <b>Top Companies</b> <br />
                With Top Companies
              </h2>
            </div>
            <div className="d-flex below-outer-wrapper justify-content-between">
              <div className="d-flex gap-2 flex-column flex-md-row align-items-start align-items-md-center">
                <div className="candidate-img-wrapper">
                  <img
                    src={
                      userDetails?.image === ""
                        ? profileIcon
                        : userDetails?.image
                    }
                    alt="image"
                    className="icon-profile"
                  />
                  <button
                    type="button"
                    className="border-0 bg-transparent"
                    data-bs-toggle="modal"
                    data-bs-target="#imageEdit"
                    onClick={() => setUploadType("profile")}
                  >
                    {/* <img
                      src={editIcon}
                      alt="edit-icon"
                      className="candidate-edit-icon edit-profile-img"
                    /> */}
                  </button>

                  <div
                    className="modal fade"
                    id="imageEdit"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        {/* <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">Update Image</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div> */}
                        {/* <div className="modal-body">
                          <div
                            {...getRootProps()}
                            className="dropzone"
                            style={{
                              border: '2px dashed #cccccc',
                              padding: '20px',
                              textAlign: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p>Drop the files here...</p>
                            ) : uploadedImage || userDetails?.image ? (
                              <div
                                style={{
                                  width: '150px',
                                  height: '150px',
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  margin: '0 auto',
                                }}
                              >
                                <img
                                  src={uploadedImage ? URL.createObjectURL(uploadedImage) : userDetails?.image}
                                  alt="profile"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              </div>
                            ) : (
                              <p>Drag & drop an image here, or click to select one (Max size: 1MB)</p>
                            )}
                          </div>
                        </div> */}
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              setUploadType();
                              handleBindingUserDetails();
                            }}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              handleSave();
                              setUploadType();
                            }}
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="candidate-profile-h-col mb-0">
                    {userDetails?.businessName}{" "}
                    <img src={verifiedIcon} alt="icon" />
                  </h4>
                  {/* <p className="candidate-profile-p-col mb-0">
                    {userDetails?.description}{" "}
                    <button className="border-0 bg-transparent">
                      <img
                        src={editIcon}
                        alt="edit-icon"
                        className="candidate-edit-icon"
                      />
                    </button>
                  </p> */}
                  <div className="d-flex d-fex-list-canditate flex-lg-row flex-column mb-3 mb-lg-0 align-items-start align-items-lg-center">
                    <div className="d-flex ">
                      <h5 className="list-h-col">
                        <img src={locationIcon} alt="icon" />
                        {userDetails?.address?.complete_address}
                      </h5>
                      <h5 className="list-h-col">
                        <img src={peopleIcon} alt="icon" />{" "}
                        {userDetails?.businessSize ?? 0} employees{" "}
                      </h5>
                    </div>
                    {!subUser && (
                      <div className="d-flex flex-sm-row flex-column">
                        <button
                          type="button"
                          className="btn btn-primary border-0" // Add Bootstrap button classes
                          data-bs-toggle="modal"
                          data-bs-target="#languageModalEdit"
                        >
                          {landingContent?.profile?.edit_profile_button}
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary border-0 mt-3 mt-sm-0 mx-0"
                          onClick={() => navigate(`/sub-user`)}
                        >
                          {landingContent?.profile?.user_management_button}
                        </button>
                      </div>
                    )}
                    {/* MODAL FOR UPDATE DETAILS */}
                    <div
                      class="modal fade"
                      id="languageModalEdit"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              Profile Details
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            {/* Image Upload Section */}
                            <div className=" mb-3">
                              <label className="customeLabel">
                                Organization Logo
                              </label>
                              <div
                                {...getRootProps()}
                                className="dropzone"
                                style={{
                                  border: "2px dashed #cccccc",
                                  padding: "20px",
                                  textAlign: "center",
                                  cursor: "pointer",
                                  borderRadius: "10px",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  fileInputRef.current?.click();
                                }}
                              >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                  <p>Drop the image here...</p>
                                ) : uploadedImage || userDetails?.image ? (
                                  <div
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      borderRadius: "50%",
                                      overflow: "hidden",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <img
                                      src={
                                        uploadedImage
                                          ? URL.createObjectURL(uploadedImage)
                                          : userDetails?.image
                                      }
                                      alt="profile"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <p>
                                    Drag & drop an image here, or click to
                                    select (Max: 1MB)
                                  </p>
                                )}
                              </div>
                              {/* <button
                                type="button"
                                className="btn btn-primary mt-2 btn-sm p-1"
                                style={{
                                  marginLeft: "19rem",
                                  lineHeight: "1",
                                  fontSize: "0.75rem",
                                }}
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                              >
                                Upload Image
                              </button> */}
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setUploadedImage(file);
                                  }
                                }}
                              />
                            </div>
                            <div className="formControls  mb-3">
                              <label className="customeLabel">
                                Organization name
                              </label>
                              <input
                                type="text"
                                className="authfields"
                                placeholder="Organization name"
                                autoComplete="off"
                                value={businessName}
                                onChange={(e) =>
                                  setBusinessName(e.target.value)
                                }
                              />
                            </div>

                            <label className="customeLabel">Location</label>
                            <div className="position-relative">
                              <img
                                src={locationIcon}
                                alt="location"
                                className="location-icon"
                              />
                              <ReactGoogleAutocomplete
                                className="authfields location-input-col"
                                ref={searchInput}
                                apiKey={process.env.REACT_APP_GOOGLE_API}
                                types={["(regions)"]}
                                onPlaceSelected={handlePlaceSelected}
                              />{" "}
                              <div className="formControls mt-3">
                                <span
                                  className="current-location"
                                  onClick={fetchCurrentLocation}
                                  type="button"
                                >
                                  <img
                                    src={currentLocation}
                                    alt="current-location"
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="formControls mb-3">
                              <label className="customeLabel">
                                Size of organization
                              </label>
                              <div className={`form-group modalformGroup`}>
                                <select
                                  className="form-select"
                                  value={businessSizes}
                                  onChange={(e) =>
                                    setBusinessSizes(e.target.value)
                                  }
                                >
                                  <option value="" disabled>
                                    Select size of organization
                                  </option>
                                  {businessSize?.map((s, i) => (
                                    <option key={i} value={s.name}>
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start mb-2 py-2 social-row flex-column">
                              <div className="social-icon-wrapper modal-social-icons">
                                <img src={linkedInIcon} alt="icon" />
                              </div>
                              <div className="formControls flex-grow-1 mb-0">
                                <input
                                  type="text"
                                  className="authfields"
                                  placeholder="LinkedIn URL"
                                  autoComplete="off"
                                  value={linkedInLink}
                                  onChange={(e) =>
                                    setLinkedInLink(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start mb-2 py-2 social-row flex-column">
                              <div className="social-icon-wrapper modal-social-icons">
                                <img src={instIcon} alt="icon" />
                              </div>
                              <div className="formControls flex-grow-1 mb-0">
                                <input
                                  type="text"
                                  className="authfields"
                                  placeholder="Instagram URL"
                                  autoComplete="off"
                                  value={instaLink}
                                  onChange={(e) => setInstaLink(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start mb-2 py-2 social-row flex-column">
                              <div className="social-icon-wrapper modal-social-icons">
                                <img src={webIcon} alt="icon" />
                              </div>
                              <div className="formControls flex-grow-1 mb-0">
                                <input
                                  type="text"
                                  className="authfields"
                                  placeholder="Facebook URL"
                                  autoComplete="off"
                                  value={facebookLink}
                                  onChange={(e) =>
                                    setFacebookLink(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="formControls">
                              <label className="customeLabel">
                                Description of your organisation
                              </label>

                              <ReactQuill
                                theme="snow"
                                value={description}
                                modules={{
                                  toolbar: [
                                    [
                                      { bold: true },
                                      { italic: true },
                                      { underline: true },
                                    ],
                                    [{ list: "bullet" }],
                                    [{ list: "ordered" }],
                                  ],
                                }}
                                onChange={setDescription}
                                style={{ height: "auto" }}
                              />
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={() => handleBindingUserDetails()}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              class="btn btn-primary"
                              data-bs-dismiss="modal"
                              onClick={() => handleSave()}
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-md-center prem_btn flex-column flex-md-row align-items-start">
                    <button
                      type="button"
                      className="bg-primary  m-0 py-1 px-3 border-0 rounded"
                    >
                      {" "}
                      {selectedPlan?.PlanDetails?.title}
                    </button>
                    <p className="ms-md-3 mt-2 mt-md-0 mb-0">
                      Expired on {formatDateValue(selectedPlan?.expiry)}
                    </p>
                    {selectedPlan?.PlanDetails?.recurring ? (
                      <p className="ms-md-3 mb-0">(Auto Renewal)</p>
                    ) : (
                      <p className="ms-md-3 mb-0">(One Time)</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex gap-2">
                  {userDetails?.facebook !== "" && (
                    <img
                      src={fbIcon}
                      alt="icon"
                      className="social-icon-employer"
                      onClick={() =>
                        window.open(userDetails?.facebook, "_blank")
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  {userDetails?.instagram !== "" && (
                    <img
                      src={instIcon}
                      alt="icon"
                      className="social-icon-employer"
                      onClick={() =>
                        window.open(userDetails?.instagram, "_blank")
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  {userDetails?.linkedIn !== "" && (
                    <img
                      src={linkedinIcon}
                      alt="icon"
                      className="social-icon-employer"
                      onClick={() =>
                        window.open(userDetails?.linkedIn, "_blank")
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="job-dec-candidate-wrapper my-4 d-flex justify-content-between align-items-start flex-column flex-md-row">
            <div>
              <h2 className="heading-cols">{landingContent?.profile?.slot_management_label}</h2>
              <span>{landingContent?.profile?.available_slots}: {availableSlots}</span>
              <br />
              <span>{landingContent?.profile?.total_slots}: {totalSlots}</span>
              {console.log("userDetails?.defaultSlots", selectedSlotPlan)}

              {selectedSlotPlan?.map((plan) => (
                <div
                  key={plan._id}
                  className="d-flex align-items-md-center prem_btn flex-column flex-md-row align-items-start mt-3"
                >
                  <button
                    type="button"
                    className="bg-primary m-0 py-1 px-3 border-0 rounded"
                  >
                    {plan?.SlotPlanDetails?.title}
                  </button>
                  <p className="ms-md-3 mt-2 mt-md-0 mb-0">
                    Expires on {formatDateValue(plan?.expiry)}
                  </p>
                  {plan?.SlotPlanDetails?.recurring ? (
                    <p className="ms-md-3 mb-0">(Auto Renewal)</p>
                  ) : (
                    <p className="ms-md-3 mb-0">(One Time)</p>
                  )}
                </div>
              ))}
            </div>

            {!subUser && (
              <button
                type="button"
                className="btn btn-primary border-0 mt-3 mt-md-0"
                onClick={() => navigate("/buy-slot")}
              >
                {landingContent?.profile?.buy_slot_button}
              </button>
            )}
          </div>

          <div className="job-dec-candidate-wrapper my-4">
            <div className="d-flex justify-content-between">
              <h2 className="heading-cols">{landingContent?.profile?.organization_description_label}:</h2>

              {/* <button type="button" class="border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#languageModalEditDes">

                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="candidate-edit-icon"
                />
              </button> */}
            </div>

            <div
              class="modal fade"
              id="languageModalEditDes"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Update Details
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div className="formControls">
                      <label className="customeLabel">
                        Description of your organisation
                      </label>

                      {/* <ReactQuill
                        theme="snow"
                        value={userDetails?.description}
                        modules={{
                          toolbar: [
                            [{ 'bold': true }, { 'italic': true }, { 'underline': true }],
                            [{ 'list': 'bullet' }],
                            [{ 'list': 'ordered' }]
                          ]
                        }}
                        onChange={setDescription}
                        style={{ height: "auto" }}
                      /> */}
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => handleBindingUserDetails()}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={() => handleSave()}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <p className="para-col">{trimText(userDetails?.description)}</p> */}
            <p
              dangerouslySetInnerHTML={{
                __html: trimText(userDetails?.description),
              }}
            ></p>
            <button className="bg-transparent border-0" onClick={toggleExpand}>
              {expanded ? "See Less" : "See More"}
            </button>

            <div className="d-flex justify-content-between py-2">
              <h2 className="heading-cols">Services</h2>

              {/* <button className="border-0 bg-transparent">
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="candidate-edit-icon"
                />
              </button> */}
            </div>

            <div className="d-flex gap-2">
              {serviceList &&
                serviceList.map((item) => (
                  <p className="opportunity-type-text mb-0 ">
                    {item?.categoryName}
                  </p>
                ))}
            </div>
          </div>

          <h2 className="hire-nav-heading py-2">{landingContent?.profile?.active_opportunities_label}</h2>

          <InputGroup className="mb-3 input-search">
            <input
              type="search"
              value={searchText}
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={(e) => setSearchText(e.target.value)}
            />

            <img src={searchIcon} alt="search-icon" />
          </InputGroup>
          {jobPosted &&
            jobPosted?.docs?.map((job) => <EmployerDashboardCard data={job} />)}
          {jobPosted.totalDocs != 0 ? <div className="text-center candidate-icon-col">
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div> : <div className="no-candidate-info">No record available </div>}
        </div>
      </section>
    </div>
  );
}
