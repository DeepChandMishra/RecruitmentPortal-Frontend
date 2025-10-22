import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addSubUserEmail } from '../redux/actions/employer';

const AddEmailModal = ({ show, onHide, userId,existingEmails }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!email) {
      toast.error('Email is required.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (existingEmails.some(e => e.toLowerCase() === email.toLowerCase())) {
        toast.error('Email already exists.');
        return;
      }

    const payload = {
        userEmails: [email], 
      };
      
      dispatch(addSubUserEmail(userId, payload, (success) => {
        if (success) {
          setEmail('');
          onHide();
        }
      }));
      
  };

  const handleClose = () => {
    setEmail('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className='mb-2'>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmailModal;
