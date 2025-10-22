import React from 'react';
import dotsIcon from "../../assets/images/hire-cards-dots.svg";
import profileIcon from "../../assets/images/Avatar.png";
import dummyImg from "../../assets/images/about-us-image.png";
import fileIcon from "../../assets/images/assignment.svg";
import downloadIcon from "../../assets/images/DownloadSimple.svg";
import downloadImg from "../../assets/images/download.svg";



const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


export default function PreviousHiresCards() {
    return (
        <div>

            <div className="prev-hire-cards">
                <div className="d-flex bet-prev-col align-items-center justify-content-between py-3 ">

                    <div>
                        <h3>Animate Existing Vector Illustration</h3>
                    </div>

                    <div>

                        <button className="btn btn-primary prev-btn-reach">Reach Out Again</button>

                        <button className='border-0 bg-transparent cursor-pointer'><img src={dotsIcon} alt="icon" className='dots-hire-wrapper' /></button>

                    </div>
                </div>


                <div className="d-flex justify-content-between">

                    <div className='d-flex gap-3 '>

                        <div>
                            <img src={profileIcon} alt="icon" className='prev-profile-col' />
                        </div>

                        <div>
                            <h4 className='prev-head-text'>Yuni K.</h4>
                            <span className='prev-para-col'>7:56 AM local time</span>
                        </div>

                    </div>
                    <div>

                        <p class="muted"> <a href="#"
                            data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Request a feedback"
                            className='prev-head-text'>Completed: No feedback given</a>
                        </p>
                        <span className='prev-para-col'>$50.00 Budget</span>
                    </div>
                    <div>
                        <span className='prev-head-text'>Apr 13 - Apr 14</span>
                    </div>

                </div>
            </div>

            {/* <div className="img-chat-col">
                <img src={dummyImg} alt="image" className='img-chat-bot' />
                <button className='border-0 bg-transparent'> <img src={downloadImg} alt="icon" className='downloadimg' />
                </button>
            </div>

            <div className="d-flex justify-content-between file-col-msg align-items-center">
                <div className="d-flex gap-3 flex-1 align-items-center">

                    <div className='img-msg-col'>
                        <img src={fileIcon} alt="icon" />

                    </div>

                    <div>
                        <h4 className='msg-file-text mb-0'>File.pdf </h4>
                        <span className='msg-file-sub-text'>view attached file</span>
                    </div>
                </div>
                <div>

                    <button className='border-0 bg-transparent'> <img src={downloadIcon} alt="icon" /></button>

                </div>

            </div> */}


        </div>

    )
}
