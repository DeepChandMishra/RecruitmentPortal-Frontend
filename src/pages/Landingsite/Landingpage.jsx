import React, { useEffect, useRef, useState } from "react";
import "./landingComponent.css";
import candidateImg from "../../assets/images/candidate.svg";
import employerImg from "../../assets/images/employee.svg";
import arrowImg from "../../assets/images/arrow.svg";
import aboutUsBg from "../../assets/images/combi.png";
import aboutUsBg2 from "../../assets/images/men2.png";
import designImg from "../../assets/images/design.svg";
import analystImg from "../../assets/images/analyst.svg";
import electricianImg from "../../assets/images/electrician.svg";
import fianceImg from "../../assets/images/finance.svg";
import technologyImg from "../../assets/images/technology.svg";
import enigneeringImg from "../../assets/images/engineering.svg";
import marketingImg from "../../assets/images/marketing.svg";
import programmerImg from "../../assets/images/programmer.svg";
import userImg from "../../assets/images/user-img.svg";
import userImg1 from "../../assets/images/user-img-2.svg";
import userImg2 from "../../assets/images/user-img-3.svg";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import RatingsComponent from "../../components/starRatings/RatingsComponent";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getComments,
  jobTypesListingWithCount,
  logoutUser,
} from "../../redux/actions/common";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-types";
import { pageContent } from "../../redux/actions/cms";
import { blankProfile, getContentByHeading } from "../../util/UtilFunction";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import volunteerIcon from "../../assets/images/volunteer.svg";
import proBanoIcon from "../../assets/images/pro-bano.svg";
import temporayrCoverIcon from "../../assets/images/temporary-cover.svg";
import paidIcon from "../../assets/images/paid-search.svg";
import { languageMultiList } from "../../util/contant";

// Coments Slider

var comments = {
  dots: true,
  infinite: true, // ensure true for smoother breakpoint transitions
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        // remove initialSlide here to avoid zero-width calc on first paint
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

const Landingpage = () => {
  //Redux State
  const { contentData } = useSelector((state) => state.cms);
  const { jobTypeCount, commentListing } = useSelector((state) => state.common);
  console.log("🚀 ~ Landingpage ~ commentListing:", contentData);
  const [language, setLanguage] = useState("en");
  const { isAuthenticate } = useSelector((state) => state.user);
  const { userDetails } = useSelector((state) => state.user);
  const userId = userDetails?._id || localStorage.getItem("userId");
  console.log("isAuthenticate", isAuthenticate);
  const timerRef = useRef(null);
  //Calling t and i18n method from useTranslation hook
  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");
  let lang = i18n.language;

  const sliderRef = useRef();

  const forceSlickRefresh = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    // Try official refresh first
    if (slider?.slickGoTo) slider.slickGoTo(0, true);
    if (slider?.slickPause && slider?.slickPlay) {
      slider.slickPause();
      slider.slickPlay();
    }
    // Reach into innerSlider to trigger re-measure
    if (slider?.innerSlider?.onWindowResized) {
      slider.innerSlider.onWindowResized();
    }
  };

  useEffect(() => {
    // on mount
    const t = setTimeout(forceSlickRefresh, 0);
    // handle orientation changes too
    const onResize = () => forceSlickRefresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    // when comments arrive/re-render
    forceSlickRefresh();
  }, [commentListing]);

  useEffect(() => {
    // when CMS content/i18n changes could affect layout height/width
    forceSlickRefresh();
  }, [contentData, i18n.language]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Creating a method to change the language onChnage from select box
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    console.log("asdad", languageValue);
    setLanguage(languageValue);
    i18n.changeLanguage(languageValue);
  };

  //handleSignup
  const handleSignup = () => {
    const socailLogin = {
      socailLogin: false,
    };
    dispatch({
      type: ActionType.USER_REGISTRATION_ROLE,
      payload: "",
    });
    navigate("/welcome", { state: socailLogin });
  };

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
    }, 5000);
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

  const jobTypeList = async () => {
    try {
      dispatch(jobTypesListingWithCount((result) => {}));
    } catch (error) {}
  };

  useEffect(() => {
    jobTypeList();
  }, []);

  const handleUserType = (type) => {
    dispatch({
      type: ActionType.USER_REGISTRATION_ROLE,
      payload: type,
    });
    navigate("/welcome");
  };

  //Get Page Content
  const getPageContent = (page_name) => {
    try {
      dispatch(
        pageContent(page_name, (result) => {
          console.log("result", result);
        })
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getPageContent("Landing Page");
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scrolling smooth
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  /**
   * Get All Commnet List
   */
  const getAllComment = () => {
    try {
      let param = {
        sortBy: -1,
        limit: 10,
        page: 1,
      };

      dispatch(getComments(param, (result) => {}));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getAllComment();
  }, []);

  return (
    <>
      <main>
        {/* <select name="cars" id="Domain" className='language-changer' value={language} onChange={changeLanguageHandler}>
          {/* <option value="">Domain</option> }
          {languageMultiList?.map((o, index) => (
            <option key={index} value={o?.value}>{o?.label}</option>
          ))}

        </select> */}
        <div className="container">
          <div className="row main-banner-row">
            <div className="col-sm-6">
              <div className="banner-img-block">
                {/* <img src={bannerImg} alt="banner" className="img-fluid" /> */}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="banner-card">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: `${getContentByHeading(
                      contentData?.content,
                      "Banner Heading",
                      lang
                    )}<span></span><br/>`,
                  }}
                ></h2>
                <p
                  className="mt-0"
                  dangerouslySetInnerHTML={{
                    __html: getContentByHeading(
                      contentData?.content,
                      "Banner Text",
                      lang
                    ),
                  }}
                ></p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="text-end banner-text">
            {/* <h2>ACTIVEAGdsfsE</h2> */}
          </div>
        </div>

        {!isAuthenticate && (
          <div className="container">
            <div className="row justify-content-between cta-employee-row">
              <div className="col-lg-6 col-sm-12 cta-employee-col">
                <div
                  className="employer-cards"
                  onClick={() => handleUserType("employee")}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="img-col">
                      <img
                        src={candidateImg}
                        alt="image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="text-col text-center">
                      {/* <h3 className="m-0 p-0">I'm a candidate</h3> */}
                       <h3 className="m-0 p-0">{landingContent.heading.candidate_button}</h3>
                      {/* <p>(I am ActiveAge)</p> */}
                    </div>
                    <div className="btn-col">
                      <button>
                        {" "}
                        <img src={arrowImg} alt="arrow" className="img-fluid" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-6 col-sm-12 cta-employee-col"
                onClick={() => handleUserType("employer")}
              >
                <div className="employer-cards">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="img-col">
                      <img
                        src={employerImg}
                        alt="image"
                        className="img-fluid "
                      />
                    </div>
                    <div className="text-col text-center">
                      {/* <h3 className="m-0 p-0">I'm an employer</h3> */}
                        <h3 className="m-0 p-0">{landingContent.heading.employer_button}</h3>
                      {/* <p>(Looking for ActiveAge) </p> */}
                    </div>
                    <div className="btn-col">
                      <button>
                        <img
                          src={arrowImg}
                          alt="arrow"
                          className="img-fluid "
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <section className="about-us activeage_title">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 px-5 about-text-col">
              <div className="text px-5">
                <h2>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: getContentByHeading(
                        contentData?.content,
                        "About Heading",
                        lang
                      ),
                    }}
                  />
                </h2>

                <p
                  dangerouslySetInnerHTML={{
                    __html: getContentByHeading(
                      contentData?.content,
                      "About Text",
                      lang
                    ),
                  }}
                ></p>
                {!isAuthenticate && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleSignup()}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
            <div className="col-lg-6 px-5 about-img-col">
              <div className="about-img-bg">
                <div className="text-end img-top">
                  <img src={aboutUsBg} alt="image" className="img-fluid" />
                </div>
                <div className="img-bottom">
                  <img src={aboutUsBg2} alt="image" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="job-options">
        <div className="container">
          <div className="heading-col pb-2 pb-sm-5">
            <div>
              <h2>Types Of Opportunities</h2>
            </div>
            <div>
              {/* <button className='btn btn-sign-in btn-outline-primary'>View More</button> */}
            </div>
          </div>

          <div className="row job-options-row">
            {jobTypeCount &&
              jobTypeCount?.map((job) => (
                <div className="job-options-col col-xl-3 col-md-4 col-sm-6">
                  <div className="d-flex align-items-center job-options-wrapper">
                    <div className="img-col landing-oppotunities-img-col">
                      <img
                        src={
                          job.typeName == "Pro Bono"
                            ? temporayrCoverIcon
                            : job.typeName == "Paid"
                            ? paidIcon
                            : job.typeName == "Volunteer"
                            ? volunteerIcon
                            : job.typeName == "Temporary Cover"
                            ? proBanoIcon
                            : paidIcon
                        }
                        alt="clock-icon"
                        className="pb-2"
                      />
                      {/* <img src={designImg} alt="image" className='img-fluid' /> */}
                    </div>
                    <div className="text-col job-options-text-col">
                      <h3>{job.typeName}</h3>
                      <p>{job?.jobCount} {landingContent?.jobs?.title}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div>
            <h2 className="heading-col">What Our Users Say</h2>
          </div>

          <Slider ref={sliderRef} {...comments} className="comments-slider">
            {commentListing?.docs?.map((o) => (
              <div className="row-slider-cards" key={o?._id}>
                <div className="testimonials-cards-col">
                  <div className="testimonials-cards-wrapper">
                    <div className="testimonials-cards">
                      <div className="d-flex justify-content-between">
                        <div className="testimonials-cards-img">
                          <img
                            src={o.image ? o.image : blankProfile()}
                            alt="user-image"
                            className="img-fluid"
                          />
                        </div>

                        <div className="ratings">
                          {/* <RatingsComponent rating={o.rating} /> */}
                          <Rating
                            style={{ maxWidth: 100 }}
                            value={o?.rating}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="text-col">
                        <p>{o.comment}</p>
                        <h4>{o.name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Landingpage;
