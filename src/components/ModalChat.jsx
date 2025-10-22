import React from 'react';
import fileIcon from "../assets/images/assignment.svg";
import sendIcon from "../assets/images/send-message.svg";
import dummyImg from "../assets/images/about-us-image.png";
import CrossIcon from "../assets/images/cross-icon.svg";
import downloadImg from "../assets/images/download.svg";
import plusIcon from "../assets/images/add-btn-icon.svg";
import { bytesToMB } from '../util/UtilFunction';


export default function ModalChat(props) {
    const { file, setFile, handleSendMessage } = props;
    console.log('file', file)

    const handleModalClose = () => {
        setFile()
    }
    return (
        <div className="modal-chat-send custom-modal-col" >

            <div className="modal-header justify-content-between">
                <h1 className="modal-title-custom ">Upload and attach files</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleModalClose()}></button>
            </div>
            <div className="modal-body py-3 text-center" >

                <div className="file-col-msg">
                    <div className="d-flex justify-content-between ">
                        <div className="d-flex gap-3 flex-1 align-items-center">
                            <div className='img-msg-col'>
                                <img src={fileIcon} alt="icon" />
                            </div>
                            <div className='text-start'>
                                <h4 className='msg-file-text mb-0'>{file?.name} </h4>
                                <span className='msg-file-sub-text'>{bytesToMB(file.size)}</span>
                            </div>
                        </div>
                        <div>
                            {/* <button className='border-0 bg-transparent'> <img src={CrossIcon} alt="icon" className='cross-icon-col' /></button> */}
                        </div>

                    </div>

                    {/* <div>
                        <div className="d-flex gap-2 row-progress align-items-center w-100">
                            <div className="progress flex-1" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" role="progressbar" style={{ "width": "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <span className='text-secondary'>100%</span>
                        </div>
                    </div> */}
                </div>

                {/* <button className='border-0 bg-transparent'><img src={plusIcon} alt="plus-icon" className='add-item-btn' /></button> */}

                <div className="modal-footer mt-4">
                    <button type="button" className=" me-3 border-0 bg-transparent btn-cancel-modal" onClick={() => handleModalClose()} >Cancel</button>
                    <button type="button" className=" border-0 bg-transparent" onClick={() => handleSendMessage()}><img src={sendIcon} alt="icon" /></button>
                </div>
            </div>
        </div>
    );
}
