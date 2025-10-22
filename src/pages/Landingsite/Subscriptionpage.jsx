import React, { useEffect, useRef, useState } from "react";
import "./landingComponent.css";
import bannerSubscription from "../../assets/videos/subscription-banner.mp4";
import arrowBtn from "../../assets/images/arrow-button.svg";
import faqImg from "../../assets/images/smilegirl.png";
import CompanyTab from "../../components/tabs/CompanyTab";
import CandidateTab from "../../components/tabs/CandidateTab";
import { useNavigate } from "react-router-dom";
import { pageContent } from "../../redux/actions/cms";
import { useDispatch, useSelector } from "react-redux";
import { getContentByHeading } from "../../util/UtilFunction";
import { getSubscriptionListing } from "../../redux/actions/stripe";
import OldImg from "../../assets/images/men1.jpeg";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../redux/action-types";
import { logoutUser } from "../../redux/actions/common";

export default function Subscriptionpage() {
  const [planType, setPlanType] = useState("year");
  const [activeTab, setActiveTab] = useState("year"); // Add this line
  const [role, setRole] = useState("employer");
  const [loader, setLoader] = useState(false);
  const { isAuthenticate } = useSelector((state) => state.user);
  const loggedInUser = useSelector((state) => state.user?.userDetails?.role);
  const { userDetails } = useSelector((state) => state.user);
  const userId = userDetails?._id || localStorage.getItem("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const subscriptionSectionRef = useRef(null);
  const { contentData } = useSelector((state) => state.cms);
  console.log("contentData", contentData);
  const { i18n } = useTranslation();
  let lang = i18n.language;

  console.log("lang", lang);

  // Function to handle scroll
  const handleScrollToSubscriptions = () => {
    if (subscriptionSectionRef.current) {
      subscriptionSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //handleSignup
  const handleSignup = () => {
    const socailLogin = {
      socailLogin: false,
    };
    navigate("/welcome", { state: socailLogin });
  };

  //Get Page Content
  const getPageContent = (page_name) => {
    try {
      dispatch(pageContent(page_name, (result) => {}));
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    getPageContent("For organizations");
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      dispatch({
        type: ActionType.IS_AUTHENTICATE,
        payload: false,
      });
      if (userId) {
        userLogout(userId);
      }
      localStorage.clear();
      console.log("localStorage cleared after 30 minutes.");
    }, 1800000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const userLogout = (user_id) => {
    try {
      dispatch(
        logoutUser(user_id, (result) => {
          console.log("result", result);
          if (result.status) {
            dispatch(logout());
            localStorage.clear();
            navigate("/");
          }
        })
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scrolling smooth
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  //Get Subcription List for Employer
  const getSubcriptionsPlan = () => {
    try {
      setLoader(true);
      let param = {
        sortBy: -1,
        limit: 50,
        page: 1,
        status: true,
        plan: planType,
        role: role,
        language: lang,
      };
      dispatch(
        getSubscriptionListing(param, (result) => {
          console.log("result", result);
          if (result.status) {
            setLoader(false);
          }
        })
      );
    } catch (error) {
      console.log("Error:", error);
    } finally {
      // setLoader(false)
    }
  };

  useEffect(() => {
    getSubcriptionsPlan();
  }, [role, planType, lang]);

  return (
    <>
      <section className="activeage_title">
        <div className="container">
          <div className="row banner-subscription">
            <div className="col-lg-12 col-md-12">
              <div>
                <h2
                  dangerouslySetInnerHTML={{
                    __html: `
                    ${getContentByHeading(
                      contentData?.content,
                      "Know More Heading",
                      lang
                    )}
                    <span></span>
                    ${getContentByHeading(
                      contentData?.content,
                      "Know More subHeading",
                      lang
                    )}`,
                  }}
                ></h2>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: getContentByHeading(
                          contentData?.content,
                          "Know More Text",
                          lang
                        ),
                      }}
                    ></p>
                  </div>
                  <div className="col-lg-6 mobile">
                    <div className="banner-vid-wrapper">
                      {/* <video src={bannerSubscription} autoPlay muted loop></video> */}
                      <img src={OldImg} alt="men" />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 py-5 flex-wrap flex-md-nowrap justify-content-center justify-content-md-start">
                  <button
                    className="btn btn-outline-primary btn-sign-in"
                    type="button"
                    onClick={() => {
                      window.open(
                        "https://business.gov.nl/regulation/work-performed-by-state-pensioners/",
                        "_blank"
                      );
                    }}
                  >
                    {"Learn more!"}
                  </button>

                  {!isAuthenticate && (
                    <div>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleSignup()}
                      >
                        Register
                      </button>
                    </div>
                  )}
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sign-in"
                      type="button"
                      onClick={() => {
                        if (isAuthenticate) {
                          if (loggedInUser === "employee") {
                            navigate("/employee-dashboard");
                          } else if (loggedInUser === "employer") {
                            navigate("/employer-dashboard");
                          } else {
                            navigate("/");
                          }
                        } else {
                          navigate("/");
                        }
                      }}
                    >
                      {isAuthenticate ? "Go To Dashboard" : "Back To Home"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 desktop">
              <div className="banner-vid-wrapper">
                {/* <video src={bannerSubscription} autoPlay muted loop></video> */}
                <img src={OldImg} alt="men" />
              </div>
            </div>
          </div>
          <div
            className="text-center pb-5 mt-5"
            onClick={handleScrollToSubscriptions}
          >
            <button className="cta-btn">
              <img src={arrowBtn} alt="img" className="img-fluid" />
              See our subscriptions below
            </button>
          </div>
        </div>
      </section>

      <section className="subscription-tabs" ref={subscriptionSectionRef}>
        <div className="container">
          <div className="d-flex justify-content-between flex-wrap">
            <div className="text-col col-md-12 col-lg-6">
              <h2
                dangerouslySetInnerHTML={{
                  __html: getContentByHeading(
                    contentData?.content,
                    "Subscriptions Heading",
                    lang
                  ),
                }}
              ></h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: getContentByHeading(
                    contentData?.content,
                    "Subscriptions Text",
                    lang
                  ),
                }}
              ></p>
            </div>

            <div className="main-tabs-wrapper text-lg-end text-md-center col-md-12 col-lg-6">
              <div className=" text-end">
                <ul
                  class="nav nav-tabs d-inline-flex  tabs-custom"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation"></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row pt-1">
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="company-tab-pane"
                role="tabpanel"
                aria-labelledby="company-tab"
                tabindex="0"
              >
                {" "}
                <CompanyTab
                  setPlanType={setPlanType}
                  loader={loader}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />{" "}
              </div>
              <div
                class="tab-pane fade"
                id="candidate-tab-pane"
                role="tabpanel"
                aria-labelledby="candidate-tab"
                tabindex="0"
              >
                <div className="text-center py-5">
                  <p>No subscription required for candidate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
