import React from 'react';
import "./tabStyle.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loader';


// Subscription Slider


var yearlySlider = {
    dots: true,
    infinite: false,  // Set to false if you want the slider to stop at the last slide
    speed: 500,
    slidesToShow: 4,  // Default number of slides to show
    slidesToScroll: 1,  // Scroll one slide at a time
    initialSlide: 0,  // Start from the first slide
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,  // Show 3 slides for larger screens
                slidesToScroll: 1,  // Scroll one slide at a time
                infinite: true,  // Keep infinite scrolling on larger screens
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,  // Show 2 slides on medium screens
                slidesToScroll: 1  // Scroll one slide at a time
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,  // Show 1 slide on smaller screens
                slidesToScroll: 1  // Scroll one slide at a time
            }
        }
    ]
}

var monthlySlider = {
    dots: true,
    infinite: false,  // Set to false if you want the slider to stop at the last slide
    speed: 500,
    slidesToShow: 4,  // Default number of slides to show
    slidesToScroll: 1,  // Scroll one slide at a time
    initialSlide: 0,  // Start from the first slide
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,  // Show 3 slides for larger screens
                slidesToScroll: 1,  // Scroll one slide at a time
                infinite: true,  // Keep infinite scrolling on larger screens
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,  // Show 2 slides on medium screens
                slidesToScroll: 1  // Scroll one slide at a time
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,  // Show 1 slide on smaller screens
                slidesToScroll: 1  // Scroll one slide at a time
            }
        }
    ]
}


export default function CandidateTab(props) {
    const { setPlanType, loader } = props;

    const navigate = useNavigate()
    //Redux State
    const { subscriptionList } = useSelector((state) => state.stripe);
    console.log("🚀 ~ CandidateTab ~ subscriptionList:", subscriptionList)

    return (
        <div className='pt-5'>
            <div className="text-center">
                <ul class="nav nav-tabs tabs-custom d-inline-flex justify-content-center" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#monthly-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={() => setPlanType('year')}>Yearly</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#yearly-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={() => setPlanType('month')} >Monthly</button>
                    </li>

                </ul>
            </div>

            <div class="tab-content py-5" id="myTabContent">
                <div class="tab-pane fade show active" id="monthly-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">

                    <div className="slider-container">
                        {loader ? <Loading /> :
                            <Slider {...yearlySlider} className='subsciption-slider'>

                                {subscriptionList?.map((o) => (
                                    <div className="cards-tab">
                                        <div className="title-card">
                                            <h3>{o.title}</h3>


                                            <h4 className='d-inline'>{`$${o.amount}`}</h4> <span className='discount-col'>{`+ ${o.trial_period_days} days free`}</span>


                                            <div>
                                                <span className='mt-2'>billed annually</span>

                                            </div>
                                        </div>

                                        <div className="body-card">
                                            <ul> <h5>For Trail</h5>
                                                <li>Real-time contact syncing</li>
                                                <li>Automatic data enrichment</li>
                                                <li>Up to 3 seats</li>
                                                <li>Up to 3 seats</li>


                                                <div className='text-center'>
                                                    <button className='get-started' type='button' onClick={() => navigate('/login')}>Get Started</button>
                                                </div>
                                            </ul>
                                        </div>
                                    </div>
                                ))}


                            </Slider>}
                    </div>


                </div>
                <div class="tab-pane fade" id="yearly-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">

                    <div className="slider-container">
                        <Slider {...monthlySlider} className='subsciption-slider'>
                            {subscriptionList?.map((o) => (
                                <div className="cards-tab">
                                    <div className="title-card">
                                        <h3>{o.title}</h3>


                                        <h4 className='d-inline'>{`$${o.amount}`}</h4> <span className='discount-col'>{`+ ${o.trial_period_days} days free`}</span>


                                        <div>
                                            <span className='mt-2'>billed annually</span>

                                        </div>
                                    </div>

                                    <div className="body-card">
                                        <ul> <h5>For Trail</h5>
                                            <li>Real-time contact syncing</li>
                                            <li>Automatic data enrichment</li>
                                            <li>Up to 3 seats</li>
                                            <li>Up to 3 seats</li>


                                            <div className='text-center'>
                                                <button className='get-started' type='button' onClick={() => navigate('/login')}>Get Started</button>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            ))}

                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}
