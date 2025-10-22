import React, { useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FbIcon from "../../../assets/images/fb.svg";
import linkedInIcon from "../../../assets/images/linked-in.svg";
import webIcon from "../../../assets/images/web-icon.svg";
import instaIcon from "../../../assets/images/insta.svg";
import { socialDetailsSchema } from '../../../util/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../../../redux/action-types';
import logo from '../../../assets/images/logo.svg';
import { useTranslation } from 'react-i18next';

const SocialDetails = () => {
    const [isPending, startTransition] = useTransition();

    //Redx State
    const { employerDetails } = useSelector((state) => state.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    //Use Form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(socialDetailsSchema),
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
            setValue('website', employerDetails?.website)
            setValue('instagram', employerDetails?.instagram)
            setValue('facebook', employerDetails?.facebook)
            setValue('linkedIn', employerDetails?.linkedIn)
        }
    }, [])


    const onSubmit = (data) => {
        console.log(data);
        let business_details = {
            ...employerDetails,
            "website": data?.website,
            "instagram": data?.instagram,
            "facebook": data?.facebook,
            "linkedIn": data?.linkedIn,
        }
        dispatch({
            type: ActionType.EMPLOYER_DETAILS,
            payload: business_details
        });
        navigate('/details-organization-email');
    };

    return (
        <div>
            <div class="logo-block text-center mb-5">
                <a class="homepage-navigation" href="/">
                    <h5 class="back-to-homepage">{landingContent?.signup?.backButton}</h5>
                    <img src={logo} alt="logo" />
                </a>
            </div>

            <div className='cardcontrols'>
                <div className="cards">
                    <div className="titlecards">
                        {landingContent?.signup?.organization_title}
                    </div>
                    <div className="formdesign">
                        <form onSubmit={handleSubmit(onSubmit)} className='text-center'>
                            <label className='customeLabel'>
                                {landingContent?.signup?.socialDecription}
                            </label>
                            <div className="d-flex gap-2 align-items-flex-start py-2 social-row">
                                <div className='social-icon-wrapper modal-social-icons'>
                                    <img src={FbIcon} alt="icon" />
                                </div>
                                <div className="formControls">
                                    <input
                                        type="text"
                                        className="authfields"
                                        placeholder='Facebook URL'
                                        {...register('facebook')}
                                        autoComplete='off'
                                        onChange={handleChange}
                                    />
                                    {errors.facebook && <div className="errorMsg">{errors.facebook.message}</div>}
                                </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start py-2 social-row">
                                <div className='social-icon-wrapper modal-social-icons'>
                                    <img src={linkedInIcon} alt="icon" />
                                </div>
                                <div className="formControls">
                                    <input
                                        type="text"
                                        className="authfields"
                                        placeholder='LinkedIn URL'
                                        {...register('linkedIn')}
                                        autoComplete='off'
                                        onChange={handleChange}
                                    />
                                    {errors.linkedIn && <div className="errorMsg">{errors.linkedIn.message}</div>}
                                </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start py-2 social-row">
                                <div className='social-icon-wrapper modal-social-icons'>
                                    <img src={instaIcon} alt="icon" />
                                </div>
                                <div className="formControls">
                                    <input
                                        type="text"
                                        className="authfields"
                                        placeholder='Instagram URL'
                                        {...register('instagram')}
                                        autoComplete='off'
                                        onChange={handleChange}
                                    />
                                    {errors.instagram && <div className="errorMsg">{errors.instagram.message}</div>}
                                </div>
                            </div>

                            <div className="d-flex gap-2 align-items-flex-start py-2 social-row">
                                <div className='social-icon-wrapper modal-social-icons'>
                                    <img src={webIcon} alt="icon" />
                                </div>
                                <div className="formControls">
                                    <input
                                        type="text"
                                        className="authfields"
                                        placeholder='Website URL'
                                        {...register('website')}
                                        autoComplete='off'
                                        onChange={handleChange}
                                    />
                                    {errors.website && <div className="errorMsg">{errors.website.message}</div>}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <div className="formControls mt-5">
                                    <button
                                        className='btn border-0 bg-transparent btn-back w-100'
                                        type='button'
                                        onClick={() => navigate('/details-organization')}
                                    >
                                        {landingContent?.signup?.backButtonLabel}
                                    </button>
                                </div>
                                <div className="formControls mt-5">
                                    <button
                                        className='btn btn-primary w-100'
                                        type='submit'
                                    >
                                        {landingContent?.signup?.next_button}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocialDetails;
