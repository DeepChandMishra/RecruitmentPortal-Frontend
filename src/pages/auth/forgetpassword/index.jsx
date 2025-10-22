import React, { useState, useTransition } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../../../util/validationSchema';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { forgotPassoword } from '../../../redux/actions/user';

const Forgetpassword = () => {
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onChange',
    });




    const forgotUserPassword = async (data) => {
        try {
            setIsLoading(true);
            const userDataDetails = {
                email: data?.email,
            };
            dispatch(forgotPassoword(userDataDetails, (result) => {
                if (result.status) {
                    navigate('/success')
                }
                setIsLoading(false);
            }));
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };



    // Wrap input value updates with startTransition
    const handleChange = (event) => {
        const { name, value } = event.target;
        startTransition(() => {
            setValue(name, value, { shouldValidate: true });
        });
    };

    // Wrap reset password function with startTransition
    const onSubmit = (data) => {
        startTransition(() => {
            forgotUserPassword(data);
        });
    };

    return (
        <div className='cardcontrols'>
            <div className="cards">
                <div className="titlecards">Forget password</div>
                <div className="formdesign">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="formControls">
                            <label className='customeLabel'>Enter your email address</label>
                            <input
                                type="text"
                                className="authfields"
                                {...register('email')}
                                onChange={handleChange}
                                placeholder='Enter your email address'
                                autoComplete='off'
                            />
                            {errors.email && <div className="errorMsg">{errors.email.message}</div>}
                        </div>

                        <div className="formControls mt-5">
                            <button className='btn btn-primary w-100' type='submit' disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Link To My Email'}
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

export default Forgetpassword;
