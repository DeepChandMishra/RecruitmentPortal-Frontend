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
import avatarIcon from "../assets/images/Avatar.png";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { languageMultiList } from "../util/contant";
import {
  blankProfile,
  getContentByHeading,
  getNotificationTimeAgo,
  getTimeAgo,
} from "../util/UtilFunction";
import { useSocket } from "../context/socketContext";
import { logoutUser, notificationListing } from "../redux/actions/common";
import { ActionType } from "../redux/action-types";
import { getAllRoomList } from "../redux/actions/message";
import { logout } from "../redux/actions/user";
import questionMarkIcon from "../assets/images/question-mark.svg";
import WebsiteFeedback from "../components/WebsiteFeedback";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { pageFooterContent } from "../redux/actions/cms";

const Employeeflowlayout = ({ children }) => {
  const [count, setCount] = useState(0);
  const [bell, setBell] = useState(false);
  const [language, setLanguage] = useState();
  const [notification, setNotification] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [footerContent, setFooterContent] = useState(null);

  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Redux State
  const { userDetails } = useSelector((state) => state.user);
  const { notificationList } = useSelector((state) => state.common);
  const { roomList, roomDetails, unreadcount } = useSelector(
    (state) => state.message
  );

  //User ID
  const userId = userDetails?._id || localStorage.getItem("userId");

  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");
  let lang = i18n.language;

  useEffect(() => {
    dispatch(
      pageFooterContent("Footer Dashboard", (response) => {
        if (response?.statusCode === 200 && response?.data?.content?.length) {
          setFooterContent(response?.data?.content);
        }
      })
    );
  }, []);

  //Function to Change Language
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    setLanguage(languageValue);
    i18n.changeLanguage(languageValue);
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

  // const getURlData =()=>{
  //   const data = axios.get(`url`+${''})
  // }

  useEffect(() => {
    getNotification();
    // getURlData()
  }, []);

  const getChatroomList = () => {
    dispatch(getAllRoomList());
  };

  useEffect(() => {
    getChatroomList();
    // get
  }, []);

  useEffect(() => {
    if (notification?.length > 0) {
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

  // const handleLogout = () => {
  //   // Google logout
  //   if (window.gapi) {
  //     const auth2 = window.gapi.auth2.getAuthInstance();
  //     if (auth2) {
  //       auth2.signOut().then(() => {
  //         auth2.disconnect();
  //       });
  //     }
  //   }

  //   // Clear application state
  //   // dispatch(logout());

  //   // Navigate to login page
  //   navigate('/');
  // };

  const getNotificationsList = (user_id) => {
    try {
      dispatch(
        getNotifications(user_id, (result) => {
          if (result.status) {
          }
        })
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getNotificationsList(userId);
    }
  }, [userId]);

  const getTotalUnreadMessages = async () => {
    const totalUnreadCount =
      (await roomList?.reduce(
        (acc, room) => acc + room.unreadMessageCount,
        0
      )) || 0;
    console.log("Total Unread Message Count:", totalUnreadCount);
    // dispatch({
    //   type: ActionType.TOTAL_UNREADCOUT,
    //   payload: totalUnreadCount
    // });
    setCount(totalUnreadCount);
  };

  useEffect(() => {
    getTotalUnreadMessages();
  }, [roomList]);

  useEffect(() => {
    socket?.on("receiveNotification", (data) => {
      console.log("receiveNotification", data);
    });
  }, [socket]);

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
    navigate("/job-tracker");
  };

  const handleFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };
  return (
    <div className="landingPage employee-main">
      <header className="employee-header">
        <div className="LaningHeader">
          <div className="container">
            <nav className="navbar navbar-expand-xl">
              <div className="d-flex align-items-center align-start nav-width justify-content-between">
                <div className="logo d-flex gap-xl-5 gap-lg-3 width-col align-start ">
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
                      className="language-changer lang-block"
                      value={language}
                      onChange={changeLanguageHandler}
                    >
                      {languageMultiList?.map((o, index) => (
                        <option key={index} value={o?.value}>
                          {o?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="collapse navbar-collapse " id="navbarNav">
                    <div className="gap-xl-5 gap-lg-3 d-flex end-col header-text-row">
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => {
                          navigate("/employee-dashboard");
                        }}
                      >
                        {
                          landingContent?.employeeDashboard?.employeeHeader
                            ?.nav1
                        }
                      </a>
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employee-opportunity")}
                      >
                        {landingContent?.employeeDashboard?.opportunity}
                      </a>
                      {/* <a onClick={() => navigate('/job-search', { state: { type: "" } })}>{landingContent?.employeeDashboard?.employeeHeader?.nav2}</a> */}
                      <a
                        onClick={() => navigate("/messages")}
                        className="message-badge"
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                      >
                        {
                          landingContent?.employeeDashboard?.employeeHeader
                            ?.nav3
                        }{" "}
                        {/*count > 0 && <div className="notification-badge"></div>*/}
                      </a>
                      {/* <a onClick={() => navigate('/saved-opportunities')}>{landingContent?.employeeDashboard?.employeeHeader?.nav4}</a> */}
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse.show"
                        onClick={() => navigate("/employee-calendar")}
                      >
                        {
                          landingContent?.employeeDashboard?.employeeHeader
                            ?.nav5
                        }{" "}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarNav"
              >
                <div className="d-flex gap-3 end-col align-items-center">
                  <button
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    className="btn btn-primary"
                    type="button"
                    onClick={handleFeedbackModal}
                  >
                    {
                      landingContent?.employeeDashboard?.employeeHeader
                        ?.share_button
                    }
                  </button>
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
                  <div className="dropdown-header  notification-header">
                    <button
                      className="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={handleNotification}
                    >
                      <img src={bellIcon} alt="bell" />
                    </button>
                    <ul className="dropdown-menu notification-menu-items">
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
                    </ul>
                    <img
                      src={DropdownIcon}
                      alt="dropdown-icon"
                      className="dropdown-icon-bell"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  </div>

                  <div className="dropdown-header dropdown-notion">
                    <button
                      className="border-0 bg-transparent dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          userDetails?.image == ""
                            ? blankProfile()
                            : userDetails?.image
                        }
                        alt="profile"
                        className="notion-img"
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
                          className="dropdown-item"
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
                          onClick={() => setShowChangePassword(true)}
                        >
                          Change password
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
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleLogout()}
                        >
                          Logout
                        </a>
                      </li>
                      {/* <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                    </ul>
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
                    <a onClick={() => navigate("/employee-dashboard")}>
                      {landingContent?.footerDetails?.mainHeadling2_button1}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/job-search")}>
                      {landingContent?.footerDetails?.mainHeadling2_button2}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/messages")}>
                      {landingContent?.footerDetails?.mainHeadling2_button3}
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/employee-calendar")}>
                      {landingContent?.footerDetails?.mainHeadling2_button4}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="help-describer">
              <button className="border-0 bg-transparent question-mark-icon">
                <img src={questionMarkIcon} alt="icon" />
              </button>
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

      {/* Feedback Modal */}
      <WebsiteFeedback show={showFeedbackModal} onHide={closeFeedbackModal} />
      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showChangePassword}
        onHide={handleCloseChangePassword}
      />
    </div>
  );
};

export default Employeeflowlayout;
