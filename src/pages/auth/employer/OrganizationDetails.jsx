import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { organizationDetailsSchema } from '../../../util/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../../../redux/action-types';
import { businessSize } from '../../../util/contant';
import logo from '../../../assets/images/logo.svg';
import { useTranslation } from 'react-i18next';

const OrganizationDetails = () => {
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [defaultSlots, setDefaultSlots] = useState(null);

    const { employerDetails } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log("🚀 ~ Login ~ landingContent:", landingContent)

    const businessSizeSlotsMap = {
        "1 - 10": 3,
        "11 - 50": 3,
        "51 - 100": 3,
        "101 - 200": 3,
        "201 - 500": 3,
        "501 - 1000": 5,
        "1000+": 5,
    };
    const NON_PROFIT_SLOTS = 3;

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(organizationDetailsSchema),
        mode: 'onChange',
    });

    const watchSize = watch('sizeOfBusiness');
    const watchNonProfit = watch('isNonProfitable');

    useEffect(() => {
        if (watchNonProfit) {
            setDefaultSlots(NON_PROFIT_SLOTS);
        } else {
            setDefaultSlots(businessSizeSlotsMap[watchSize] || null);
        }
    }, [watchSize, watchNonProfit]);

    useEffect(() => {
        if (employerDetails) {
            setValue('registrationNumber', employerDetails?.regNumber);
            setValue('vatNumber', employerDetails?.VAT);
            setValue('sizeOfBusiness', employerDetails?.businessSize);
            setValue('isNonProfitable', employerDetails?.isNonProfitable || false);
        }
    }, [employerDetails, setValue]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        startTransition(() => {
            setValue(name, value, { shouldValidate: true });
        });
    };

    const onSubmit = (data) => {
        startTransition(() => {
            const size = data.sizeOfBusiness;
            const isNonProfit = data.isNonProfitable;
            const slots = isNonProfit ? NON_PROFIT_SLOTS : (businessSizeSlotsMap[size] || 0);

            let business_details = {
                ...employerDetails,
                regNumber: data.registrationNumber,
                VAT: data.vatNumber,
                businessSize: size,
                isNonProfitable: isNonProfit,
                defaultSlots: slots,
            };

            dispatch({
                type: ActionType.EMPLOYER_DETAILS,
                payload: business_details
            });

            navigate('/details-organization-social');
        });
    };

    return (
        <div>
            <div className="logo-block text-center mb-5">
                <a className="homepage-navigation" href="/">
                    <h5 className="back-to-homepage">{landingContent?.signup?.backButton}</h5>
                    <img src={logo} alt="logo" />
                </a>
            </div>
            <div className='cardcontrols'>
                <div className="cards">
                    <div className="titlecards">{landingContent?.signup?.organization_title}</div>
                    <div className="formdesign">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="formControls">
                                <label className='customeLabel'>
                                    {landingContent?.signup?.registration_number} ({landingContent?.signup?.chamberLabel})
                                </label>
                                <input
                                    type="text"
                                    className="authfields"
                                    placeholder={`${landingContent?.signup?.registration_number} (${landingContent?.signup?.chamberLabel})`}
                                    autoComplete='off'
                                    {...register('registrationNumber')}
                                    onChange={handleChange}
                                />
                                {errors.registrationNumber && <div className="errorMsg">{errors.registrationNumber.message}</div>}
                            </div>

                            <div className="formControls">
                                <label className='customeLabel'>{landingContent?.signup?.vatLabel}</label>
                                <input
                                    type="text"
                                    className="authfields"
                                    placeholder={landingContent?.signup?.vatLabel}
                                    autoComplete='off'
                                    {...register('vatNumber')}
                                    onChange={handleChange}
                                />
                                {errors.vatNumber && <div className="errorMsg">{errors.vatNumber.message}</div>}
                            </div>

                            <div className="formControls">
                                <label className='customeLabel'>{landingContent?.signup?.sizeOfBussiness}</label>
                                <div className={`form-group ${errors.sizeOfBusiness ? 'is-invalid' : ''}`}>
                                    <select
                                        className="form-select"
                                        {...register('sizeOfBusiness')}
                                        onChange={(e) => setValue('sizeOfBusiness', e.target.value)}
                                        aria-invalid={errors.sizeOfBusiness ? 'true' : 'false'}
                                    >
                                        <option value="" disabled>Select size of business</option>
                                        {businessSize.map((s, i) => (
                                            <option key={i} value={s.name}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sizeOfBusiness && <div className="errorMsg">{errors.sizeOfBusiness.message}</div>}
                                </div>
                            </div>

                            <div className="formControls">
                                <div className="form-group">
                                    <input
                                        type="checkbox"
                                        className="form-check-input shadow-sm border-success"
                                        {...register('isNonProfitable')}
                                    />
                                    <label className="form-check-label">
                                        <span className='m-2'>
                                            {landingContent?.signup?.note_desc}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <div className="formControls mt-5">
                                    <button
                                        className='btn border-0 bg-transparent btn-back w-100'
                                        type='button'
                                        onClick={() => navigate('/details-employer')}
                                    >
                                        {landingContent?.signup?.backButtonLabel}
                                    </button>
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
        </div>
    );
};

export default OrganizationDetails;
