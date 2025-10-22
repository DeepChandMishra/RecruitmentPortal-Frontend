import React, { useEffect, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../../util/validationSchema"; // Assuming you have a schema for signup
import { useDispatch, useSelector } from "react-redux";
import {
  getAcknowledgment,
  signup,
  socialLogin,
} from "../../../redux/actions/user"; // Assuming you have a signup action
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/fb-icon.svg";
import EyeIcon from "../../../assets/images/password-icon.svg";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import eyeClose from "../../../assets/images/eye-close.svg";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "../../../assets/images/logo.svg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const socketId = localStorage.getItem("socketId");

  //Redux State
  const { registrationRole, acknowledgment } = useSelector(
    (state) => state.user
  );
  console.log({ acknowledgment });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)

  //Toggle Password Eye
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  //Use Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });

  // Function to handle signup submission
  const signupUser = async (data) => {
    try {
      setIsLoading(true);
      dispatch(
        signup(data, (result) => {
          if (result && result?.statusCode !== 409) {
            console.log("🚀 ~ dispatch ~ result:", result);
            navigate("/registeredsuccess");
          }
          setIsLoading(false);
        })
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getAcknowledgmentData = () => {
    dispatch(getAcknowledgment());
  };

  useEffect(() => {
    getAcknowledgmentData();
  }, []);

  // Wrap input value updates with startTransition
  const handleChange = (event) => {
    const { name, value } = event.target;
    startTransition(() => {
      setValue(name, value, { shouldValidate: true });
    });
  };

  // Wrap signup user function with startTransition
  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    let userSignupDetails = {
      firstname: data.firstName,
      lastname: data.lastName,
      businessName: "",
      phone: "",
      email: data.email,
      role: registrationRole,
      password: data.password,
      image: "",
      address: {
        complete_address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
      },
      regNumber: "ABC123456",
      VAT: "VAT987654321",
      businessSize: 50,
      website: "",
    };
    startTransition(() => {
      signupUser(userSignupDetails);
    });
  };

  //Handle Google Login
  const handleGoogleLogin = (credentialResponse) => {
    let credentialDetails = jwtDecode(credentialResponse.credential);
    let userDataDetails = {
      email: credentialDetails?.email,
    };
    dispatch(
      socialLogin(userDataDetails, (result) => {
        if (result.status) {
          let detailsVerify = result?.data?.user?.detailAdded;
          let userData = result?.data?.user;
          const userId = result?.data?.user?.id;
          localStorage.setItem("userId", userId);
          const _data = { userId, socketId };
          window.socketIO.emit("updateSocketId", _data);
          if (!detailsVerify && userData.role == "employee") {
            navigate("/details-title");
          } else if (detailsVerify && userData.role == "employee") {
            navigate("/employee-dashboard");
          } else if (!detailsVerify && userData.role == "employer") {
            navigate("/details-employer");
          } else if (detailsVerify && userData.role == "employer") {
            navigate("/employer-dashboard");
          } else {
            navigate("/");
          }
        } else {
          const socailLogin = {
            firstname: credentialDetails?.given_name,
            lastname: credentialDetails?.family_name,
            email: credentialDetails?.email,
            image: credentialDetails?.picture,
            socailLogin: true,
          };
          navigate("/welcome", { state: socailLogin });
        }
        setIsLoading(false);
      })
    );
  };

  return (
    <div className="cardcontrols">
      <div className="logo-block text-center mb-5">
        <Link to="/" className="homepage-navigation">
          <h5 className="back-to-homepage">Back to homepage</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>

      <div className="cards">
        <div className="titlecards">
          {`Register as ${registrationRole == "employee" ? "candidate" : "employer"
            }`}
        </div>

        <div className="parent-progress pt-4">
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="progress-bar"></div>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="progress-bar"></div>
          </div>
        </div>

        <div className="formdesign">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formControls">
              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <label className="customeLabel">{landingContent?.signup?.firstname_label}</label>
                  <input
                    type="text"
                    className="authfields"
                    {...register("firstName")}
                    onChange={handleChange}
                    placeholder="First Name"
                    autoComplete="off"
                  />
                  {errors.firstName && (
                    <div className="errorMsg">{errors.firstName.message}</div>
                  )}
                </div>
                <div className="mobile-field col-lg-6 col-sm-12">
                  <label className="customeLabel">{landingContent?.signup?.lastname_label}</label>
                  <input
                    type="text"
                    className="authfields"
                    {...register("lastName")}
                    onChange={handleChange}
                    placeholder="Last Name"
                    autoComplete="off"
                  />
                  {errors.lastName && (
                    <div className="errorMsg">{errors.lastName.message}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="formControls">
              <label className="customeLabel">{landingContent?.signup?.email_label}</label>
              <input
                type="text"
                className="authfields"
                {...register("email")}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="off"
              />
              {errors.email && (
                <div className="errorMsg">{errors.email.message}</div>
              )}
            </div>

            <div className="formControls">
              <label className="customeLabel">{landingContent?.signup?.password_label}</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="authfields"
                  placeholder="Password"
                  {...register("password")}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="icon-password border-0 bg-transparent"
                >
                  <img
                    src={showPassword ? EyeIcon : eyeClose}
                    alt="Toggle Password Visibility"
                    className="eye-close-password"
                  />
                </button>
              </div>
              {errors.password && (
                <div className="errorMsg">{errors.password.message}</div>
              )}
            </div>

            <div className="formControls mt-3">
              <label className="customeLabel">{landingContent?.signup?.confirm_label}</label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="authfields"
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="icon-password border-0 bg-transparent"
                >
                  <img
                    src={showConfirmPassword ? EyeIcon : eyeClose}
                    alt="Toggle Password Visibility"
                    className="eye-close-password"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="errorMsg">{errors.confirmPassword.message}</div>
              )}
            </div>

            <div className="checkboxdesign formControls  acceptance-block">
              <label htmlFor="acceptance">
                <input
                  type="checkbox"
                  id="acceptance"
                  {...register("acceptance")}
                />
                <div className="checkbox__checkmark"></div>
                <span>
                  {landingContent?.signup?.mandate_note}
                  <button
                    type="button"
                    class="btn btn-primary terms-condition-modal"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    {landingContent?.signup?.termandconditions}
                  </button>
                </span>
              </label>
              {errors.acceptance && (
                <div className="errorMsg">{errors.acceptance.message}</div>
              )}
              {/* Terms and conditions Pop up */}

              <div
                class="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1
                        class="modal-title fs-5 ms-0"
                        id="staticBackdropLabel"
                      >
                        {acknowledgment?.termsOfService}

                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      {/* <p className="terms-header">
                        {" "}
                      </p> */}
                      <div className="terms-conditions-body">
                        {/* <h6 className="terms-heading">ACCEPTING THE TERMS</h6> */}
                        <p className="terms-content" dangerouslySetInnerHTML={{ __html: acknowledgment?.acceptingTheTerms }} />
                      </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Understood
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="formControls">
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            <div className="formControls text-center">
              <span className="form-text-light">{landingContent?.signup?.or_label}</span>
            </div>

            {/* <div className="d-flex gap-2 align-items-center justify-content-center icon-wrapper">
              <img src={GoogleIcon} alt="google-icon" className='social-media-icon' />
              <h6 className='mb-0'>Continue with Google</h6>
            </div> */}

            <div className="d-flex gap-2 align-items-center justify-content-center">
              <div className="formControls text-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleLogin(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </div>

            <div className="formControls text-center pt-3">
              <p className="form-text-light sign-up-bottom-text">
                {landingContent?.signup?.already_account}?{" "}
                <Link to="/login" className="links">
                  {landingContent?.signup?.signup_button}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
