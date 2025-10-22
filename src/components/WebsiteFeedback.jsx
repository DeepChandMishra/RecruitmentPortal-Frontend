import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { submitFeedback } from '../redux/actions/websiteFeedback';
import { useDispatch } from 'react-redux';

const WebsiteFeedback = ({ show, onHide }) => {
  const [feedback, setFeedback] = React.useState('');
  const [error, setError] = React.useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    setError('');
    if (feedback.length < 5) {
      setError('Feedback must be at least 5 characters long.');
      return;
    }

    dispatch(submitFeedback({ feedback }));
    console.log("Feedback submitted");
    setFeedback('');
    onHide();
  }

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  }


  return (
    <Modal show={show} onHide={onHide} animation={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please provide your suggestions about ActiveAge below:</p>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Your feedback..."
          value={feedback}
          onChange={handleFeedbackChange}
        ></textarea>
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit feedback
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WebsiteFeedback;