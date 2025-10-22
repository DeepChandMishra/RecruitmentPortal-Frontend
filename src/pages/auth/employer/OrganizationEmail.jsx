import React, { useState, useTransition, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { organizationEmailSchema } from '../../../util/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../../../redux/action-types';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo.svg';
import { useTranslation } from 'react-i18next';

const OrganizationEmail = () => {
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfUsers, setNumberOfUsers] = useState(0);

    const { employerDetails } = useSelector((state) => state.user);

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(organizationEmailSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (employerDetails) {
            setValue('numberOfUsers', employerDetails.numberOfUser)
            setNumberOfUsers(employerDetails.numberOfUser || 0);
            for (let i = 0; i < (employerDetails.numberOfUser || 0); i++) {
                setValue(`emailUser${i + 1}`, employerDetails.userEmails[i] || '');
            }
        }
    }, [employerDetails, setValue]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'numberOfUsers') {
            const num = Number(value);

            if (num < 0 || num == '-') {
                setNumberOfUsers(0);
                startTransition(() => {
                    setValue(name, 0, { shouldValidate: true });
                });
            } else if (num <= 5) {
                setNumberOfUsers(num);
                startTransition(() => {
                    setValue(name, value, { shouldValidate: true });
                });
            } else if (num > 5) {
                toast.error("Maximum 5 users allowed");
                setNumberOfUsers(5);
                startTransition(() => {
                    setValue(name, 5, { shouldValidate: true });
                });
            }
        }
    };

    const onSubmit = (data) => {
        startTransition(() => {
            const userEmails = [];
            for (let i = 0; i < numberOfUsers; i++) {
                userEmails.push(data[`emailUser${i + 1}`]);
            }

            let business_details = {
                ...employerDetails,
                numberOfUser: numberOfUsers,
                userEmails: userEmails,
            };

            dispatch({
                type: ActionType.EMPLOYER_DETAILS,
                payload: business_details
            });

            if (!userEmails.includes("")) {
                navigate('/details-organization-description');
            } else {
                toast.error("Please provide user email");
            }
        });
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="formControls">
                                <label className='customeLabel'>
                                    {landingContent?.signup?.numberofuserLabel}
                                </label>
                                <input
                                    type="number"
                                    className="authfields"
                                    placeholder='Number of users'
                                    autoComplete='off'
                                    min={1}
                                    max={5}
                                    {...register('numberOfUsers')}
                                    onChange={handleChange}
                                />
                                {errors.numberOfUsers && <div className="errorMsg">{errors.numberOfUsers.message}</div>}
                            </div>
                            {Array.from({ length: numberOfUsers }).map((_, index) => (
                                <div className="formControls" key={index}>
                                    <label className='customeLabel'>
                                        {landingContent?.signup?.emailaddreslabel} {index + 1}
                                    </label>
                                    <input
                                        type="email"
                                        className="authfields"
                                        placeholder={`Email address user ${index + 1}`}
                                        autoComplete='off'
                                        {...register(`emailUser${index + 1}`)}
                                        onChange={handleChange}
                                    />
                                    {errors[`emailUser${index + 1}`] && <div className="errorMsg">{errors[`emailUser${index + 1}`].message}</div>}
                                </div>
                            ))}
                            <div className="d-flex justify-content-between">
                                <div className="formControls mt-5">
                                    <button className='btn border-0 bg-transparent btn-back w-100' type='button' onClick={() => navigate('/details-organization-social')}>{landingContent?.signup?.backButtonLabel}</button>
                                </div>
                                <div className="formControls mt-5">
                                    <button className='btn btn-primary w-100' type='submit' disabled={isLoading}>
                                        {isLoading ? 'Submitting...' : `${landingContent?.signup?.next_button}`}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationEmail;
