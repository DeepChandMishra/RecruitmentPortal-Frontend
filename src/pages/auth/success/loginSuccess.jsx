import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { subscribePlan } from "../../../redux/actions/stripe";
import successSetup from "../../../assets/images/setup-success.svg";
import { addEmployerDetail } from "../../../redux/actions/user";
import Logo from "../../../assets/images/logo.svg";
import { toast } from "react-toastify";

const LoginSuccess = () => {

  //Redux State
  const param = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { pathname } = useLocation();
  const trimmedSuccessPath = pathname?.split('/')[1];
  const userId = localStorage.getItem("userId")




  useEffect(() => {
    if (`/${trimmedSuccessPath}` == '/paymentsuccess') {
      subscribe()
    }
  }, [])



  const subscribe = async () => {
    const _data = {
      user: userId,
      plan: param?.planId,
      token: param?.id
    }
    dispatch(subscribePlan(_data, (result => {
    })))
  }


  return (
    <div className="cardcontrols">
      <div className="logo-block text-center mb-5">
        <Link to='/' className='homepage-navigation'>
          <h5 className='back-to-homepage'>Back to homepage</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="cards text-center">
        <div className="titlecards pb-2">
          <h2>Thank You</h2>
          <img src={successSetup} alt="image" />
        </div>
        <div className="formdesign">
          <form>
            <div className="formControls">
              <label className="customeLabel">
                {pathname == "/success" && (
                  <p>
                    Kindly check your email a link has been sent there to reset
                    your password.{" "}
                  </p>
                )}
                {pathname == "/registeredsuccess" && (
                  <p>
                    A link has sent to your email. Please verify it by following
                    the provided instructions.
                  </p>
                )}
                {`/${trimmedSuccessPath}` == "/paymentsuccess" && (
                  <p>You have successfully subscribed to ActiveAge!</p>
                )}
              </label>
            </div>
            <div className="d-flex justify-content-between btn-row">
              <div className="formControls ">
                <button
                  className="btn btn-outline back"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Back to homepage
                </button>
              </div>

              <div className="formControls text-center">
                <button
                  className="btn btn-primary w-100 mx-2"
                  type="button"
                  onClick={() => navigate('/employer-dashboard')}
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
