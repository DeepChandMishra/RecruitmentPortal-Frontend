import React from 'react';
import ProfileHireUser from '../../assets/images/profile-hire-user.png';
import LikeIcon from "../../assets/images/HeartStraight.svg";
import dotsIcon from "../../assets/images/DotsThree.svg";
import fillLike from '../../assets/images/fillheart.png'
import { useNavigate } from 'react-router-dom';
import { blankProfile } from '../../util/UtilFunction';

export default function EmployerHiresCards({ data, saveTalentEmployee }) {

    const navigate = useNavigate()
    console.log({ data })
    return (
        <div>

            <div>
                <div className="d-flex gap-3 employer-hire-cards border-wrapper">
                    <div className="img-col-hire-cards  position-relative user-profile-active">
                        <img src={data?.ApplicantData?.image ? data?.ApplicantData?.image : blankProfile()} alt="profile-user" className='hire-user-profile' />
                        <span className='active-status'></span>

                    </div>

                    <div className="hire-inner-wrapper">

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className='name-column'>{data?.ApplicantData?.firstname + data?.ApplicantData?.lastname}</h3>
                                <div className='d-flex gap-2 list-hired-col flex-wrap'>
                                    <li>{data?.ApplicantData?.title}</li>
                                </div>
                                <h4 className='location-column'>{data?.ApplicantData?.address?.city}</h4>
                            </div>
                            <div className='positon-img-col d-flex'>

                                <img src={data?.isSaved ? fillLike : LikeIcon} alt="icon" className='wishlist-icon me-2' onClick={() => saveTalentEmployee(data?.ApplicantData?._id)} style={{ cursor: 'pointer' }} width={40} height={40} />
                                {/* <img src={dotsIcon} alt="dots-icon" /> */}

                            </div>
                        </div>
                        <p className='hire-para-details py-2' dangerouslySetInnerHTML={{ __html: data?.ApplicantData?.description }}></p>
                        {/* <p className='hire-para-details py-2'>{data?.ApplicantData?.description}</p> */}

                        <div className='border-wrapper'>
                            <button className='border-0 bg-transparent btn-view-more' type='button' onClick={() => navigate(`/profile-user/${data?.ApplicantData?._id}`)}>View more</button>

                        </div>

                        {/* <div>

                            <h3 className='text-col pt-3'>Contracts</h3>

                            <div className="contracts-wrapper">

                                <div className="d-flex gap-2 border-bottom-contacts">
                                    <h4>XRAY Tech</h4>
                                    <h5>Hourly</h5>
                                    <h5>Ended</h5>
                                </div>

                                <div className="d-flex pt-2  gap-2 ">
                                    <h4>MRI Tech</h4>
                                    <h5>Hourly</h5>
                                    <h5>Ended</h5>
                                </div>


                            </div>

                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    )
}
