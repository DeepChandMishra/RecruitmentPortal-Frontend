import React, { useEffect, useRef, useState } from 'react';
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from 'react-router-dom';
import addIcon from "../../assets/images/Plus.svg";
import { useDispatch, useSelector } from 'react-redux';
import uploadIcon from "../../assets/images/upload.svg";
import AvatarIcon from '../../assets/images/Avatar.png';
import EditIcon from "../../assets/images/edit-icon.svg";
import uploadedIcon from "../../assets/images/uploaded.svg";
import { updateEmployer } from '../../redux/actions/employer';
import { updateEmployee } from '../../redux/actions/employee';
import ReactGoogleAutocomplete from "react-google-autocomplete";
import locationIcon from "../../assets/images/location-icon.svg";
import currentLocation from "../../assets/images/current-location.svg";
import { getPublicProfileDetails, getUsersDetails, getUsersPublicProfile, jobTypesListing, skillsListing } from '../../redux/actions/common';
import { commitmentType, commitmentTypeprofile, languageList } from '../../util/contant';
import Loading from '../../components/loader';
import { useTranslation } from "react-i18next";
import backArrow from '../../assets/images/arrow-back.svg';
import { blankProfile } from '../../util/UtilFunction';
import { toast } from 'react-toastify';


const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

// const popover = new bootstrap.Popover('.popover-dismiss', {
//     trigger: 'focus'
//   })

export default function ProfilePublicMode() {
    const [lat, setLat] = useState()
    const [city, setCity] = useState()
    const [lang, setLang] = useState()
    const [file, setFile] = useState()
    const [state, setState] = useState()
    const [address, setAddress] = useState()
    const [loader, setLoader] = useState(false)
    const [country, setCountry] = useState()
    const [pincode, setPincode] = useState()
    const [lastName, setLastName] = useState()
    const [language, setLanguage] = useState()
    const [firstName, setFirstName] = useState()
    const [fileName, setFileName] = useState("")
    const [uploadType, setUploadType] = useState()
    const [skillsData, setSkillsData] = useState([])
    const [description, setDescription] = useState()
    const [jobTypeData, setJobTypeData] = useState([])
    const [skillOptions, setSkillOptions] = useState([])
    const [jobTypeOptions, setJobTypeOptions] = useState([])
    const [opportunityTitle, setOpportunityTitle] = useState()
    const [uploadedImage, setUploadedImage] = useState(null);
    const [updatedUserDetails, setUpdatedUserDetails] = useState()
    const [viewMode, setViewMode] = useState(false)


    //Redux State
    const { userDetails } = useSelector((state) => state.user)
    const { publicProfile } = useSelector((state) => state.common)
    // console.log("alluserDetail",userDetails)
    const { skills, jobType } = useSelector((state) => state.common);
    const user_id = localStorage.getItem('userId')



    // const resumeLink = userDetails?.resume;

    //Geo location keys
    const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
    const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';
    const apiKey = 'AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg'

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')

    //User Address Details
    let userAddress = updatedUserDetails?.address && (updatedUserDetails?.address);

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const searchInput = useRef(null);


    console.log('params', landingContent)

    // useEffect(() => {
    //     if (params)
    //         setUpdatedUserDetails(publicProfile)
    // }, [publicProfile])


    // console.log('updatedUserDetails', updatedUserDetails)

    useEffect(() => {
        const skillOptions = skills?.map((skill) => ({
            value: skill._id,
            label: skill.skillName,
        }));

        const jobTypeOptions = jobType?.map((job) => ({
            value: job._id,
            label: job.typeName,
        }));
        setSkillOptions(skillOptions)
        setJobTypeOptions(jobTypeOptions)
    }, [skills, jobType])

    //Get User Details 
    const getUserDetails = (user_id) => {
        setLoader(true)
        console.log("hiii")
        dispatch(getPublicProfileDetails(user_id, (result) => {
            console.log("🚀 ~ dispatch ~ result:", result.data.resume)
            console.log("result", result)
            if (result.status) {

                setUpdatedUserDetails(result.data)
                setLoader(false)
            }
        }));
    }

    useEffect(() => {
        if (params?.id) {
            console.log('called 12')
            getUserDetails(params?.id)
            setViewMode(true)
        }
    }, [params])

    //Update Empoyer Profile Data
    const updateEmployerFunction = (params) => {
        dispatch(updateEmployer(params, (result) => {
            console.log('result', result)
        }));
    }

    //Update Employee Profile Data
    const updateEmployeeFunction = (_id, params) => {
        dispatch(updateEmployee(_id, params, (result) => {
            console.log('result', result)
            if (result.status) {
                getUserDetails(_id)
            }
        }));
    }


    //On Submitted Updated Details .
    const handleUpdateSave = (updatedDetails) => {
        try {
            setLoader(true)
            let user_id = updatedUserDetails._id;
            let user_role = updatedUserDetails.role;
            let param = updatedDetails

            if (user_role == 'employer') {
                // updateEmployerFunction()
            }
            else if (user_role == 'employee') {
                updateEmployeeFunction(user_id, param)
            }
        }
        catch (error) {
            console.log('Error:', error)
        }
        finally {
            setLoader(false)
        }

    }

    //Drop Zone Function
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setFileName(acceptedFiles[0].name);
            setUploadedImage(acceptedFiles[0])
            // acceptedFiles[0] ? URL.createObjectURL(file) : null
        }
    };

    //Drop Zone Function for PDF && other File
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*, application/pdf",
        maxSize: 1048576, // 1MB
    });

    console.log('updatedUserDetails', updatedUserDetails)
    //handle Resume Download
    const handleResumeDownload = () => {
        const link = document.createElement('a');
        link.href = updatedUserDetails?.resume;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    //Skill Listing
    const skillListing = async () => {
        try {
            dispatch(skillsListing((result) => { }));
        } catch (error) { }
    };


    //Job Type
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


    useEffect(() => {
        handleBindingUserDetails()
    }, [skills, skillOptions]);

    const renderResumePreview = () => {
        console.log("updatedUserDetails123", updatedUserDetails)
        if (!updatedUserDetails.resume) {
            return <p>No resume available</p>;
        }

        const fileExtension = updatedUserDetails.resume.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
            // If the file is an image
            return (
                <img
                    src={updatedUserDetails?.resume}
                    alt="Resume Preview"
                    className="resume-preview-image"
                    style={{ width: "100%", height: "500px", objectFit: 'contain' }}
                />
            );
        } else if (fileExtension === "pdf") {
            // If the file is a PDF
            return (
                <iframe
                    src={updatedUserDetails?.resume}
                    title="PDF Preview"
                    style={{ width: "100%", height: "500px", }}
                    frameBorder="0"
                />
            );
        } else if (["doc", "docx"].includes(fileExtension)) {
            return (
                <iframe
                    src={`https://docs.google.com/gview?url=${updatedUserDetails?.resume}&embedded=true`}
                    style={{ width: "100%", height: "600px" }}
                    title="Resume DOC/DOCX"
                />
            );
        } else {
            return <p>Unsupported file format</p>;
        }
    };














    //Handle User Details Binding
    const handleBindingUserDetails = () => {
        if (publicProfile) {
            let languageFilter = languageList?.filter((o) =>
                publicProfile?.preferredLanguages?.includes(o.value)
            )
            let skillsFilter = skillOptions?.filter((o) =>
                publicProfile?.skills?.includes(o.value)
            );

            let jobTypeFilter = jobTypeOptions?.filter((o) =>
                publicProfile?.opportunityType?.includes(o.value)
            );
            setFirstName(publicProfile?.firstname)
            setLastName(publicProfile?.lastname)
            setCity(publicProfile?.address?.city)
            setState(publicProfile?.address?.state)
            setCountry(publicProfile?.address?.country)
            setPincode(publicProfile?.address?.postal_code)
            setLang(publicProfile?.address?.location?.coordinates[1])
            setLat(publicProfile?.address?.location?.coordinates[0])
            setDescription(publicProfile?.description)
            setLanguage(languageFilter)
            setSkillsData(skillsFilter)
            setOpportunityTitle(publicProfile?.title)
            setJobTypeData(jobTypeFilter)
            if (publicProfile?.address?.city)
                searchInput.current.value = publicProfile?.address?.country
        }
    }


    //Handle Save
    const handleSave = (type) => {
        try {
            let updatedDetails = { ...updatedUserDetails };

            switch (type) {
                case 'language':
                    updatedDetails.preferredLanguages = language?.map(lang => lang.value);
                    break;

                case 'skills':
                    const skillIds = skillsData.map(skill => skill.value);
                    updatedDetails.SkillsData = skillOptions
                        ?.filter(option => skillIds.includes(option.value))
                        .map(option => ({
                            ...option,
                            _id: option.value,
                            skillName: skillsData.find(skill => skill.value === option.value)?.label,
                        }));
                    updatedDetails.skills = skillIds;
                    break;

                case 'location':
                    updatedDetails.address = {
                        city,
                        state,
                        country,
                        postal_code: pincode,
                        location: {
                            type: "Point",
                            coordinates: [lat, lang],
                        },
                    };
                    break;

                case 'jobtype':
                    const jobIds = jobTypeData.map(job => job.value);
                    updatedDetails.JobTypeData = jobTypeOptions
                        ?.filter(option => jobIds.includes(option.value))
                        .map(option => ({
                            ...option,
                            _id: option.value,
                            typeName: jobTypeData.find(job => job.value === option.value)?.label,
                        }));
                    updatedDetails.opportunityType = jobIds;
                    break;

                case 'title':
                    updatedDetails.title = opportunityTitle;
                    break;

                case 'resume':
                    updatedDetails.file = file;
                    updatedDetails.fileType = 'resume';
                    break;

                case 'description':
                    updatedDetails.description = description;
                    break;

                case 'name':
                    updatedDetails.firstname = firstName;
                    updatedDetails.lastname = lastName;
                    break;

                case 'image':
                    updatedDetails.file = uploadedImage;
                    updatedDetails.fileType = 'profile';
                    break;

                default:
                    console.warn(`Unknown save type: ${type}`);
                    return;
            }

            setUpdatedUserDetails(updatedDetails);
            handleUpdateSave(updatedDetails);
        } catch (error) {
            console.error('Error saving details:', error);
        } finally {
            setFile(null);
            setFileName('');
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

    console.log({ publicProfile })

    // Back Button redirection

    const backRedirect = () => {
        window.history.back();
    };

    const handleMessage = () => {
        navigate(`/messages/${params.id}`);
    };

    return (
        <div>
            {loader ? <Loading /> :
                <> <main className='job-main-col pt-5'>
                    <div className="container">
                        <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-0 ">
                            <div className='col-lg-8 col-12'>
                                <div className="back-button">
                                    <button className="btn btn-primary" onClick={backRedirect}>
                                        <img src={backArrow} alt="back" /> Back
                                    </button>
                                </div>
                                {/* Profile Image */}
                                <div className="d-flex employee-profile-row">
                                    <div>
                                        <img src={publicProfile?.image ? publicProfile?.image : blankProfile()} alt="profile" className='img-col' />
                                    </div>
                                    <div>
                                        <div className="modal fade" id="imageEdit" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Image</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
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
                                                            ) : (uploadedImage || publicProfile?.image) ? (
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
                                                                        src={(uploadedImage ? URL?.createObjectURL(uploadedImage) : publicProfile?.image)}
                                                                        alt="profile"
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                        acc
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <p>Drag & drop an image or PDF here, or click to select one (Max size: 1MB)</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setUploadType(); handleBindingUserDetails() }}>Close</button>
                                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => { handleSave('image'); setUploadType() }}>Save changes</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* User Name */}
                                    <div className='w-100'>
                                        <h2 className='mb-0'>{`${updatedUserDetails?.firstname} ${updatedUserDetails?.lastname}`}</h2>
                                        <div>

                                            <div class="modal fade" id="userName" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Language</h1>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div>
                                                                <div className="formControls">
                                                                    <label className='customeLabel'>First Name</label>
                                                                    <div className="position-relative">
                                                                        <input
                                                                            type={'text'}
                                                                            value={firstName}
                                                                            className="authfields"
                                                                            placeholder='Opportunity Title'
                                                                            onChange={(e) => setFirstName(e.target.value)}
                                                                            autoComplete='off'
                                                                        />
                                                                    </div>

                                                                    <div className="formControls mt-3">
                                                                        <label className='customeLabel'>Second Name</label>
                                                                        <div className="position-relative">
                                                                            <input
                                                                                type={'text'}
                                                                                value={lastName}
                                                                                className="authfields"
                                                                                placeholder='Opportunity Title'
                                                                                onChange={(e) => setLastName(e.target.value)}
                                                                                autoComplete='off'
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('name')}>Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="d-flex gap-2 row-progress align-items-center w-100">
                                        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar" role="progressbar" style={{ "width": "0%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <span>100%</span>
                                        {true && <button className='btn profile-btn btn-primary'>Complete Your Profile</button>}
                                    </div> */}
                                        <p className='location-col mt-2'>{`${userAddress?.city}, ${userAddress?.country}`}</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="profile-user-actionBtn text-end">
                                    {/* <button className="btn btn-primary" >
                                           Save
                                        </button> */}
                                    <button className="btn btn-outline" onClick={handleMessage}>
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                    <section className='pt-2'>
                        <div className="container">
                            <div className="d-flex employee-profile-main-row">
                                <div className='col-4 px-3'>
                                    <div className="popup-row">
                                        {/* Location */}
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4 className='popups-text-col'>{landingContent?.profile?.location}</h4>
                                            </div>
                                            <div>

                                                <div class="modal fade" id="locationModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Location</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <div className="position-relative">

                                                                    <img src={locationIcon} alt="location" className='location-icon' />

                                                                    <ReactGoogleAutocomplete
                                                                        className="authfields location-input-col"
                                                                        ref={searchInput}
                                                                        apiKey={process.env.REACT_APP_GOOGLE_API}
                                                                        types={["(regions)"]}
                                                                        onPlaceSelected={handlePlaceSelected}
                                                                    />     <div className="formControls mt-3">
                                                                        <span className='current-location'
                                                                            onClick={fetchCurrentLocation}
                                                                            type='button'
                                                                        >
                                                                            <img src={currentLocation} alt="current-location" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('location')}>Save changes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="popup-text-col">
                                            <p className='opportunity-type-text mb-0 '>{userAddress
                                                ?.country}</p>
                                        </div>
                                    </div>

                                    {/* Language  */}
                                    <div className="popup-row">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4 className='popups-text-col'>{landingContent?.profile?.language}</h4>
                                            </div>
                                            <div>
                                                <div class="modal fade" id="languageModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Language</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <Select
                                                                    value={language}
                                                                    options={languageList}
                                                                    isMulti
                                                                    onChange={(e) => setLanguage(e)}
                                                                    className={`basic-multi-select`}
                                                                    classNamePrefix="select"
                                                                />
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('language')}>Save changes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="popup-text-col">
                                            {updatedUserDetails?.preferredLanguages?.map((loc) => (
                                                <p className='opportunity-type-text mb-0 mt -3 me-2'>{loc}</p>
                                            ))}
                                        </div>


                                    </div>

                                    {/* Type of opportunity  */}
                                    <div className="popup-row">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4 className='popups-text-col'>{landingContent?.profile?.type_of_opportunity}</h4>
                                            </div>
                                            <div>

                                                <div class="modal fade" id="typeModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Opportunity</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <Select
                                                                    options={jobTypeOptions}
                                                                    isMulti
                                                                    value={jobTypeData}
                                                                    onChange={(e) => setJobTypeData(e)}
                                                                    classNamePrefix="select"
                                                                />
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('jobtype')}>Save changes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="popup-text-col">
                                            {
                                                updatedUserDetails?.JobTypeData?.length > 0 && updatedUserDetails?.JobTypeData?.map((job, index) => (
                                                    <p key={index} className='opportunity-type-text mb-0 me-2'>{job?.typeName}</p>
                                                ))
                                            }
                                        </div>


                                    </div>

                                    {/* Skills  */}
                                    <div className="popup-row">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h4 className='popups-text-col'>{landingContent?.profile?.skills}</h4>
                                            </div>
                                            <div>
                                                <div class="modal fade" id="skillsModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Skills</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <Select
                                                                    options={skillOptions}
                                                                    isMulti
                                                                    value={skillsData}
                                                                    onChange={(e) => setSkillsData(e)}
                                                                    classNamePrefix="select"
                                                                />
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('skills')}>Save changes</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-12 buttons-center-tab text-lg-end">
                                                            <button
                                                                className="btn bottom-margin btn-outline"
                                                                type="button"
                                                            // onClick={() => {
                                                            //   updatedUserDetails._id &&
                                                            //     navigate(`/profile-user-emp/${updatedUserDetails?._id}`);
                                                            // }}
                                                            >
                                                                Public view
                                                            </button>
                                                            {/* <button className="btn btn-primary">N</button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="popup-text-col">
                                            {updatedUserDetails?.SkillsData?.length > 0 && updatedUserDetails?.SkillsData.map((skill) => (
                                                <p className='opportunity-type-text mb-0 me-2'>{skill?.skillName}</p>
                                            ))}
                                        </div>

                                    </div>


                                </div>
                                {/* Opportunity Title */}
                                <div className='col-8 px-5'>
                                    <div className="d-flex justify-content-between pb-3">
                                        <div>
                                            <span className='font-job-col'>| {updatedUserDetails?.title} |</span>
                                        </div>

                                        <div class="modal fade" id="commitmentModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update opportunity title</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div className="formControls">
                                                            {/* <label className='customeLabel'>Enter your Password</label> */}
                                                            <div className="position-relative">
                                                                <input
                                                                    type={'text'}
                                                                    value={opportunityTitle}
                                                                    className="authfields"
                                                                    placeholder='Opportunity Title'
                                                                    onChange={(e) => setOpportunityTitle(e.target.value)}
                                                                    autoComplete='off'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('title')}>Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className='details-texts-items'>
                                        <p dangerouslySetInnerHTML={{ __html: updatedUserDetails?.description }}></p>
                                        {/* <p>{updatedUserDetails?.description}</p> */}
                                        {/* when putting div out of the box description i visible some design issue  */}
                                        <div>
                                            {false && <button type="button" class="border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#descriptionModal">
                                                <img src={EditIcon} alt="edit" />
                                            </button>}
                                            <div class="modal fade" id="descriptionModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Language</h1>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <textarea
                                                                id="textdetails"
                                                                className="text-details"
                                                                name="textdetails"
                                                                rows="14"
                                                                cols="49"
                                                                placeholder="Description"
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                            />
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleBindingUserDetails()}>Close</button>
                                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleSave('description')}>Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {fileName && <p className='opportunity-type-text mb-0' style={{ backgroundColor: '#c5dfd1', color: 'grey', cursor: 'pointer' }} onClick={() => handleSave('resume')}>Upload Resume</p>}
                                    <div className="resume-preview-container">

                                        <div>

                                            {updatedUserDetails?.resume ? (<> <h4>Resume:</h4>
                                                {renderResumePreview()}</>) : (<>No Resume Found</>)}

                                        </div>
                                    </div>
                                    <label className="pb-2 pt-5">{landingContent?.profile?.download}</label>
                                    {(updatedUserDetails && updatedUserDetails.resume) ? <div className="popup-text-col" type="button" onClick={handleResumeDownload}>
                                        <p className='opportunity-type-text mb-0' style={{ backgroundColor: '#c5dfd1', color: 'grey', cursor: 'pointer' }}>Download Resume</p>
                                    </div> : <div>No Resume Avaiable</div>}

                                </div >
                            </div >
                        </div >
                    </section ></>}

        </div >
    )
}
// updatedUserDetails123