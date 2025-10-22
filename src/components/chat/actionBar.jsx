import React, { useState, useRef } from 'react';
import EmojiPicker from "emoji-picker-react";
import paperClip from '../../assets/images/paperclip.svg';
import attachment from "../../assets/images/attachment.svg";
import emojiIcon from "../../assets/images/emoji-happy.svg";
import sendIcon from "../../assets/images/send-message.svg";

function ActionBar(props) {
    const { handleSendMessage, message, setMessage, file, setFile } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFile(event.target.files[0])
        // Additional logic to handle file upload can be added here
    };

    const handleFileUpload = () => {
        document.getElementById('fileInput').click();
    };

    const onEmojiClick = (event) => {
        const { emoji } = event;
        const start = message.substring(0, cursorPosition);
        const end = message.substring(cursorPosition);
        const newMessage = start + emoji + end;
        setMessage(newMessage);
        setCursorPosition(cursorPosition + emoji.length);
        setShowEmojiPicker(false);

        // Set the cursor position after the emoji is added
        setTimeout(() => {
            inputRef.current.selectionStart = cursorPosition + emoji.length;
            inputRef.current.selectionEnd = cursorPosition + emoji.length;
            inputRef.current.focus();
        }, 0);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        setCursorPosition(e.target.selectionStart);
    };

    const handleInputClick = (e) => {
        setCursorPosition(e.target.selectionStart);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents default behavior of creating a newline
            handleSendMessage(message, 'text');
        }
    };

    return (
        <div className="d-flex action-bar align-items-center border-1">
            <label className="control-label file_up border-0 bg-transparent" htmlFor="attach">
                <img src={attachment} alt="icon" className='me-2' />
                <input type="file" id="attach" className="optional inputfile" name="attach" onChange={handleFileChange} />
            </label>
            <button className='border-0 bg-transparent me-2' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <img src={emojiIcon} alt="icon" />
            </button>

            {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '50px', left: '50px' }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}

            <input
                type="text"
                className="form-control me-2 border-0"
                value={message}
                placeholder="Type message here"
                onChange={handleInputChange}
                onClick={handleInputClick}
                ref={inputRef}
                onKeyDown={handleKeyDown}
            />

            <button className='border-0 bg-transparent' onClick={() => handleSendMessage(message, 'text')}>
                <img src={sendIcon} alt="icon" />
            </button>
        </div>
    );
}

export default ActionBar;
