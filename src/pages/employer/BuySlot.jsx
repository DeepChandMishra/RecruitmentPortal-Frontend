import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { checkoutSlot, getJobSlotPlan } from "../../redux/actions/stripe";
import { toast } from "react-toastify";
import Loading from "../../components/loader";
import { useNavigate } from "react-router-dom";

const BuySlot = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getJobSlotPlan("employer", (result) => {
        console.log("result", result);
      })
    );
  }, []);

  const { jobSlotPlanList, loader } = useSelector((state) => state.stripe);
  const userId = localStorage.getItem("userId");

  const handleGetStarted = (planId) => {
    if (!userId) {
      toast.error("No User ID available");
      return;
    }
    const payload = {
      userId,
      planId: planId,
    };

    dispatch(
      checkoutSlot(payload, (result) => {
        if (result?.data?.url) {
          window.open(result.data.url);
        } else {
          toast.error("Unexpected checkout response:", result);
        }
      })
    );
  };

  return (
    <div className="py-5 buy_slot">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="slot_head">
              <div className="position-relative d-flex justify-content-end align-items-center mb-4">
                <h1 className="position-absolute start-50 translate-middle-x m-0">
                  Pricing
                </h1>
                <button
                    className="rounded bg-secondary price_btn "
                    onClick={() => navigate(`/employer-job-candidate/${userId}`)}
                >
                Back ← 
                </button>
              </div>

              <h4>See How Our Platform is Transforming Teams Worldwide.</h4>
              <p>
                Hear how Active Age is transforming operations and empowering
                teams across the globe.
              </p>
            </div>
          </div>

          <div className="slider-container">
            {loader ? (
              <Loading />
            ) : (
              <Slider {...settings} className="subsciption-slider">
                {Array.isArray(jobSlotPlanList) &&
                jobSlotPlanList.length > 0 ? (
                  jobSlotPlanList.map((plan) => (
                    <div className="cards-tab" key={plan.id || plan._id}>
                      <div className="title-card pb-0">
                        <h3>{plan?.title}</h3>
                        <h4 className="d-inline">${plan?.amount}</h4>
                        <div>
                          <span className="mt-2">{`per organization/${plan?.planType}`}</span>
                        </div>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: plan?.description,
                          }}
                        ></p>
                        <div className="text-center mt-1">
                          <button
                            className="btn mx-0 btn-outline"
                            type="button"
                            onClick={() => handleGetStarted(plan._id)}
                          >
                            Get Started
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="cards-tab">
                    <div className="title-card">
                      <h3>No Plans Available</h3>
                    </div>
                    {/* <div className="body-card">
                      <ul>
                        <h5>Please check back later</h5>
                      </ul>
                    </div> */}
                  </div>
                )}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySlot;
