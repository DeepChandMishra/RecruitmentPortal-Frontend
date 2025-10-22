import React, { useState, useTransition } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '../../../util/validationSchema';
import { useDispatch } from 'react-redux';
import { resetPassoword } from '../../../redux/actions/user';
import { toast } from 'react-toastify';
import eyeClose from '../../../assets/images/eye-close.svg';
import eyeOpen from '../../../assets/images/password-icon.svg';

const AdminResetPassword = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    startTransition(() => {
      setValue(name, value, { shouldValidate: true });
    });
  };

  const onSubmit = (data) => {
    startTransition(() => {
      setIsLoading(true);
      dispatch(resetPassoword({
        password: data.password,
        confirmPassword: data.confirmPassword,
        token: param?.id,
      }, (result) => {
        if (result.status) {
          toast.success('Password reset successful');
          navigate('/');
        }
        setIsLoading(false);
      }));
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgb(42, 48, 61)' }}
    >
      <div
        className="p-4 shadow-lg text-white"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#212631',
          borderRadius: '10px',
        }}
      >
        <div>
          <h2 className="text-center mb-5 fw-bold">Reset Password</h2>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Password Field */}
            <div className="position-relative mb-3">
              <label className="form-label">Enter your Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Enter new password"
                  {...register('password')}
                  onChange={handleChange}
                  style={{
                    backgroundColor: '#323a49',
                    border: 'none',
                    color: '#fff',
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? eyeOpen : eyeClose}
                    alt="Toggle visibility"
                    style={{ width: 22, height: '25px',marginLeft: '90px' }}
                  />
                </button>
              </div>
              {errors.password && <div className="text-danger mt-1">{errors.password.message}</div>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                onChange={handleChange}
                style={{
                  backgroundColor: '#323a49',
                  border: 'none',
                  color: '#fff',
                }}
                autoComplete="off"
              />
              {errors.confirmPassword && <div className="text-danger mt-1">{errors.confirmPassword.message}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-100 text-white"
              style={{
                backgroundColor: '#6c5ce7',
                borderColor: '#6c5ce7',
                margin: '0px',
                padding: '9px',
                borderRadius: '7px',}}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
