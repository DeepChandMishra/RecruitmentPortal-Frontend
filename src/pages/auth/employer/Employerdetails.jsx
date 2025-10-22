import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { employerDetailsSchema } from '../../../util/validationSchema'; // Assume you have a validation schema for this form
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../../../redux/action-types';
import ReactGoogleAutocomplete from "react-google-autocomplete";
import locationIcon from "../../../assets/images/location-icon.svg";
import currentLocation from "../../../assets/images/current-location.svg";
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from 'react-i18next';

const EmployerDetails = () => {
    const [cities, setCities] = useState([]);
    const [address, setAddress] = useState();
    const [lat, setLat] = useState()
    const [long, setLong] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");

    const [isPending, startTransition] = useTransition();
    const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
    const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';
    const apiKey = 'AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg'


    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    const { employerDetails } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchInput = useRef(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(employerDetailsSchema),
        mode: 'onChange',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        startTransition(() => {
            setValue(name, value, { shouldValidate: true });
        });
    };

    useEffect(() => {
        if (employerDetails) {
            setValue('country', employerDetails?.address?.country);
            setValue('postalCode', employerDetails?.address?.postal_code);
            setValue('city', employerDetails?.address?.city);
            setValue('businessAddress', employerDetails?.address?.complete_address);
            setValue('businessName', employerDetails?.businessName);
            setValue('state', employerDetails?.address?.state);
            setLong(employerDetails?.address?.location?.coordinates[1])
            setLat(employerDetails?.address?.location?.coordinates[0])

            if (employerDetails?.complete_address)
                searchInput.current.value = employerDetails?.complete_address
        }
    }, [employerDetails, setValue]);

    const onSubmit = (data) => {
        startTransition(() => {
            // Handle the form submission
            let business_details = {
                ...employerDetails,
                businessName: data.businessName,
                address: {
                    country: data.country,
                    postal_code: data.postalCode,
                    city: data.city,
                    complete_address: data.businessAddress,
                    businessName: data.businessName,
                    state: data.state,
                    location: {
                        type: "Point",
                        coordinates: [
                            lat,
                            long
                        ]
                    }
                }
            };

            dispatch({
                type: ActionType.EMPLOYER_DETAILS,
                payload: business_details
            });
            navigate('/details-organization');
        });
    };

    const fetchCities = async (country) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=&types=(cities)&components=country:${country}&key=AIzaSyBZpYTyncNyWTxM9WDOBwmTLcIjqkG0OOg`);
            const data = await response.json();
            if (data.predictions) {
                setCities(data.predictions);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const extractAddress = (place) => {
        console.log("🚀 ~ extractAddress ~ place:", place)
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
                console.log("🚀 ~ reverseGeocode ~ _address:", _address)
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
            console.log("🚀 ~ handlePlaceSelected ~ geometry:", geometry)
            const lat = geometry.location.lat();
            const lng = geometry.location.lng();
            reverseGeocode({ latitude: lat, longitude: lng });
        } else {
            console.log('No geometry information available for this place.');
        }
    };


    return (
        <div className='cardcontrols'>
            <div className="logo-block text-center mb-5">
                <Link to='/' className='homepage-navigation'>
                    <h5 className='back-to-homepage'>{landingContent?.signup?.backButton}</h5>
                    <img src={Logo} alt="logo" />
                </Link>
            </div>
            <div className="cards">
                <div className="titlecards">
                    {landingContent?.signup?.organization_title}
                </div>
                <div className="formdesign">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.business_name_label}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.business_name_label}
                                autoComplete='off'
                                {...register('businessName')}
                                onChange={handleChange}
                            />
                            {errors.businessName && <div className="errorMsg">{errors.businessName.message}</div>}
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

                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.business_address}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.business_address}
                                autoComplete='off'
                                {...register('businessAddress')}
                                onChange={handleChange}
                            />
                            {errors.businessAddress && <div className="errorMsg">{errors.businessAddress.message}</div>}
                        </div>
                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.state_label}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.state_label}
                                autoComplete='off'
                                {...register('state')}
                                onChange={handleChange}
                                list="city-options"
                            />
                            <datalist id="city-options">
                                {cities.map((city) => (
                                    <option key={city.place_id} value={city.description} />
                                ))}
                            </datalist>
                            {errors.state && <div className="errorMsg">{errors.state.message}</div>}
                        </div>
                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.city_label}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.city_label}
                                autoComplete='off'
                                {...register('city')}
                                onChange={handleChange}
                                // onFocus={() => fetchCities(selectedCountry)}
                                list="city-options"
                            />
                            {/* <datalist id="city-options">
                                {cities.map((city) => (
                                    <option key={city.place_id} value={city.description} />
                                ))}
                            </datalist> */}
                            {errors.city && <div className="errorMsg">{errors.city.message}</div>}
                        </div>
                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.postal_code}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.postal_code}
                                autoComplete='off'
                                {...register('postalCode')}
                                onChange={handleChange}
                            />
                            {errors.postalCode && <div className="errorMsg">{errors.postalCode.message}</div>}
                        </div>
                        <div className="formControls">
                            <label className='customeLabel'>{landingContent?.signup?.country}</label>
                            <input
                                type="text"
                                className="authfields"
                                placeholder={landingContent?.signup?.country}
                                autoComplete='off'
                                {...register('country')}
                                onChange={handleChange}
                            />
                            {errors.country && <div className="errorMsg">{errors.country.message}</div>}
                        </div>

                        <div className="d-flex justify-content-between">
                            <div className="formControls mt-5">
                                <button className='btn border-0 bg-transparent btn-back w-100' type='button' onClick={() => navigate('/login')}>{landingContent?.signup?.backButtonLabel}</button>
                            </div>
                            <div className="formControls mt-5">
                                <button className='btn btn-primary w-100' type='submit' disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : `${landingContent?.signup?.nextButtonLabel}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmployerDetails;
