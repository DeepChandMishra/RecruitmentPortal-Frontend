import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import addIcon from "../../assets/images/Plus.svg";
import { useDispatch, useSelector } from "react-redux";
import uploadIcon from "../../assets/images/upload.svg";
import AvatarIcon from "../../assets/images/Avatar.png";
import EditIcon from "../../assets/images/edit-icon.svg";
import uploadedIcon from "../../assets/images/uploaded.svg";
import { updateEmployer } from "../../redux/actions/employer";
import { updateEmployee } from "../../redux/actions/employee";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import locationIcon from "../../assets/images/location-icon.svg";
import currentLocation from "../../assets/images/current-location.svg";
import {
  getUsersDetails,
  jobTypesListing,
  skillsListing,
} from "../../redux/actions/common";
import {
  commitmentType,
  commitmentTypeprofile,
  languageList,
} from "../../util/contant";
import Loading from "../../components/loader";
import { blankProfile } from "../../util/UtilFunction";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { useTranslation } from "react-i18next";

const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

// const popover = new bootstrap.Popover('.popover-dismiss', {
//     trigger: 'focus'
//   })

export default function ProfileUser() {
  const [lat, setLat] = useState();
  const [city, setCity] = useState();
  const [lang, setLang] = useState();
  const [file, setFile] = useState();
  const [state, setState] = useState();
  const [address, setAddress] = useState();
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState();
  const [pincode, setPincode] = useState();
  const [lastName, setLastName] = useState();
  const [language, setLanguage] = useState();
  const [firstName, setFirstName] = useState();
  const [fileName, setFileName] = useState("");
  const [uploadType, setUploadType] = useState();
  const [skillsData, setSkillsData] = useState([]);
  const [description, setDescription] = useState();
  const [jobTypeData, setJobTypeData] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [opportunityTitle, setOpportunityTitle] = useState();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState();
  const [upload, setUpload] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode
  const [showModal, setShowModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  //Redux State
  const { userDetails } = useSelector((state) => state.user);
  const { allUserDetails } = useSelector((state) => state.common);
  const { skills, jobType } = useSelector((state) => state.common);
  const user_id = localStorage.getItem("userId");
  const [updatedDetails, setUpdatedDetails] = useState(allUserDetails);

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  console.log('params', landingContent)

  const resumeLink = allUserDetails?.resume;

  //Geo location keys
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";
  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = "AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg";

  //User Address Details
  let userAddress = updatedUserDetails?.address && updatedUserDetails?.address;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  useEffect(() => {
    setUpdatedUserDetails(allUserDetails);
  }, [allUserDetails]);

  useEffect(() => {
    const skillOptions = skills?.map((skill) => ({
      value: skill._id,
      label: skill.skillName,
    }));

    const jobTypeOptions = jobType?.map((job) => ({
      value: job._id,
      label: job.typeName,
    }));
    setSkillOptions(skillOptions);
    setJobTypeOptions(jobTypeOptions);
  }, [skills, jobType]);

  useEffect(() => {
    if (allUserDetails) setUpdatedUserDetails(allUserDetails);
  }, []);

  //Get User Details
  const getUserDetails = (user_id) => {
    dispatch(getUsersDetails(user_id, (result) => { }));
  };

  useEffect(() => {
    if (user_id) getUserDetails(user_id);
  }, []);

  //Update Empoyer Profile Data
  const updateEmployerFunction = (params) => {
    dispatch(
      updateEmployer(params, (result) => {
        console.log("result", result);
      })
    );
  };

  //Update Employee Profile Data
  const updateEmployeeFunction = (_id, params) => {
    dispatch(
      updateEmployee(_id, params, (result) => {
        console.log("result", result);
        if (result.status) {
          getUserDetails(_id);
        }
      })
    );
  };

  //On Submitted Updated Details .
  const handleUpdateSave = (updatedDetails) => {
    try {
      setLoader(true);
      let user_id = updatedUserDetails._id;
      let user_role = updatedUserDetails.role;
      let param = updatedDetails;

      if (user_role == "employer") {
        // updateEmployerFunction()
      } else if (user_role == "employee") {
        updateEmployeeFunction(user_id, param);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoader(false);
      setUpload(false);
    }
  };

  //Drop Zone Function
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
      setUploadedImage(acceptedFiles[0]);
    }
  };

  //Drop Zone Function for PDF && other File
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*, application/pdf",
    maxSize: 1048576, // 1MB
  });

  //handle Resume Download
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = allUserDetails?.resume;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //Skill Listing
  const skillListing = async () => {
    try {
      dispatch(skillsListing((result) => { }));
    } catch (error) { }
  };

  //Job Type
  const jobTypeList = async () => {
    try {
      dispatch(jobTypesListing((result) => { }));
    } catch (error) { }
  };

  useEffect(() => {
    skillListing();
    jobTypeList();
  }, []);

  useEffect(() => {
    handleBindingUserDetails();
  }, [skills, skillOptions]);

  //Handle User Details Binding
  const handleBindingUserDetails = () => {
    if (allUserDetails) {
      let languageFilter = languageList?.filter((o) =>
        allUserDetails?.preferredLanguages?.includes(o.value)
      );
      console.log(
        "🚀 ~ handleBindingUserDetails ~ languageFilter:",
        languageFilter,
        languageList
      );
      let skillsFilter = skillOptions?.filter((o) =>
        allUserDetails?.skills?.includes(o.value)
      );

      let jobTypeFilter = jobTypeOptions?.filter((o) =>
        allUserDetails?.opportunityType?.includes(o.value)
      );
      setFirstName(allUserDetails?.firstname);
      setLastName(allUserDetails?.lastname);
      setCity(allUserDetails?.address?.city);
      setState(allUserDetails?.address?.state);
      setCountry(allUserDetails?.address?.country);
      setPincode(allUserDetails?.address?.postal_code);
      setLang(allUserDetails?.address?.location?.coordinates[1]);
      setLat(allUserDetails?.address?.location?.coordinates[0]);
      setDescription(allUserDetails?.description);
      setLanguage(languageFilter);
      setSkillsData(skillsFilter);
      setOpportunityTitle(allUserDetails?.title);
      setJobTypeData(jobTypeFilter);
      if (allUserDetails?.address?.city)
        searchInput.current.value = allUserDetails?.address?.country;
    }
  };

  //handleSaveUserDetails
  const handleSaveUserDetails = (details) => {
    setUpdatedUserDetails(details);
    console.log("Updated User Details:", updatedUserDetails);
  };

  //handleclose
  const handleclose = () => {
    setShowModal(false);
    setIsEditMode(false); // Reset edit mode when closing the modal
  };

  //Handle Save
  // const handleSave = (type) => {
  //   try {
  //     let updatedDetails = { ...updatedUserDetails };

  //     switch (type) {
  //       case "language":
  //         updatedDetails.preferredLanguages = language?.map(
  //           (lang) => lang.value
  //         );
  //         break;

  //       case "skills":
  //         const skillIds = skillsData.map((skill) => skill.value);
  //         updatedDetails.SkillsData = skillOptions
  //           ?.filter((option) => skillIds.includes(option.value))
  //           .map((option) => ({
  //             ...option,
  //             _id: option.value,
  //             skillName: skillsData.find(
  //               (skill) => skill.value === option.value
  //             )?.label,
  //           }));
  //         updatedDetails.skills = skillIds;
  //         break;

  //       case "location":
  //         updatedDetails.address = {
  //           city,
  //           state,
  //           country,
  //           complete_address: address,
  //           postal_code: pincode,
  //           location: {
  //             type: "Point",
  //             coordinates: [lat, lang],
  //           },
  //         };
  //         break;

  //       case "jobtype":
  //         const jobIds = jobTypeData.map((job) => job.value);
  //         updatedDetails.JobTypeData = jobTypeOptions
  //           ?.filter((option) => jobIds.includes(option.value))
  //           .map((option) => ({
  //             ...option,
  //             _id: option.value,
  //             typeName: jobTypeData.find((job) => job.value === option.value)
  //               ?.label,
  //           }));
  //         updatedDetails.opportunityType = jobIds;
  //         break;

  //       case "title":
  //         updatedDetails.title = opportunityTitle;
  //         break;

  //       case "resume":
  //         updatedDetails.file = file;
  //         updatedDetails.fileType = "resume";
  //         break;

  //       case "description":
  //         updatedDetails.description = description;
  //         break;

  //       case "name":
  //         updatedDetails.firstname = firstName;
  //         updatedDetails.lastname = lastName;
  //         break;

  //       case "image":
  //         updatedDetails.file = uploadedImage;
  //         updatedDetails.fileType = "profile";
  //         break;

  //       default:
  //         console.warn(`Unknown save type: ${type}`);
  //         return;
  //     }

  //     setUpdatedUserDetails(updatedDetails);
  //     handleUpdateSave(updatedDetails);
  //   } catch (error) {
  //     console.error("Error saving details:", error);
  //   } finally {
  //     setFile(null);
  //     setFileName("");
  //     setUploadedImage(null);
  //   }
  // };

  const handleSave = (type) => {
    try {
      let updatedDetails = { ...updatedUserDetails };

      // Handle image and resume separately
      if (type === "resume") {
        updatedDetails.file = file;
        updatedDetails.fileType = "resume";
      } else {
        // Unified form updates
        updatedDetails = {
          ...updatedDetails,
          file: uploadedImage,
          fileType: "profile",
          preferredLanguages: language?.map((lang) => lang.value),
          skills: skillsData.map((skill) => skill.value),
          SkillsData: skillOptions
            ?.filter((option) =>
              skillsData.map((s) => s.value).includes(option.value)
            )
            .map((option) => ({
              ...option,
              _id: option.value,
              skillName: skillsData.find((s) => s.value === option.value)
                ?.label,
            })),
          address: {
            city,
            state,
            country,
            complete_address: address,
            postal_code: pincode,
            location: {
              type: "Point",
              coordinates: [lat, lang],
            },
          },
          JobTypeData: jobTypeOptions
            ?.filter((option) =>
              jobTypeData.map((j) => j.value).includes(option.value)
            )
            .map((option) => ({
              ...option,
              _id: option.value,
              typeName: jobTypeData.find((j) => j.value === option.value)
                ?.label,
            })),
          opportunityType: jobTypeData.map((job) => job.value),
          title: opportunityTitle,
          description: description,
          firstname: firstName,
          lastname: lastName,
        };
      }

      setUpdatedUserDetails(updatedDetails);
      handleUpdateSave(updatedDetails);
    } catch (error) {
      console.error("Error saving details:", error);
    } finally {
      setFile(null);
      setFileName("");
      setUploadedImage(null);
    }
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
        setAddress(_address.country);
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

  const handleQuillChange = (content) => {
    const plainText = content.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags to count characters
    if (plainText.length <= charLimit) {
      setValues(content); // Update the Quill content if within limit
      setCharCount(plainText.length); // Update the character count
    } else {
      // If character count exceeds limit, slice the content to fit within 500 chars
      const trimmedText = plainText.slice(0, charLimit);
      const regex = new RegExp(
        `^${trimmedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` // Escape regex special characters in the plain text
      );
      const matchedHTML = content.match(regex);

      // Set the trimmed HTML back to ReactQuill
      setValues(matchedHTML ? matchedHTML[0] : content.slice(0, charLimit));
    }
  };

  const renderResumePreview = () => {
    if (!resumeLink) {
      return <p>No resume available</p>;
    }

    const fileExtension = resumeLink.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      // If the file is an image
      return (
        <img
          src={resumeLink}
          alt="Resume Preview"
          className="resume-preview-image"
          style={{ width: "100%", height: "500px", objectFit: "contain" }}
        />
      );
    } else if (fileExtension === "pdf") {
      // If the file is a PDF
      return (
        <iframe
          src={resumeLink}
          title="PDF Preview"
          style={{ width: "100%", height: "500px" }}
          frameBorder="0"
        />
      );
    } else if (["doc", "docx"].includes(fileExtension)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${resumeLink}&embedded=true`}
          style={{ width: "100%", height: "600px" }}
          title="Resume DOC/DOCX"
        />
      );
    } else {
      return <p>Unsupported file format</p>;
    }
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };

  return (
    <div>
      {loader && <Loading />}
      <main className="job-main-col pt-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-0 ">
            <div className="col-lg-5 col-12">
              {/* Profile Image */}
              <div className="d-flex employee-profile-row">
                <div>
                  <img
                    src={
                      allUserDetails?.image
                        ? allUserDetails?.image
                        : blankProfile()
                    }
                    alt="profile"
                    className="img-col"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="border-0 bg-transparent"
                    data-bs-toggle="modal"
                    data-bs-target="#imageEdit"
                    onClick={() => setUploadType("profile")}
                  >
                    {/* <img src={EditIcon} alt="edit" /> */}
                  </button>
                  <div
                    className="modal fade"
                    id="imageEdit"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    {/* <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Update Image
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div
                            {...getRootProps()}
                            className="dropzone"
                            style={{
                              border: "2px dashed #cccccc",
                              padding: "20px",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p>Drop the files here...</p>
                            ) : uploadedImage || allUserDetails?.image ? (
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
                                      ? URL?.createObjectURL(uploadedImage)
                                      : allUserDetails?.image
                                  }
                                  alt="profile"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  acc
                                />
                              </div>
                            ) : (
                              <p>
                                Drag & drop an image or PDF here, or click to
                                select one (Max size: 1MB)
                              </p>
                            )}
                          </div>
                        </div>
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
                              handleSave("image");
                              setUploadType();
                            }}
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* User Name */}
                <div className="w-100">
                  <h2 className="mb-0">{`${updatedUserDetails?.firstname} ${updatedUserDetails?.lastname}`}</h2>
                  <div>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target="#userName"
                    >
                      {/* <img src={EditIcon} alt="edit" className="me-2" />   */}
                    </button>

                    {/* Main Modal */}
                    <div
                      class="modal fade"
                      id="userName"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              Edit Profile
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          {/* First Name */}
                          <div class="modal-body">
                            <div>
                              <div className="formControls mb-4">
                                <label className="customeLabel">
                                  Profile Image
                                </label>
                                <div className="d-flex flex-column gap-2 mt-0 align-items-center">
                                  <div
                                    {...getRootProps()}
                                    className="dropzone"
                                    style={{
                                      border: "2px dashed #cccccc",
                                      padding: "20px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      flex: 1,
                                      width: "100%",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                      <p>Drop the image here...</p>
                                    ) : uploadedImage ||
                                      allUserDetails?.image ? (
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
                                              ? URL?.createObjectURL(
                                                uploadedImage
                                              )
                                              : allUserDetails?.image
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
                                        Drag & drop an image or click to upload
                                        (Max size: 1MB)
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm p-1"
                                    style={{
                                      marginLeft: "19rem",
                                      lineHeight: "1",
                                      fontSize: "0.75rem",
                                    }}
                                    onClick={() =>
                                      document
                                        .getElementById("fileInput")
                                        .click()
                                    }
                                  >
                                    Upload Image
                                  </button>
                                  <input
                                    id="fileInput"
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
                              </div>
                              <div className="formControls mt-3">
                                <label className="customeLabel">
                                  First Name
                                </label>
                                <div className="position-relative">
                                  <input
                                    type={"text"}
                                    value={firstName}
                                    className="authfields"
                                    placeholder="First Name"
                                    onChange={(e) =>
                                      setFirstName(e.target.value)
                                    }
                                    autoComplete="off"
                                  />
                                </div>
                                {/* Last Name */}
                                <div className="formControls mt-3">
                                  <label className="customeLabel">
                                    Second Name
                                  </label>
                                  <div className="position-relative">
                                    <input
                                      type={"text"}
                                      value={lastName}
                                      className="authfields"
                                      placeholder="Second Name"
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>

                                {/* Opportunity title */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">
                                    Opportunity title
                                  </label>
                                  <div className="position-relative">
                                    <input
                                      type={"text"}
                                      value={opportunityTitle}
                                      className="authfields"
                                      placeholder="Opportunity Title"
                                      onChange={(e) =>
                                        setOpportunityTitle(e.target.value)
                                      }
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>

                                {/* Location */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">
                                    Location
                                  </label>
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
                                </div>

                                {/* Language */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">
                                    Language
                                  </label>
                                  <Select
                                    value={language}
                                    options={languageList}
                                    isMulti
                                    onChange={(e) => setLanguage(e)}
                                    className={`basic-multi-select`}
                                    classNamePrefix="select"
                                    styles={{
                                      width: "100%",
                                      maxWidth: "600px",
                                    }}
                                  />
                                </div>

                                {/* Opportunity */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">
                                    Opportunity
                                  </label>
                                  <Select
                                    options={jobTypeOptions}
                                    isMulti
                                    value={jobTypeData}
                                    onChange={(e) => setJobTypeData(e)}
                                    classNamePrefix="select"
                                  />
                                </div>

                                {/* Skills */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">Skills</label>
                                  <Select
                                    options={skillOptions}
                                    isMulti
                                    value={skillsData}
                                    onChange={(e) => setSkillsData(e)}
                                    classNamePrefix="select"
                                  />
                                </div>

                                {/* Description */}
                                <div className="formControls  mt-3">
                                  <label className="customeLabel">
                                    Description
                                  </label>
                                  <div className="position-relative">
                                    <ReactQuill
                                      theme="snow"
                                      value={description}
                                      onChange={setDescription}
                                      style={{ height: "auto" }}
                                    />
                                  </div>
                                </div>
                              </div>
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
                              onClick={() => {
                                handleSave("name");
                              }}
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 row-progress align-items-center w-100">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${Math.round(
                            updatedUserDetails?.profilePercentage
                          )}%`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span>
                      {Math.round(updatedUserDetails?.profilePercentage)}%
                    </span>
                    {/* <button className='btn profile-btn btn-primary'>Complete Your Profile</button> */}
                  </div>
                  <p className="location-col">{`${userAddress?.city}, ${userAddress?.country}`}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-12 buttons-center-tab text-lg-end candidate_btn">
              <button
                className="btn bottom-margin btn-outline"
                type="button"
                onClick={handleChangePassword}
              >
                {landingContent?.profile?.change_password_button}
              </button>
              <button
                className="btn bottom-margin btn-outline"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#userName"
              >
                {landingContent?.profile?.edit_profile_button}

              </button>
              <button
                className="btn bottom-margin btn-outline"
                type="button"
                onClick={() => {
                  updatedUserDetails._id &&
                    navigate(
                      `/profile-user-employee/${updatedUserDetails?._id}`
                    );
                }}
              >
                {landingContent?.profile?.public_profile_button}

              </button>
              {/* <button className="btn btn-primary">N</button> */}
            </div>
          </div>
        </div>
      </main>

      <section className="pt-5">
        <div className="container">
          <div className="d-flex employee-profile-main-row">
            <div className="col-4 px-3">
              <div className="popup-row">
                {/* Location */}
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="popups-text-col">{landingContent?.profile?.location_label}</h4>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target="#locationModalEdit"
                    ></button>
                  </div>
                </div>
                <div className="popup-text-col">
                  <p className="opportunity-type-text mb-0 ">
                    {userAddress?.country}
                  </p>
                </div>
              </div>

              {/* Language  */}
              <div className="popup-row">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="popups-text-col">{landingContent?.profile?.language_label}</h4>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target="#languageModalEdit"
                    ></button>
                  </div>
                </div>

                <div className="popup-text-col">
                  {updatedUserDetails?.preferredLanguages?.map((loc) => (
                    <p className="opportunity-type-text mb-0 mt- 3 me-2">
                      {loc}
                    </p>
                  ))}
                </div>
              </div>

              {/* Type of opportunity  */}
              <div className="popup-row">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="popups-text-col">{landingContent?.profile?.type_of_opportunity_label}</h4>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target="#typeModalEdit"
                    ></button>
                  </div>
                </div>

                <div className="popup-text-col">
                  {updatedUserDetails?.JobTypeData?.length > 0 &&
                    updatedUserDetails?.JobTypeData?.map((job, index) => (
                      <p
                        key={index}
                        className="opportunity-type-text mb-0 me-2"
                      >
                        {job?.typeName}
                      </p>
                    ))}
                </div>
              </div>

              {/* Skills  */}
              <div className="popup-row">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="popups-text-col">{landingContent?.profile?.skills_label}</h4>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      data-bs-toggle="modal"
                      data-bs-target="#skillsModalEdit"
                    ></button>
                  </div>
                </div>

                <div className="popup-text-col">
                  {updatedUserDetails?.SkillsData?.length > 0 &&
                    updatedUserDetails?.SkillsData.map((skill) => (
                      <p className="opportunity-type-text mb-0 me-2">
                        {skill?.skillName}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* Opportunity Title */}
            <div className="col-8 px-5">
              <div className="d-flex justify-content-between pb-3">
                <div>
                  <span className="font-job-col">
                    | {updatedUserDetails?.title} |
                  </span>
                </div>
                <div></div>
              </div>

              {/* Description */}
              <div className="details-texts-items">
                <p
                  dangerouslySetInnerHTML={{
                    __html: updatedUserDetails?.description,
                  }}
                ></p>
              </div>

              {fileName && (
                <p
                  className="opportunity-type-text mb-0"
                  style={{
                    backgroundColor: "#c5dfd1",
                    color: "grey",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSave("resume")}
                >
                  Upload Resume
                </p>
              )}
              {upload && (
                <>
                  <label className="pb-2 pt-5"> Upload Your Resume</label>
                  <div className="file-upload-wrapper mb-5" {...getRootProps()}>
                    <div
                      className={`file-upload-content ${isDragActive ? "drag-active" : ""
                        }`}
                    >
                      <img
                        src={fileName ? uploadedIcon : uploadIcon}
                        alt="Upload"
                        className="upload-image pb-4"
                      />

                      <h3 className="upload-title">
                        {fileName
                          ? `File uploaded: ${fileName}`
                          : "Drag or click here to upload file"}
                      </h3>
                      <p className="upload-description">
                        You can click on and upload your pdf resume here. The
                        file should be less than 1Mb
                      </p>
                      <input {...getInputProps()} />
                    </div>
                  </div>
                </>
              )}

              {/* {updatedUserDetails?.resume !== '' && <div className="popup-text-col" type="button" onClick={handleResumeDownload}>
                                <p className='opportunity-type-text mb-0' style={{ backgroundColor: '#c5dfd1', color: 'grey', cursor: 'pointer' }}>Download Resume</p>
                            </div>} */}

              {/* Upload Document Viewer */}

              {!upload && (
                <div className="resume-preview-container">
                  {resumeLink ? (
                    <>
                      <h4>Resume:</h4>

                      {renderResumePreview()}
                    </>
                  ) : (
                    <p>No resume uploaded yet</p>
                  )}
                </div>
              )}

              <div className="d-flex  pb-3 mt-2">
                {updatedUserDetails?.resume !== "" && (
                  <div
                    className="popup-text-col"
                    type="button"
                    onClick={handleResumeDownload}
                  >
                    <p
                      className="opportunity-type-text mb-0"
                      style={{
                        backgroundColor: "#c5dfd1",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    >
                      {landingContent?.profile?.download_resume_button}
                    </p>
                  </div>
                )}

                <div
                  className="popup-text-col  mx-2"
                  type="button"
                  onClick={() => setUpload(true)}
                >
                  <p
                    className="opportunity-type-text mb-0"
                    style={{
                      backgroundColor: "#c5dfd1",
                      color: "grey",
                      cursor: "pointer",
                    }}
                  >
                    {landingContent?.profile?.upload_resume_button}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ChangePasswordModal
        show={showChangePassword}
        onHide={handleCloseChangePassword}
      />
    </div>
  );
}
