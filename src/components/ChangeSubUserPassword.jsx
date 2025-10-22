import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { changeSubUserPassword } from '../redux/actions/common'; // adjust this path
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';


const ChangePasswordModal = ({ show, onHide, subUserId }) => {
    const dispatch = useDispatch();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = () => {
        if (!newPassword || !confirmNewPassword) {
            toast.error('All fields are required.');
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

        const payload = {
            newPassword,
            ...(subUserId ? { subUserId } : {})  // add userId only if exists
        };

        dispatch(changeSubUserPassword(payload, (success) => {
            if (success) {
                onHide();
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
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <div className="mb-3">
          <label>Current Password</label>
          <input
            type="text"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div> */}

                <div className="mb-3 position-relative">
                    <label>New Password</label>
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
                    <label>Confirm New Password</label>
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
