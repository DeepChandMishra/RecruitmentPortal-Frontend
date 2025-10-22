import React, { useState } from 'react';

const EventModal = ({ isOpen, onClose, onSubmit }) => {
    const [time, setTime] = useState('');
    const [members, setMembers] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        // Validate fields are not empty
        if (!time || !members || !meetLink || !notes) {
            setError('All fields are mandatory');
            return;
        }

        // If all fields are filled, submit the form
        onSubmit({ time, members, meetLink, notes });

        // Reset form fields and close modal
        setTime('');
        setMembers('');
        setMeetLink('');
        setNotes('');
        setError('');
        onClose();
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Details</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label>Add Time</label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Add Members</label>
                    <input
                        type="text"
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Add Meet Link</label>
                    <input
                        type="text"
                        value={meetLink}
                        onChange={(e) => setMeetLink(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Add Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
