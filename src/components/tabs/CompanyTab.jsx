import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/loader";
import * as bootstrap from "bootstrap";

// Slider settings matching your original config
const yearlySlider = {
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
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const monthlySlider = { ...yearlySlider };

export default function CompanyTab({
  setPlanType,
  loader,
  activeTab,
  setActiveTab,
  setSelectedBuyPlan,
}) {
  const navigate = useNavigate();
  const { subscriptionList } = useSelector((state) => state.stripe);
  const location = useLocation();

  console.log("location", location?.pathname);
  // Filter plans
  const yearlyPlans = subscriptionList?.filter((o) => o.planType === "year");
  const monthlyPlans = subscriptionList?.filter((o) => o.planType === "month");

  const handlePlanSelect = (data) => {
    if (location?.pathname !== "/details-organization-plan") {
      navigate("/login");
      return;
    }

    setSelectedBuyPlan(data);

    const modalEl = document.getElementById("viewplanModal");
    if (modalEl) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  };

  return (
    <div className="pt-3 comp_tab">
      {/* Tabs */}
      <div className="text-center">
        <div className=" mb-1 fw-lighter save-position">Save up to 30%</div>
        <ul
          className="nav nav-tabs tabs-custom d-inline-flex justify-content-center"
          id="myTab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "year" ? "active" : ""}`}
              id="home-tab"
              style={{ width: "145px" }}
              type="button"
              role="tab"
              aria-controls="home-tab-pane"
              aria-selected={activeTab === "year"}
              onClick={() => {
                setActiveTab("year");
                setPlanType("year");
              }}
            >
              Yearly
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "month" ? "active" : ""}`}
              id="profile-tab"
              type="button"
              style={{ width: "145px" }}
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected={activeTab === "month"}
              onClick={() => {
                setActiveTab("month");
                setPlanType("month");
              }}
            >
              Monthly
            </button>
          </li>
        </ul>
      </div>

      <div className="tab-content py-5" id="myTabContent">
        {/* Yearly */}
        <div
          className={`tab-pane fade ${activeTab === "year" ? "show active" : ""
            }`}
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex="0"
        >
          <div className=" slider-container">
            {loader ? (
              <Loading />
            ) : yearlyPlans?.length ? (
              <Slider {...yearlySlider} className="subsciption-slider">
                {yearlyPlans.map((o) => (
                  <div key={o._id} className="cards-tab">
                    <div className="title-card">
                      <h3>{o.title}</h3>
                      <h4 className="d-inline">
                        {o.currency === "usd" ? `$${o.amount}` : `€${o.amount}`}
                      </h4>
                      {o.trial_period_days && (
                        <span className="discount-col">
                          + {o.trial_period_days} days free
                        </span>
                      )}
                      <div>
                        <span className="mt-2">billed annually</span>
                      </div>
                    </div>
                    <div className="body-card">
                      <ul>
                        <h5>Details</h5>
                        <div
                          dangerouslySetInnerHTML={{ __html: o.description }}
                        />
                        <div className="text-center mt-auto">
                          <button
                            className="get-started"
                            type="button"
                            data-bs-dismiss="modal"
                            onClick={() => handlePlanSelect(o)}
                          >
                            Select plan
                          </button>
                        </div>
                      </ul>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center">No yearly plans available.</p>
            )}
          </div>
        </div>

        {/* Monthly */}
        <div
          className={`tab-pane fade ${activeTab === "month" ? "show active" : ""
            }`}
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          <div className="slider-container">
            {loader ? (
              <Loading />
            ) : monthlyPlans?.length ? (
              <Slider {...monthlySlider} className="subsciption-slider ">
                {monthlyPlans.map((o) => (
                  <div key={o._id} className="cards-tab">
                    <div className="title-card">
                      <h3>{o.title}</h3>
                      <h4 className="d-inline">
                        {o.currency === "usd" ? `$${o.amount}` : `€${o.amount}`}
                      </h4>
                      {o.trial_period_days && (
                        <span className="discount-col">
                          + {o.trial_period_days} days free
                        </span>
                      )}
                      <div>
                        <span className="mt-2">billed monthly</span>
                      </div>
                    </div>
                    <div className="body-card">
                      <ul>
                        <h5>Details</h5>
                        <div
                          dangerouslySetInnerHTML={{ __html: o.description }}
                        />
                        <div className="text-center">
                          <button
                            className="get-started"
                            type="button"
                            onClick={() => handlePlanSelect(o)}
                          >
                            Get Started
                          </button>
                        </div>
                      </ul>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center">No monthly plans available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
