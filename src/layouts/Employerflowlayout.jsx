import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { languageMultiList } from "../util/contant";
import { useTranslation } from "react-i18next";
import {
  blankProfile,
  getContentByHeading,
  getNotificationTimeAgo,
  getTimeAgo,
} from "../util/UtilFunction";
import backImage from "../assets/images/blank-profile.png";
import userImg from "../assets/images/user-img.jpg";
import { useSocket } from "../context/socketContext";
import {
  logoutUser,
  notificationListing,
  notificationStatus,
} from "../redux/actions/common";
import { Button } from "react-bootstrap";
import { getAllRoomList } from "../redux/actions/message";
import { ActionType } from "../redux/action-types";
import { logout } from "../redux/actions/user";
import questionMarkIcon from "../assets/images/question-mark.svg";
import axios from "axios";
import Environment from "../environment";
import useFetchAndRedirect from "../customHook/useUrlManagement";
import WebsiteFeedback from "../components/WebsiteFeedback";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { pageFooterContent } from "../redux/actions/cms";

const Employerflowlayout = ({ children }) => {
  const [bell, setBell] = useState(false);
  const [language, setLanguage] = useState();
  const [notification, setNotification] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [footerContent, setFooterContent] = useState(null);

  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");
  let lang = i18n.language;

  //Redux State
  const { userDetails, subUser } = useSelector((state) => state.user);
  const { notificationList } = useSelector((state) => state.common);
  const { roomList, roomDetails, unreadcount } = useSelector(
    (state) => state.message
  );
  const userId = userDetails?._id || localStorage.getItem("userId");
  console.log("🚀 ~ Employerflowlayout ~ unreadcount:", unreadcount);

  //Open Feedback Modal
  const handleFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  //Close Feedback Modal
  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

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

  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    if (notification) {
      for (let item of notification) {
        if (item.seen === false) {
          setBell(true);
          return;
        }
      }
      setBell(false);
    }
  }, [notification]);

  useEffect(() => {
    socket?.on("receiveNotification", (data) => {
      console.log("receiveNotification", data);
      setNotification((prevNotification) => [
        data, // Add the new data at the top
        ...(prevNotification || []), // Spread the existing notifications after the new data
      ]);
    });
  }, [socket]);

  //Function to Change Language
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    setLanguage(languageValue);
    i18n.changeLanguage(languageValue);
  };

  const getChatroomList = () => {
    dispatch(getAllRoomList());
  };

  useEffect(() => {
    getChatroomList();
  }, []);

  // const getNotificationsList = (user_id) => {
  //   try {
  //     dispatch(
  //       getNotifications(user_id, (result) => {
  //         if (result.status) {
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (userId) {
  //     getNotificationsList(userId);
  //   }
  // }, [userId]);

  const getTotalUnreadMessages = () => {
    const totalUnreadCount =
      roomList?.reduce((acc, room) => acc + room.unreadMessageCount, 0) || 0;
    console.log("Total Unread Message Count:", totalUnreadCount);
    return totalUnreadCount;
  };

  useEffect(() => {
    let response = getTotalUnreadMessages();
    if (response) {
      console.log("🚀 ~ useEffect ~ response:", response);
      dispatch({
        type: ActionType.TOTAL_UNREADCOUT,
        payload: response,
      });
    }
  }, [roomList]);

  useEffect(() => {
    socket?.on("receiveNotification", (data) => {
      console.log("receiveNotification", data);
    });
  }, [socket]);

  const handleProfileView = () => {
    navigate(`/employer-job-candidate/${userId}`);
  };

  const getNotification = () => {
    dispatch(
      notificationListing(userId, (result) => {
        console.log({ result });
        setNotification(result?.data?.docs);
      })
    );
  };

  const handleNotification = () => {
    dispatch(
      notificationStatus(userId, (result) => {
        if (result) setBell(false);
      })
    );
  };

  const viewNotification = (item) => {
    console.log({ item });
    navigate("/applicant-tracker");
  };

  const handleFetchAndRedirect = async () => {
    const urlName = window.location.pathname;
    const managrUrl = useFetchAndRedirect(`${urlName}`);
  };

  useEffect(() => {
    dispatch(
      pageFooterContent("Footer Dashboard", (response) => {
        if (response?.statusCode === 200 && response?.data?.content?.length) {
          setFooterContent(response?.data?.content);
        }
      })
    );
  }, []);

  console.log({ notificationList });
  return (
    <div className="landingPage employee-main">
      <header className="employee-header">
        <div className="LaningHeader">
          <div class="container">
            <nav class="navbar navbar-expand-xl">
              <div className="d-flex align-items-center align-start nav-width justify-content-between">
                <div className="logo d-flex gap-xl-4 width-col gap-lg-3 align- items-baseline align-start">
                  <div className="language-pre">
                    <img
                      src={Logo}
                      alt="mainlogo"
                      className="pointer-cursor"
                      onClick={() => navigate("/")}
                    />{" "}
                    <select
                      name="cars"
                      id="Domain"
                      value={language}
                      onChange={changeLanguageHandler}
                      className="language-changer lang-block"
                    >
                      {languageMultiList?.map((o, index) => (
                        <option key={index} value={o?.value}>
                          {o?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="collapse navbar-collapse " id="navbarNav">
                    <div className="gap-xl-4 gap-lg-3 end-col d-flex header-text-row">
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => {
                          navigate("/employer-dashboard");
                        }}
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav1
                        }
                      </a>

                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employer-job-post")}
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav2
                        }
                      </a>

                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employer-candidates")}
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav3
                        }
                      </a>

                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employer-message")}
                        className="message-badge"
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav4
                        }

                        {/* {unreadcount > 0 && (
                          <div className="notification-badge"></div>
                        )} */}
                      </a>

                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employer-calendar")}
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav5
                        }{" "}
                      </a>

                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/applicant-tracker")}
                      >
                        {
                          landingContent?.employerDashbaord?.employerHeader
                            ?.nav6
                        }
                      </a>
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
                <button
                  data-bs-toggle="collapse"
                  data-bs-target=".navbar-collapse.show"
                  class="btn btn-primary share_btn"
                  type="button"
                  onClick={handleFeedbackModal}
                >
                  {
                    landingContent?.employerDashbaord?.employerHeader
                      ?.share_thoughts_button
                  }
                </button>{" "}
                <select
                  name="cars"
                  id="Domain"
                  value={language}
                  onChange={changeLanguageHandler}
                  className="language-changer lang-none"
                >
                  {/* <option value="">Domain</option> */}
                  {languageMultiList?.map((o, index) => (
                    <option key={index} value={o?.value}>
                      {o?.label}
                    </option>
                  ))}
                </select>
                <div className="d-flex gap-5 end-col align-items-center">
                  <div class="dropdown-header  notification-header">
                    <button
                      class="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={handleNotification}
                    >
                      {bell && <div className="notification-badge"></div>}

                      <img src={bellIcon} alt="bell" />

                      <img
                        src={DropdownIcon}
                        alt="dropdown-icon"
                        className="dropdown-icon-bell"
                      />
                    </button>
                    <ul class="dropdown-menu notification-menu-items">
                      <div className="notification-header">
                        <p className="notification-heading">Notification</p>
                        {/* <Button className="clear-btn">Clear All</Button> */}
                      </div>
                      {notification && notification?.length > 0 ? (
                        notification?.map((item) => (
                          <li
                            onClick={() => viewNotification(item)}
                            className="dropdown-item"
                          >
                            {/* <img className="notification-img" src={userImg} alt="user" /> */}
                            <p className="dropdown-inner-item">
                              {item?.message}
                            </p>
                            <p className="notification-time-col">
                              {getNotificationTimeAgo(item?.updatedAt)}
                            </p>
                          </li>
                        ))
                      ) : (
                        <li>
                          <a class="dropdown-item">No notifications</a>
                        </li>
                      )}
                      {/* <div className="view-actiobtn">
                        <Button className="view-btn">View All</Button>
                      </div> */}
                    </ul>
                  </div>

                  <div class="dropdown-header  dropdown-notion">
                    <button
                      class="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          userDetails?.image == ""
                            ? backImage
                            : userDetails?.image
                        }
                        alt="bell"
                        className="notion-img"
                      />
                      <img
                        src={DropdownIcon}
                        alt="dropdown-icon"
                        className="dropdown-icon-notion"
                      />
                    </button>
                    <ul
                      className="dropdown-menu"
                      style={{
                        width: "max-content",
                      }}
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          onClick={() => handleProfileView()}
                        >
                          Profile
                        </a>
                      </li>
                      {!subUser && (
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => setShowChangePassword(true)}
                          >
                            Change password
                          </a>
                        </li>
                      )}
                      <li>
                        <a
                          class="dropdown-item"
                          onClick={() => navigate("/employer-job-description")}
                        >
                          Applicants
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" onClick={() => handleLogout()}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <div className="spacing-top-layout">
        {children}
        {/* <button
          className="border-0 bg-transparent question-mark-icon"
          onClick={handleFetchAndRedirect} class
        >
          <img src={questionMarkIcon} alt="icon" />
        </button> */}

        <div className="help-describer">
          <button
            onClick={handleFetchAndRedirect}
            className="border-0 bg-transparent question-mark-icon"
          >
            {" "}
            <img src={questionMarkIcon} alt="icon" />
          </button>
        </div>
      </div>

      <div className="landingFotter">
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap footer-details-row">
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <img
                  src={Logo}
                  alt="logo"
                  className="logo-footer pointer-cursor"
                  onClick={() => navigate("/")}
                />
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
                    <a href="">
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
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4>
                    <a href="">
                      {landingContent?.footerDetails?.mainHeadling2}
                    </a>
                  </h4>
                  <li>
                    <a onClick={() => navigate("/employer-dashboard")}>
                      {landingContent?.footerDetails?.mainHeadling2_button1}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/employer-job-post")}>
                      {landingContent?.footerDetails?.mainHeadling2_button2}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/employer-message")}>
                      {landingContent?.footerDetails?.mainHeadling2_button3}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/employer-calendar")}>
                      {landingContent?.footerDetails?.mainHeadling2_button4}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-details">
                <ul>
                  <h4 className="info">
                    <a href="">info@activeage.eu</a>
                  </h4>
                </ul>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-white font-size-16">
              Registered in the Netherlands under Chamber of Commerce number:
              97689114
            </div>
            <div className="d-flex social-links-row gap-3 justify-content-end">
              <div className="social-icons-wrapper">
                <a
                  href={
                    process.env.REACT_APP_FACEBOOK_URL ||
                    "https://www.facebook.com/share/17RPzZfsXK/?mibextid=wwXIfr"
                  }
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
                >
                  {" "}
                  <img src={instagramIcon} alt="instagram-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* website feedback */}
      <WebsiteFeedback show={showFeedbackModal} onHide={closeFeedbackModal} />
      <ChangePasswordModal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      />
    </div>
  );
};

export default Employerflowlayout;
