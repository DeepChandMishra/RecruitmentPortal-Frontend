import React from "react";
import Logo from "../assets/images/logo.svg";
import facebookIcon from "../assets/images/facebook.svg";
import linkedInIcon from "../assets/images/linked-in.svg";
import instagramIcon from "../assets/images/instagram.svg";
import "./layouts.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DropdownIcon from "../assets/images/arrow-dropdown.svg";
import bellIcon from "../assets/images/bell.svg";
import notionIcon from "../assets/images/notion.svg";
import { useSelector } from "react-redux";
import { useSocket } from "../context/socketContext";
import { logout } from "../redux/actions/user";
import { logoutUser } from "../redux/actions/common";

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);
  const userId = userDetails?._id || localStorage.getItem("userId");

  const handleLogout = () => {
    userLogout(userId);
  };

  //User Logout
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

  return (
    <div className="landingPage employee-main">
      <header className="employee-header">
        <div className="LaningHeader">
          <div class="container">
            <nav class="navbar navbar-expand-xl">
              <div className="d-flex align-items-center align-start nav-width justify-content-between">
                <div className="logo d-flex gap-xl-5 width-col gap-lg-3 align-items-end align-start">
                  <img src={Logo} alt="mainlogo" />

                  <div className="collapse navbar-collapse " id="navbarNav">
                    <div className="gap-xl-4 gap-lg-3 end-col d-flex header-text-row">
                      <a
                        onClick={() => {
                          userDetails.role == "employee"
                            ? navigate("/employee-dashboard")
                            : navigate("/employer-dashboard");
                        }}
                      >
                        Dashboard
                      </a>

                      <a>Opportunities Post</a>

                      <a>Candidates</a>

                      <a type="button" onClick={() => navigate("/messages")}>
                        Messages
                      </a>

                      <a>Calendar </a>
                    </div>
                  </div>
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
                class="collapse navbar-collapse  justify-content-end"
                id="navbarNav"
              >
                <div className="d-flex gap-5 end-col align-items-center">
                  <div class="dropdown-header  ">
                    <button
                      class="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={bellIcon} alt="bell" />
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="dropdown-item" type="button">
                          Notification
                        </a>
                      </li>
                    </ul>
                    <img
                      src={DropdownIcon}
                      alt="dropdown-icon"
                      className="dropdown-icon-bell"
                    />
                  </div>

                  <div class="dropdown-header  dropdown-notion">
                    <button
                      class="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={notionIcon} alt="bell" className="notion-img" />
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                          class="dropdown-item"
                          type="button"
                          onClick={() => navigate("/profile-user")}
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          type="button"
                          onClick={() => navigate("/job-tracker")}
                        >
                          Applications
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          type="button"
                          onClick={() => handleLogout()}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                    <img
                      src={DropdownIcon}
                      alt="dropdown-icon"
                      className="dropdown-icon-notion"
                    />
                  </div>
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
                <img src={Logo} alt="logo" className="logo-footer" />
                <p className="pt-4">
                  Connect with employers who appreciate your seasoned skills and
                  find the perfect role.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4>
                    {" "}
                    <a href="">Quick Links</a>
                  </h4>
                  <li>
                    <a onClick={() => navigate("/")}>Home</a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/information")}>Information</a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/faq")}>FAQ's</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4>
                    {" "}
                    <a href="">Main Links</a>
                  </h4>
                  <li>
                    <a onClick={() => navigate("/employee-dashboard")}>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/job-search")}>
                      Opportunities Search
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/messages")}>Messages</a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/employee-calendar")}>
                      Calander
                    </a>
                  </li>
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

          <div className="d-flex social-links-row gap-3 justify-content-end">
            <div className="social-icons-wrapper">
              <a
                href={
                  process.env.REACT_APP_FACEBOOK_URL ||
                  "https://www.facebook.com/share/17RPzZfsXK/?mibextid=wwXIfr"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
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
                {" "}
                <img src={linkedInIcon} alt="linkedin-icon" />
              </a>
            </div>

            <div className="social-icons-wrapper">
              <a
                href={
                  process.env.REACT_APP_INSTAGRAM_URL ||
                  "https://www.instagram.com/activeage.eu?igsh=eW50MjN4dmhrMTdu&utm_source=qr"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                <img src={instagramIcon} alt="instagram-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
