import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { addedSlots, jobSlotSubscribtionPlan } from "../../../redux/actions/stripe";
import successSetup from "../../../assets/images/setup-success.svg";
import Logo from "../../../assets/images/logo.svg";
import Loading from "../../../components/loader";

const LoginSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const { pathname } = useLocation();
  const trimmedSuccessPath = pathname?.split("/")[1];
  const userId = localStorage.getItem("userId");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (`/${trimmedSuccessPath}` === "/jobslotpaymentsuccess") {
      subscribe();
    }
  }, []);

  const subscribe = async () => {
    setIsLoading(true);

    const _data = {
      user: userId,
      plan: param?.planId,
      token: param?.id,
    };

    await dispatch(jobSlotSubscribtionPlan(_data, () => { }));
    await dispatch(addedSlots({ planId: _data.plan }, () => { }));

    setIsLoading(false);
  };

  return (
    <div className="cardcontrols">
      {isLoading && <Loading />}

      <div className="logo-block text-center mb-4">
        <img
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
          }}
          onClick={() => {
            if (!isLoading) navigate("/");
          }}
          src={Logo}
          alt="logo"
        />
        <h5
          className="mb-1"
          style={{
            color: "black",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
          }}
          onClick={() => {
            if (!isLoading) navigate("/");
          }}
        >
          Back to homepage
        </h5>
      </div>

      <div className="cards text-center">
        <div className="titlecards pb-2">
          <h2>Thank You</h2>
          <img src={successSetup} alt="image" />
        </div>

        <div className="formdesign">
          <div className="formControls">
            <label className="customeLabel">
              <p>You have subscribed to a plan successfully.</p>
            </label>
          </div>

          <div className="d-flex justify-content-center btn-row mt-4">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/employer-dashboard")}
              disabled={isLoading}
              style={{
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
