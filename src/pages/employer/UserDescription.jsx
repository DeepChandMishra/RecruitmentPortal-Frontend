import React, { useState, useEffect } from "react";
import UserIMG from "../../assets/images/userone.png";
import EsterIMG from "../../assets/images/ester.png";
import Loading from "../../components/loader";
import DeleteImg from "../../assets/images/delete.png";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSubUserRole,
  changeSubUserStatus,
  deleteSubUser,
  getSubUsersDetails,
} from "../../redux/actions/employer";
import ChangePasswordModal from "../../components/ChangeSubUserPassword";
import AddEmailModal from "../../components/AddEmailModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const UserDescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const emails = userDetails?.userEmails || [];
  const userId = userDetails?._id || null;
  console.log("userId", userId);

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  const [subUsers, setSubUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const getSubUsersDetail = async () => {
    setIsLoading(true);
    await dispatch(
      getSubUsersDetails({ emails }, (result) => {
        if (result?.status) {
          setSubUsers(result.data);
        }
        setIsLoading(false);
      })
    );
  };

  useEffect(() => {
    if (emails.length) {
      getSubUsersDetail();
    }
  }, [emails]);

  useEffect(() => {
    handleToggleStatus();
  }, []);

  // New handler to toggle status on checkbox change
  const handleToggleStatus = async (userId) => {
    setIsLoading(true);
    try {
      await dispatch(changeSubUserStatus(userId, (result) => { }));
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      getSubUsersDetail();
    }
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };
  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };
  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === "subUser" ? "subUserEmployer" : "subUser";
    dispatch(
      changeSubUserRole(userId, newRole, (result) => {
        if (result?.status) {
          getSubUsersDetail();
        }
      })
    );
  };

  const handleDelete = (userId) => {
    setIsLoading(true);
    dispatch(
      deleteSubUser(userId, (result) => {
        if (result?.status) {
          getSubUsersDetail();
        }
        setIsLoading(false);
      })
    );
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="py-5 user_description">
          <div className="container">
            <div className="job-dec-candidate-wrapper user_des_inner">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex flex-wrap w-100 justify-content-between align-items-center mb -2">
                  <h2 className="section-heading-employer">{landingContent?.profile?.user_listing_label}</h2>
                  <button
                    className="rounded bg-secondary px-2 py-1 mt-2 mt-md-0 list_back "
                    onClick={() =>
                      navigate(`/employer-job-candidate/${userId}`)
                    }
                  >
                    {landingContent?.profile?.back_button_label} ←
                  </button>
                </div>

                {subUsers.length < 5 && (
                  <button
                    type="button"
                    style={{ width: 'auto', whiteSpace: 'nowrap' }}
                    onClick={() => setShowAddUser(true)}
                    className="btn btn-primary border-0"
                  >
                    {landingContent?.profile?.add_button_label} +
                  </button>
                )}
              </div>

              {subUsers.length === 0 && <p>No users found.</p>}

              {subUsers.map((user) => (
                <div key={user._id} className="job-dec-candidate-wrapper mb-3">
                  <div className="d-flex align-items-center flex-column flex-md-row justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="user_img">
                        <img
                          src={user.role === "subUser" ? EsterIMG : UserIMG}
                          alt="userimg"
                        />
                      </div>
                      <div className="ms-3">
                        <h4>{user.email}</h4>
                        <span>
                          {user.role === "subUser" ? "Sub User" : "Admin"}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mt-4">
                      <button
                        className="btn mx-0 btn-outline me-2"
                        type="button"
                        onClick={() => {
                          handleRoleChange(user._id, user.role);
                        }}
                      >
                        {user.role === "subUser"
                          ? "Make Admin"
                          : "Make Sub User"}
                      </button>
                      <button
                        className="btn mx-0 btn-outline me-2 "
                        type="button"
                        onClick={() => {
                          setSelectedUserId(user._id);
                          setShowChangePassword(true);
                        }}
                      >
                        Change Password
                      </button>
                      <div className="d-flex align-items-center">
                        <div className="form-check form-switch">
                          <label
                            className="form-check-label"
                            htmlFor={`flexSwitchCheck-${user._id}`}
                          >
                            {user.status ? "Active" : "Inactive"}
                          </label>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexSwitchCheck-${user._id}`}
                            checked={!user.status}
                            onChange={() =>
                              handleToggleStatus(user._id, user.status)
                            }
                          />
                        </div>
                        <button
                          className="btn mx-0 btn-outline delete_icon"
                          type="button"
                          onClick={() => {
                            handleDelete(user._id);
                          }}
                        >
                          <img src={DeleteImg} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ChangePasswordModal
        show={showChangePassword}
        onHide={handleCloseChangePassword}
        subUserId={selectedUserId}
      />

      <AddEmailModal
        show={showAddUser}
        onHide={handleCloseAddUser}
        userId={userId}
        existingEmails={emails}
      />
    </>
  );
};

export default UserDescription;
