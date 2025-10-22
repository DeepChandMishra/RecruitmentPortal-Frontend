import React, { useState, useTransition } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '../../../util/validationSchema';
import { useDispatch } from 'react-redux';
import { forgotPassoword, resetPassoword } from '../../../redux/actions/user';
import eyeClose from "../../../assets/images/eye-close.svg";
import EyeIcon from "../../../assets/images/password-icon.svg";
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    const dispatch = useDispatch();
    const navigate = useNavigate()
    const param = useParams()

    //Use Form Define
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        mode: 'onChange',
    });

    const resetUserPassword = async (data) => {
        try {
            setIsLoading(true);

            const resetDetails = {
                password: data.password,
                confirmPassword: data.confirmPassword,
                token: param?.id
            };

            dispatch(resetPassoword(resetDetails, (result) => {
                if (result.status) {
                    toast.success('Password changed successfully')
                    navigate('/login')
                }
                setIsLoading(false);
            }));
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        startTransition(() => {
            setValue(name, value, { shouldValidate: true });
        });
    };

    const onSubmit = (data) => {
        startTransition(() => {
            resetUserPassword(data);
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='cardcontrols'>
            <div className="cards">
                <div className="titlecards">Reset password</div>
                <div className="formdesign">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="formControls position-relative">
                            <span className=' position-relative' >
                                <label className='customeLabel'>Enter your Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="authfields"
                                    placeholder='Password'
                                    {...register('password')}
                                    onChange={handleChange}
                                    autoComplete='off'
                                />
                                <button type='button' onClick={togglePasswordVisibility} className='icon-password border-0 bg-transparent'>
                                    <img
                                        src={showPassword ? EyeIcon : eyeClose}
                                        alt="Toggle Password Visibility"
                                        className='eye-close-password position-absolute end-50'

                                    />
                                </button>
                            </span>
                            {errors.password && <div className="errorMsg">{errors.password.message}</div>}
                        </div>

                        <div className="formControls position-relative">
                            <span className='position-relative'>
                                <label className='customeLabel'>Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="authfields"
                                    placeholder='Confirm Password'
                                    {...register('confirmPassword')}
                                    onChange={handleChange}
                                    autoComplete='off'
                                />
                                <button type='button' onClick={toggleConfirmPasswordVisibility} className='icon-password border-0 bg-transparent'>
                                    <img
                                        src={showConfirmPassword ? EyeIcon : eyeClose}
                                        alt="Toggle Confirm Password Visibility"
                                        className='eye-close-password position-absolute end-50'
                                    />
                                </button>
                            </span>
                            {errors.confirmPassword && <div className="errorMsg">{errors.confirmPassword.message}</div>}
                        </div>


                        <div className="formControls mt-5">
                            <button className='btn btn-primary w-100' type='submit' disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="formControls text-center">
                            <p>Back to Sign In? <Link to="/signin" className='links'>Go Back</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
