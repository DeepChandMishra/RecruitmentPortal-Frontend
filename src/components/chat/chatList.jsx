import React, { useEffect, useRef } from "react";
import {
  ListGroup,
  Badge,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "./chatModule.css";
import infoIcon from "../../assets/images/info.svg";
import receiverProfile from "../../assets/images/receiver-profile.svg";
import SenderProfile from "../../assets/images/sender-profile.svg";
import chatHeaderProfile from "../../assets/images/chat-header-profile.svg";
import searchIcon from "../../assets/images/search-icon.svg";
import RatingsComponent from "../../components/starRatings/RatingsComponent.jsx";
import ActionBar from "./actionBar.jsx";
import hamburgerIcon from "../../assets/images/hamburger.svg";
import {
  blankProfile,
  formatDateTime,
  getTimeAgo,
} from "../../util/UtilFunction";
import dummyImg from "../../assets/images/about-us-image.png";
import fileIcon from "../../assets/images/assignment.svg";
import downloadIcon from "../../assets/images/DownloadSimple.svg";
import downloadImg from "../../assets/images/download.svg";
import noPhotoImg from "../../assets/images/nophoto.jpg";
import ModalChat from "../../components/ModalChat";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ChatList(props) {
  const {
    messages,
    roomDetails,
    userId,
    handleSendMessage,
    message,
    setMessage,
    receiverData,
    file,
    setFile,
    handleDownloadFile,
    landingContent,
  } = props;
  const { userDetails } = useSelector((state) => state.user);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [roomDetails]);

  const handleImageClick = () => {
    if (userDetails.role === "employer") {
      navigate(`/profile-user/${receiverData?._id}`);
    } else if (userDetails.role === "employee") {
      navigate(`/profile-user-employee/${receiverData?._id}`);
    }
  };

  const handleScheduleEvent = () => {
    if (receiverData) {
      navigate("/employer-calendar", {
        state: {
          selectedMember: {
            id: receiverData?._id,
          },
        },
      });
    }
  };
  console.log("id", receiverData?._id);

  console.log('roomDetailsroomDetails', receiverData)
  return (
    <>
      <div className="main-chat-wrapper position-relative">
        <div className="d-flex justify-content-between align-items-center border-bottom p-2 chat-header">
          <div className="d-flex gap-3 align-items-center w-100">
            <a
              class="border-0 bg-transparent d-block d-md-none"
              data-bs-toggle="offcanvas"
              href="#offcanvasChat"
              role="button"
              aria-controls="offcanvasExample"
            >
              <img src={hamburgerIcon} alt="hamburger" />
            </a>
            {receiverData !== null && (
              <>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <div className="img-col">
                      <img
                        src={
                          receiverData?.image
                            ? receiverData?.image
                            : blankProfile()
                        }
                        alt="profile-icon"
                        style={{ cursor: "pointer" }}
                        onClick={handleImageClick}
                      />
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0 heading-col">{`${receiverData?.firstname} ${receiverData?.lastname}`}</h5>
                      <p className="text-muted user-status mb-0">
                        {receiverData?.onlineStatus == false
                          ? getTimeAgo(receiverData?.lastLogin)
                          : "Active"}
                      </p>
                    </div>
                  </div>
                  {userDetails.role == "employer" && (
                    <button
                      onClick={handleScheduleEvent}
                      className="py-2 px-3 sch_btn"
                    >
                      Schedule Event{" "}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            {/**
             * RIGHT SIDEBAR CHAT
             */}

            <div
              class="offcanvas offcanvas-end"
              tabindex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div class="offcanvas-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body">
                <div className="profile-row d-flex gap-2 align-items-center border-b">
                  <div>
                    <img
                      src={chatHeaderProfile}
                      alt="profile-icon"
                      className="user-profile-col"
                    />
                  </div>
                  <div>
                    <h5 className="heading-col">{`${receiverData?.firstname} ${receiverData?.lastname}`}</h5>
                    <button className="border-0 rounded-2 p-2">Designer</button>
                    <div>
                      <span className="time-span">12/09/23 - 09:41 AM</span>
                    </div>
                  </div>
                </div>
                <div className="border-b">
                  <InputGroup className=" input-search">
                    <input
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />
                    <img src={searchIcon} alt="search-icon" />
                  </InputGroup>
                </div>
                <div className="d-flex justify-content-between border-b">
                  <div>
                    <h4 className="heading-col mb-0 ">
                      {landingContent?.message?.ratingLabel}
                    </h4>
                  </div>
                  <div>
                    <RatingsComponent />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 border-b">
                  <div>
                    <h4 className="heading-col mb-0">
                      {landingContent?.message?.notesLabel}
                    </h4>
                  </div>
                  <div>{/* <img src={infoIcon} alt="info" /> */}</div>
                </div>
                <div>
                  <textarea
                    id="w3review"
                    name="w3review"
                    rows="4"
                    cols="39"
                    placeholder={landingContent?.message?.notesPlaceholder}
                  ></textarea>
                </div>
              </div>
            </div>
            {/* {receiverData !== null && <button className='border-0 bg-transparent' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><img src={infoIcon} alt="info-icon" /></button>} */}
          </div>

          {/**
           * RIGHT SIDEBAR CHAT
           */}
        </div>
        <div className="chat-window px-2 " ref={chatContainerRef}>
          {receiverData == null && (
            <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "100%", textAlign: "center" }}>
              {landingContent?.message?.noListMessage}
            </div>
          )}
          {(roomDetails && receiverData) &&
            roomDetails?.map((msg, index) => (
              <div className="row chat-wrapper px-2" key={index}>
                {msg.senderId !== userId ? (
                  <div>
                    <div className="receiver-row">
                      <div className="img-col">
                        <img
                          src={
                            receiverData?.image
                              ? receiverData?.image
                              : blankProfile()
                          }
                          alt="receiver"
                          style={{ cursor: "pointer" }}
                          onClick={handleImageClick}
                        />
                      </div>
                      <div
                        className={`message-wrapper ${msg.type == "file" && "transparent-background"
                          }`}
                      >
                        {/* Message */}
                        {msg.type == "text" && (
                          <p className="mb-0">{msg.message}</p>
                        )}
                        {/* File */}
                        {msg.type == "file" && (
                          <div
                            className="d-flex justify-content-between file-col-msg align-items-center"
                            onClick={() =>
                              handleDownloadFile(
                                msg.uploadedFile.url,
                                msg.uploadedFile.fileName
                              )
                            }
                          >
                            <div className="d-flex gap-3 flex-1 align-items-center">
                              <div className="img-msg-col">
                                <img src={fileIcon} alt="icon" />
                              </div>
                              <div>
                                <h4 className="msg-file-text mb-0">
                                  {" "}
                                  {msg.uploadedFile.fileName}
                                </h4>
                                <span className="msg-file-sub-text">
                                  view attached file
                                </span>
                              </div>
                            </div>
                            <div>
                              <button className="border-0 bg-transparent">
                                {" "}
                                <img src={downloadIcon} alt="icon" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="time-span receiver">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-end justify-content-end">
                    <div className="sender-row">
                      <div
                        className={`message-wrapper ${msg.type == "file" && "transparent-background"
                          }`}
                      >
                        {/* message */}
                        {msg.type == "text" && (
                          <p className="mb-0">{msg.message}</p>
                        )}
                        {console.log("dsf", msg)}
                        {/* Image
                                            {(msg.type == 'file' && msg.uploadedFile.fileType == "image/png") && <div className="img-chat-col">
                                                <img src={dummyImg} alt="image" className='img-chat-bot' />
                                                <button className='border-0 bg-transparent'> <img src={msg.uploadedFile.url} alt="icon" className='downloadimg' />
                                                </button>
                                            </div>} */}

                        {/* file */}
                        {msg.type == "file" && (
                          <div
                            className="d-flex justify-content-between file-col-msg align-items-center"
                            onClick={() =>
                              handleDownloadFile(
                                msg.uploadedFile.url,
                                msg.uploadedFile.fileName
                              )
                            }
                          >
                            <div className="d-flex gap-3 flex-1 align-items-center">
                              <div className="img-msg-col">
                                <img src={fileIcon} alt="icon" />
                              </div>
                              <div>
                                <h4 className="msg-file-text mb-0">
                                  {msg.uploadedFile.fileName}
                                </h4>
                                <span className="msg-file-sub-text">
                                  view attached file
                                </span>
                              </div>
                            </div>
                            <div>
                              <button className="border-0 bg-transparent">
                                {" "}
                                <img src={downloadIcon} alt="icon" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="img-col">
                        <img
                          src={
                            userDetails?.image
                              ? userDetails?.image
                              : blankProfile()
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <span className="time-span sender">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {file && (
          <ModalChat
            file={file}
            setFile={setFile}
            handleSendMessage={handleSendMessage}
          />
        )}

        {receiverData !== null && !file && (
          <div className="bottom-bar">
            <ActionBar
              handleSendMessage={handleSendMessage}
              message={message}
              setMessage={setMessage}
              file={file}
              setFile={setFile}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ChatList;
