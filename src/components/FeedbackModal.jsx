import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { submitFeedback } from '../redux/actions/feedback';

const FeedbackModal = ({ show, onHide, host, members }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {

    setError('');


    if (rating === 0) {
      setError('Rating is required.');
      return;
    }

    if (feedback.length < 5) {
      setError('Feedback must be at least 5 characters long.');
      return;
    }

    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    console.log('Member ID:', members);

    const body = {
      host: host,
      rating,
      feedback,
      id: members,
    };

    try {
      dispatch(submitFeedback(body));
      // Reset the form
      setRating(0);
      setFeedback('');
      onHide();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} animation={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please provide your feedback below:</p>

        {/* Feedback Textarea */}
        <textarea
          className="form-control"
          rows="4"
          placeholder="Your feedback..."
          value={feedback}
          onChange={handleFeedbackChange}
        ></textarea>

        {/* Error Message */}
        {error && <div className="text-danger mt-2">{error}</div>}

        {/* Rating Section */}
        <div className="mt-3">
          <label className="form-label">Rating:</label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  value={star}
                  checked={rating === star}
                  onChange={handleRatingChange}
                  style={{ display: 'none' }} // Hide the radio button
                />
                <span
                  style={{
                    fontSize: '24px',
                    color: star <= rating ? '#FFD700' : '#ccc', // Gold for selected, gray for unselected
                  }}
                >
                  ★
                </span>
              </label>
            ))}
          </div>
        </div>

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

export default FeedbackModal;