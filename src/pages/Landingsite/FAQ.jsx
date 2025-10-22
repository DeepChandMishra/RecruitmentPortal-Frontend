import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { pageContent } from '../../redux/actions/cms';
import { formatFaqArray, getContentByHeading } from '../../util/UtilFunction';
import "./landingComponent.css";
import { useTranslation } from "react-i18next";
import faqImg from "../../assets/images/smilegirl.png";
import Loading from '../../components/loader';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [faqPageContent, setFaqPageContent] = useState(null);
    const [informationPageContent, setInformationPageContent] = useState(null);
    const [faqContent, setFaqContent] = useState(null);
    const [loader, setLoader] = useState(true);
    const { i18n } = useTranslation();
    let lang = i18n.language;

    useEffect(() => {
        setLoader(true);
        dispatch(pageContent("FAQ", (response) => {
            if (response?.statusCode === 200 && response?.data?.content?.length) {
                setFaqPageContent(response?.data?.content);
                setFaqContent(formatFaqArray(response?.data?.content, lang));
            }
            setLoader(false);
        }));

    }, [lang]);


    console.log('faqContent', faqContent)

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    // Helper to find content in both
    const getContent = (heading) => {
        return getContentByHeading(faqPageContent, heading, lang);
    };

    return (
        <>
            {loader ? (
                <Loading />
            ) : (
                <>
                    <section className="faq">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div>
                                        <h2
                                            dangerouslySetInnerHTML={{
                                                __html: getContent("FAQ Heading"),
                                            }}
                                        ></h2>
                                        <p
                                            className="marginTop"
                                            dangerouslySetInnerHTML={{
                                                __html: getContent("FAQ text"),
                                            }}
                                        ></p>

                                        {/* <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => navigate("/faq")}
                                        >
                                            Go To FAQ
                                        </button> */}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="smile_girl">
                                        <img
                                            src={faqImg}
                                            style={{
                                                borderTopLeftRadius: "15px",
                                                borderTopRightRadius: "15px",
                                                borderBottomLeftRadius: "15px",
                                                borderBottomRightRadius: "15px",
                                            }}

                                            alt="FAQ Illustration"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="faq-section">
                        <div className="container">
                            <div className="row">
                                <h2 className='heading-col' dangerouslySetInnerHTML={{ __html: faqContent?.content }} />
                            </div>

                            <div>
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    {faqContent?.faqs?.length > 0 &&
                                        faqContent.faqs.map((item, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header">
                                                    <button
                                                        className="accordion-button collapsed"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#flush-collapse${index}`}
                                                        aria-expanded="false"
                                                        aria-controls={`flush-collapse${index}`}
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: item?.question }} />
                                                    </button>
                                                </h2>
                                                <div
                                                    id={`flush-collapse${index}`}
                                                    className="accordion-collapse collapse"
                                                    data-bs-parent="#accordionFlushExample"
                                                >
                                                    <div
                                                        className="accordion-body"
                                                        dangerouslySetInnerHTML={{ __html: item?.answer }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </section>

                </>
            )}
        </>
    );
}
