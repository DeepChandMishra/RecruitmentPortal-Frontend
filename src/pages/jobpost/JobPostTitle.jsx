import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useTheme } from '@mui/material/styles';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { addRole, getAllDesignationList, getJobRoleList } from '../../redux/actions/jobposting';
import { ActionType } from '../../redux/action-types';
import { jobTitleSchema } from '../../util/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from "react-select";
import locationIcon from "../../assets/images/location-icon.svg";
import currentLocation from "../../assets/images/current-location.svg";
import { getCategories, skillsListing } from '../../redux/actions/common';
import ReactGoogleAutocomplete from "react-google-autocomplete";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { getJobPosted } from '../../redux/actions/employer';
import { getSavedJobs } from '../../redux/actions/employee';
import { languageList } from '../../util/contant';


const animatedComponents = makeAnimated();

const JobPostTitle = () => {
    const [isPending, startTransition] = useTransition();
    const [filterDesignation, setFilterDesignation] = useState([]);
    const [jobPostedList, setJobPostedList] = useState([])
    const [domainList, setDomainList] = useState([])
    const [createJob, setCreateJob] = useState()
    const [previousPost, setPreviousPost] = useState()
    const [pageSize, setPageSize] = useState(500);
    const [address, setAddress] = useState();
    const [show, setShow] = useState(false)
    const [long, setLong] = useState()
    const [lat, setLat] = useState()
    const [isEdit, setIsEdit] = useState()
    const [roleOptions, setRoleOptions] = useState([]);
    const [isAddressSelected, setIsAddressSelected] = useState(false);

    const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';
    const apiKey = 'AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg'

    //Redux State
    const { jobPosted } = useSelector((state) => state.employer);
    const { categoriesList } = useSelector((state) => state.common)
    console.log('categoriesList', categoriesList)
    const { skills, jobType } = useSelector((state) => state.common);
    const { jobDetails, designationList } = useSelector((state) => state.jobposting);

    const theme = useTheme();
    const params = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const userId = localStorage.getItem("userId");

    //Use From Define
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(jobTitleSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        dispatch(getJobRoleList((result) => {
          console.log('getJobRoleList result', result);
      
          const roles = result?.data || [];
          if (roles.length) {
            const mapped = roles.map((r) => ({
              label: r.role,
              value: r.role,
              id: r._id,
            }));
            setRoleOptions(mapped);
          }
        }));
      }, [dispatch]);
      

    // Get all Designations.
    useEffect(() => {
        dispatch(getAllDesignationList((result) => {
        }));
    }, [dispatch]);


    //Filter Skills 
    const skillOptions = skills?.map((skill) => ({
        value: skill._id,
        label: skill.skillName,
    }));

    useEffect(() => {
        const filterDomain = async () => {
            const domainFilterList = await categoriesList?.map((domain) => ({
                ...domain,
                value: domain._id,
                label: domain?.name,
            }));
            setDomainList(domainFilterList)
        }
        filterDomain()
    }, [categoriesList])


    console.log('jobDetailsjobDetails', jobDetails)
    //Bindig function
    useEffect(() => {
        if (jobDetails && jobDetails?.createJob == "1") {
            let skillsFilter = skillOptions?.filter((o) =>
                jobDetails?.skills?.includes(o.value)
            );
            let languageFilter = languageList?.filter((o) =>
                jobDetails?.language?.includes(o.value)
            );
            
            let domain = categoriesList?.find((o) => o._id === jobDetails?.category);
            console.log("🚀 ~ useEffect ~ domain:", domain, categoriesList)
            let _domain = {}
            if (domain) {
                _domain = { label: domain.name, ...domain };
            }


            // setCreateJob(1)
            setValue('domain', _domain)
            setValue('skills', skillsFilter);
            setValue('role', jobDetails?.designation)
            setValue('country', jobDetails?.address?.country);
            setValue('language', languageFilter)
            setValue('postalCode', jobDetails?.address?.postal_code);
            setValue('city', jobDetails?.address?.city);
            setValue('businessAddress', jobDetails?.address?.complete_address);
            setValue('businessName', jobDetails?.businessName);
            setValue('state', jobDetails?.address?.state);
            setLong(jobDetails?.address?.location?.coordinates[1])
            setLat(jobDetails?.address?.location?.coordinates[0])
            if (jobDetails?.address?.complete_address)
                searchInput.current.value = jobDetails?.address?.complete_address
        }
        else if (jobDetails && jobDetails?.createJob == "2") {
            let skillsFilter = skillOptions?.filter((o) =>
                jobDetails?.skills?.includes(o.value)
            );
            let languageFilter = languageList?.filter((o) =>
                jobDetails?.language?.includes(o.value)
            );

            let categoryId = jobDetails?.category && jobDetails?.category
            let desgination = {
                id: jobDetails?.DesignationData?._id,
                label: jobDetails?.DesignationData?.designation,
                value: jobDetails?.DesignationData?.designation,
            }
            let updatedDomain = {}
            let domain = categoriesList && categoriesList?.find((o) => o._id == categoryId);
            if (domain) {
                updatedDomain = {
                    ...domain,
                    label: domain.name
                }
            }
            // setCreateJob(2)
            // setShow(true)
            setValue('domain', updatedDomain)
            setValue('skills', skillsFilter);
            setValue('role', desgination)
            setValue('language', languageFilter)
            setValue('country', jobDetails?.address?.country);
            setValue('postalCode', jobDetails?.address?.postal_code);
            setValue('city', jobDetails?.address?.city);
            setValue('businessAddress', jobDetails?.address?.complete_address);
            setValue('businessName', jobDetails?.businessName);
            setValue('state', jobDetails?.address?.state);
            setLong(jobDetails?.address?.location?.coordinates[1])
            setLat(jobDetails?.address?.location?.coordinates[0])
            if (jobDetails?.address?.complete_address)
                searchInput.current.value = jobDetails?.address?.complete_address
        }
    }, [jobDetails])

    useEffect(() => {
        if (Object.keys(jobDetails).length === 0) {
            setValue('domain', "")
            setValue('language', "")
        } else {
            console.log('sdfsdf has properties');
        }

    }, [jobDetails])

    useEffect(() => {
        if (designationList) {
            const filterArray = designationList.map((o) => ({
                label: o.designation,
                value: o.designation,
                id: o._id,
            }));
            setFilterDesignation(filterArray);
        }
    }, [designationList]);

    // Handle Continue
    const onSubmit = (data) => {
        console.log('Form data:', data);
        if (!isAddressSelected) {
            toast.error("Please select an address from the dropdown.");
            return; 
        }
        console.log('data', data)
        const selectedRole = data.role;
        const selectedLanguages = data?.language?.map((lang) => lang.value)
        console.log("🚀 ~ onSubmit ~ selectedLanguages:", selectedLanguages)
        const selectedSkills = data?.skills?.map((skill) => skill.value);
        const domainId = data?.domain?._id

        if (selectedRole) {
            const updatedJobDetails = {
                ...jobDetails,
                designation: selectedRole,
                skills: selectedSkills,
                category: domainId ? domainId : "",
                language: selectedLanguages,
                createJob: createJob == undefined ? 1 : createJob,
                address: {
                    country: data.country,
                    postal_code: data.postalCode,
                    city: data.city,
                    complete_address: data.businessAddress,
                    state: data.state,
                    location: {
                        type: "Point",
                        coordinates: [
                            long,
                            lat
                        ]
                    }
                }
            };
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: updatedJobDetails,
            });
            navigate('/job-opportunity');
        } else {
            toast.error("Please select role");
        }
    };


    const skillListing = async () => {
        try {
            dispatch(skillsListing((result) => { }));
        } catch (error) { }
    };

    useEffect(() => {
        skillListing()
    }, [])


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
                setLong(lng)
                setLat(lat)
                setAddress(_address);
                setValue('country', _address.country, { shouldValidate: true });
                setValue('state', _address.state, { shouldValidate: true });
                setValue('city', _address.city, { shouldValidate: true });
                setValue('postalCode', _address.zip, { shouldValidate: true });
                setValue('businessAddress', _address.plain(), { shouldValidate: true });
                searchInput.current.value = _address.plain();
            })
    }


    const handlePlaceSelected = (place) => {
        console.log('Selected place:', place);
    
        if (place && place.geometry && place.geometry.location) {
            setIsAddressSelected(true); 
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            reverseGeocode({ latitude: lat, longitude: lng });
        } else {
            console.log('No geometry information available for this place.');
            setIsAddressSelected(false);
        }
    };
    

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                reverseGeocode(position.coords)
            })
        }
    };


    //Clear State
    useEffect(() => {
        if (createJob) {
            setValue("skills", '')
            searchInput.current.value = ''
            handleClearState()
            setPreviousPost()
            // if (createJob == 1) {
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: {},
            });
            // }
        }
    }, [createJob])

    const handleClearState = () => {
        setValue('skills', null);
        setValue('role', "")
        setValue('country', "");
        setValue('postalCode', "");
        setValue('city', "");
        setValue('businessAddress', "");
        setValue('businessName', "");
        setValue('state', "");
        setLong()
        setLat()
    }



    //Handle Job Creation
    const handleJobPostCreate = async (e) => {
        let selection = e.target.value;
        if (selection == 1) {
            setCreateJob(1)
            setShow(false)
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: {},
            });
        }
        else {
            setCreateJob(2)
            setShow(true)
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: {},
            });
        }
        let updatedJobDetails = {
            ...jobDetails,
            createJob: selection

        }


        console.log('jobDetailsjobDetails update', updatedJobDetails)
        dispatch({
            type: ActionType.JOB_DETAILS,
            payload: updatedJobDetails,
        });
    }

    //Get Job Post
    const getjobPost = () => {
        let param = {
            order_by: "",
            order: -1,
            page_size: pageSize,
            page: 1,
        };

        dispatch(getJobPosted(param, userId, (result) => { }));
    };


    useEffect(() => {
        getjobPost()
    }, [])


    useEffect(() => {
        const jobPostedList = jobPosted?.docs?.map((posted) => ({
            ...posted,
            value: posted._id,
            label: posted?.DesignationData?.designation,
        }));
        setJobPostedList(jobPostedList)

    }, [jobPosted])




    useEffect(() => {
        if (previousPost) {
            dispatch({
                type: ActionType.JOB_DETAILS,
                payload: { ...previousPost, createJob: createJob, },
            });
        }
    }, [previousPost])


    //Get Categories
    const getCategoriesList = () => {
        dispatch(
            getCategories((result) => {
                {
                    console.log('result', result)
                }
            })
        );
    }

    useEffect(() => {
        getCategoriesList()
    }, [])


    //Handle Edit Jobs

    useEffect(() => {
        if (params.id) {
            console.log('jobDetails', jobDetails)
            // setCreateJob(2)
            // dispatch(getSavedJobs(params.id, (result) => {
            //     if (result.status) {
            //         setPreviousPost(result.data)
            //         dispatch({
            //             type: ActionType.JOB_DETAILS,
            //             payload: { ...result?.data, createJob: "2", isEditable: true },
            //         });
            //     }
            //     console.log('params.id', result.data)
            // }))
        }
    }, [params?.id])

    const handleCreateRole = (inputValue, onChange) => {
        const newRole = { role: inputValue };
      
        dispatch(addRole(newRole, (res) => {
          if (res?.status) {
            const created = {
              label: res.data.role,
              value: res.data.role,
              id: res.data._id,
            };
      
            setRoleOptions((prev) => [...prev, created]);
      
            onChange(created);
          }
        }));
      };
      

    console.log('params.id paraprasdasd', previousPost)
    return (
        <div>
            <div className="container job-post pt-3 pt-xl-5">
                <div className='parent-progress pt-4 pt-xl-2'>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.designation ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.jobType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.commitmentType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.hiringTimeline ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.payType ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="100%" aria-valuemax="100">
                        <div className="progress-bar" role="progressbar" style={{ "width": jobDetails?.description ? '100%' : '0' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="job-wrapper">
                        <div className="row job-inner-row justify-content-between">
                            <div className="col-lg-8">
                                <div className="text-col">
                                    <h6 className='heading-stepper new-heading-stepper'><span>1/6</span>Post an Opportunity</h6>
                                    <h2 className='job-head-col'>Let's get started with the main details</h2>
                                    {/* <p className='job-para'>Select one from the drop-down menu. If the role is not available, type in the role and press "Enter".</p> */}

                                    <div className='d-flex flex-column'>
                                        {!jobDetails.isEditable && <FormControl FormControl >
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={createJob}
                                                defaultValue={jobDetails?.createJob || 1}
                                                onChange={(e) => handleJobPostCreate(e)}
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Create a new opportunity" />
                                                <FormControlLabel value="2" control={<Radio />} label="Reuse an existing opportunity" />
                                            </RadioGroup>
                                        </FormControl>}

                                        {jobDetails.isEditable && <FormControl FormControl >
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={1}
                                                defaultValue={jobDetails?.createJob || 1}
                                                onChange={(e) => handleJobPostCreate(e)}
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Edit an opportunity" />
                                            </RadioGroup>
                                        </FormControl>}


                                        {show && <div className="formControls">
                                            <Select
                                                options={jobPostedList}
                                                classNamePrefix="select multi-select-input"
                                                value={previousPost}
                                                onChange={(e) => setPreviousPost(e)}
                                            />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-lg-4 col-md-12">
                                <div className="input-col ">
                                    <h4 className='label-chip-col'>Role</h4>
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) => (
                                            <CreatableSelect
                                                {...field}
                                                isMulti={false}
                                                components={animatedComponents}
                                                options={filterDesignation}
                                                className="multi-select-input"
                                                styles={{
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                    }),
                                                }}
                                                placeholder="Select or type to create other"
                                            />
                                        )}
                                    />
                                    {errors.role && <div className="errorMsg">{errors.role.message}</div>} */}

                            <div className="col-lg-4 col-md-12">
                                <div className="input-col ">
                                    <h4 className='label-chip-col'>Role</h4>
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) =>
                                            roleOptions?.length === 0 ? (
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti={false}
                                                    components={animatedComponents}
                                                    options={roleOptions}
                                                    className="multi-select-input"
                                                    placeholder="Type to create a role"
                                                    styles={{
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                        }),
                                                    }}
                                                    onCreateOption={(inputValue) => handleCreateRole(inputValue, field.onChange)}

                                                />
                                            ) : (
                                                // Only show existing roles if roles are available
                                                <Select
                                                    {...field}
                                                    isMulti={false}
                                                    options={roleOptions}
                                                    className="multi-select-input"
                                                    placeholder="Select Role"
                                                    classNamePrefix="select"
                                                />
                                            )
                                        }
                                    />
                                    {errors.role && <div className="errorMsg">{errors.role.message}</div>}


                                    <div className="formControls mt-3">

                                        <label className="label-chip-col">Language</label>
                                        <div>
                                            <Controller
                                                name="language"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        required={true}
                                                        options={languageList}
                                                        isMulti={true}
                                                        className={` ${errors.language ? "is-invalid" : ""
                                                            }`}
                                                        classNamePrefix="select multi-select-input"
                                                    />
                                                )}
                                            />
                                            {errors.language && (
                                                <span className="text-danger">{errors.language.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="formControls mt-3">
                                        <label className="label-chip-col">Skills</label>
                                        <div>
                                            <Controller
                                                name="skills"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        required={true}
                                                        options={skillOptions}
                                                        isMulti
                                                        className={`skills-select ${errors.skills ? "is-invalid" : ""
                                                            }`}
                                                        classNamePrefix="select multi-select-input"
                                                    />
                                                )}
                                            />
                                            {errors.skills && (
                                                <span className="text-danger">{errors.skills.message}</span>
                                            )}
                                        </div>

                                    </div>


                                    <div className="formControls mt-3">

                                        <label className="label-chip-col">Domain</label>
                                        <div>
                                            <Controller
                                                name="domain"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        required={true}
                                                        options={domainList}
                                                        isMulti={false}
                                                        className={` ${errors.domain ? "is-invalid" : ""
                                                            }`}
                                                        classNamePrefix="select multi-select-input"
                                                    />
                                                )}
                                            />
                                            {errors.domain && (
                                                <span className="text-danger">{errors.domain.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="formControls">
                                        <label className='label-chip-col'>Location</label>

                                        <div className="position-relative">

                                            <img src={locationIcon} alt="location" className='location-icon' />

                                            <ReactGoogleAutocomplete
                                                className="authfields location-input-col"
                                                ref={searchInput}
                                                required={true}
                                                apiKey={process.env.REACT_APP_GOOGLE_API}
                                                types={["(regions)"]}
                                                onPlaceSelected={handlePlaceSelected}
                                                onChange={() => setIsAddressSelected(false)} 

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
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="text-end end-btn-row py-5">
                        <button className="btn btn-primary" type='submit'>
                            Continue
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default JobPostTitle;
