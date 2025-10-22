import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logo.svg";
import facebookIcon from "../assets/images/facebook.svg";
import linkedInIcon from "../assets/images/linked-in.svg";
import instagramIcon from "../assets/images/instagram.svg";
import "./layouts.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../redux/action-types";
import { useTranslation } from "react-i18next";
import { languageMultiList } from "../util/contant";
import questionMarkIcon from "../assets/images/question-mark.svg";
import { getContentByHeading } from "../util/UtilFunction";
import { pageFooterContent } from "../redux/actions/cms";

const Landinglayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { contentData } = useSelector((state) => state.cms);
  const { isAuthenticate, loading } = useSelector((state) => state.user);
  const role = useSelector((state) => state.user?.userDetails?.role);
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");
  const [footerContent, setFooterContent] = useState(null);

  useEffect(() => {
    dispatch(
      pageFooterContent("Footer Dashboard", (response) => {
        if (response?.statusCode === 200 && response?.data?.content?.length) {
          setFooterContent(response?.data?.content);
        }
      })
    );
  }, []);
  console.log("footerContent", footerContent);

  //handleSignup
  const handleSignup = () => {
    const socailLogin = {
      socailLogin: false,
    };
    navigate("/welcome", { state: socailLogin });
  };

  const handleRoleType = (type) => {
    dispatch({
      type: ActionType.USER_REGISTRATION_ROLE,
      payload: type,
    });
    navigate("/welcome");
  };

  //Creating a method to change the language onChnage from select box
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    console.log("asdad", languageValue);
    setLanguage(languageValue);
    i18n.changeLanguage(languageValue);
  };
  //Calling t and i18n method from useTranslation hook
  let lang = i18n.language;

  const handleLogin = () => {
    console.log("called called", isAuthenticate, role);
    if (isAuthenticate && role == "employee") {
      navigate("/employee-dashboard");
    } else if (isAuthenticate && role == "employer") {
      navigate("/employer-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landingPage">
      <header>
        <div className="LaningHeader">
          <div class="container">
            <nav class="navbar navbar-expand-lg">
              <div className="d-flex align-items-center nav-width justify-content-between">
                <div className="language-pre">
                  <Link to="/" className="logo-container">
                    <img src={Logo} alt="mainlogo" className="logo-img" />
                    <span className="back-to-home-text">Back to homepage</span>
                  </Link>

                  <select
                    name="cars"
                    id="Domain"
                    className="language-changer lang-block"
                    value={language}
                    onChange={changeLanguageHandler}
                  >
                    {/* <option value="">Domain</option> */}
                    {languageMultiList?.map((o, index) => (
                      <option key={index} value={o?.value}>
                        {o?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
              </div>
              <div
                class="collapse navbar-collapse justify-content-end"
                id="navbarNav"
              >
                <select
                  name="cars"
                  id="Domain"
                  className="language-changer lang-none"
                  value={language}
                  onChange={changeLanguageHandler}
                >
                  {/* <option value="">Domain</option> */}
                  {languageMultiList?.map((o, index) => (
                    <option key={index} value={o?.value}>
                      {o?.label}
                    </option>
                  ))}
                </select>
                <div className="buttongrouped">
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    onClick={() => navigate("/information")}
                  >
                    {landingContent?.nav?.information}
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    onClick={() => navigate("/company")}
                  >
                    {landingContent?.nav?.for_organizations}
                  </button>
                  {/* <Link > */}
                  <button
                    className="btn btn-outline-primary btn-sign-in sign_btn"
                    onClick={() => handleLogin()}
                  >
                    {landingContent?.nav?.sign_in}
                  </button>
                  {/* </Link> */}
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleSignup()}
                  >
                    {landingContent?.nav?.register}
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <div className="spacing-top-layout">{children}</div>
      <div className="landingFotter">
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap footer-details-row">
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <img
                  src={Logo}
                  alt="logo"
                  className="logo-footer"
                  onClick={() => navigate("/")}
                />
                {/* <p className='pt-4'>Connect with employers who appreciate your seasoned skills and find the perfect role.</p> */}
                <div
                  className="pt-4"
                  dangerouslySetInnerHTML={{
                    __html: getContentByHeading(
                      footerContent,
                      "Footer Text",
                      lang
                    ),
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4>
                    <a className="text-decoration-underline">
                      {landingContent?.footerDetails?.mainHeadling1}
                    </a>
                  </h4>
                  <li>
                    <a onClick={() => navigate("/")}>
                      {landingContent?.footerDetails?.mainHeadling1_button1}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/information")}>
                      {landingContent?.footerDetails?.mainHeadling1_button2}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/company")}>
                      {landingContent?.footerDetails?.mainHeadling1_button3}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="help-describer">
              <button className="border-0 bg-transparent question-mark-icon">
                {" "}
                <img src={questionMarkIcon} alt="icon" />
              </button>
            </div>

            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4>
                    <a className="text-decoration-underline">Join Us As</a>
                  </h4>
                  <li>
                    <a onClick={() => handleRoleType("employee")}>Candidate</a>
                  </li>
                  <li>
                    <a onClick={() => handleRoleType("employer")}>Employer</a>
                  </li>
                  <li></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4 className="info">
                    {" "}
                    <a href="">info@activeage.eu</a>
                  </h4>
                </ul>
              </div>
            </div>
          </div>
          <hr />

          <div className="d-flex social-links-row gap-3 justify-content-between align-items-center ">
            <div className="company-registration-text text-white font-size-16">
              Registered in the Netherlands under Chamber of Commerce number:
              97689114
              <div className="company-registration-text text-white font-size-16">
                <span style={{ fontWeight: 'bold', fontSize: '22px', color: 'white' }}>&copy;</span> Copyright 2025. All rights reserved.
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="social-icons-wrapper">
                <a
                  href="https://www.facebook.com/share/17RPzZfsXK/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={facebookIcon} alt="facebook-icon" />
                </a>
              </div>

              <div className="social-icons-wrapper">
                <a
                  href={
                    process.env.REACT_APP_LINKEDIN_URL ||
                    "https://www.linkedin.com/company/activeage-eu"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedInIcon} alt="linkedin-icon" />
                </a>
              </div>

              <div className="social-icons-wrapper">
                <a
                  href="https://www.instagram.com/activeage.eu?igsh=eW50MjN4dmhrMTdu&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagramIcon} alt="instagram-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landinglayout;
