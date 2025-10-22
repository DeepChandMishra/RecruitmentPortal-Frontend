import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { changePassword } from '../redux/actions/common'; // adjust this path
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';


const ChangePasswordModal = ({ show, onHide }) => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('All fields are required.');
      return;
    }

    if(currentPassword === newPassword) {
      toast.error('New password cannot be the same as current password.');
      return;
    }
  
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm new password do not match.');
      return;
    }
  
    dispatch(changePassword({ currentPassword, newPassword }, (success) => {
        if (success) {
          onHide(); 
          setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
        }
      }));
  };

  const closeButtonHandler = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    onHide();
  }
  

  return (
    <Modal show={show} onHide={closeButtonHandler} animation={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 position-relative">
          <label>Current password</label>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 pe-4"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>

        <div className="mb-3 position-relative">
          <label>New password</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 pe-4"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>

        <div className="mb-3 position-relative">
          <label>Confirm new password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="form-control"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <span
            className="position-absolute top-50 end-0 pe-4"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>

        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeButtonHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Change Password
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
