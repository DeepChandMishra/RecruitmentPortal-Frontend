import React, { useEffect, useState } from "react";
import DropdownIcon from "../../../assets/images/arrow-dropdown.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { professionalPlanSchema } from "../../../util/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  checkout,
  getPlan,
  getPlanDetails,
  getSubscriptionListing,
} from "../../../redux/actions/stripe";
import { ActionType } from "../../../redux/action-types";
import logo from "../../../assets/images/logo.svg";
import { useTranslation } from "react-i18next";
import CompanyTab from "../../../components/tabs/CompanyTab";
import { toast } from "react-toastify";
// Validation schema for the form

const ProfessionalPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [planType, setPlanType] = useState("year");
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("year");
  const [selectedBuyPlan, setSelectedBuyPlan] = useState();
  //Redux State
  const { userDetails } = useSelector((state) => state.user);
  const { employerDetails } = useSelector((state) => state.user);
  const { planList } = useSelector((state) => state.stripe);

  const userId = localStorage.getItem("userId");
  console.log('selectedBuyPlan', selectedBuyPlan)

  const { t, i18n } = useTranslation();
  let lang = i18n.language;

  const landingContent = t("landingPage");
  console.log("🚀 ~ Login ~ landingContent:", landingContent);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //UseForm Define.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(professionalPlanSchema),
    mode: "onChange",
  });

  //Get Employer Plan List.
  useEffect(() => {
    dispatch(getPlan("employer", (result) => { }));
  }, []);

  useEffect(() => {
    if (employerDetails) {
      setValue("professionalPlan", employerDetails?.plan_id);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    getPlanDetail(value);
    setValue(name, value, { shouldValidate: true });
  };

  const getSubcriptionsPlan = () => {
    try {
      setLoader(true);
      let param = {
        sortBy: -1,
        limit: 50,
        page: 1,
        status: true,
        plan: planType,
        role: "employer",
        language: lang,
      };
      dispatch(
        getSubscriptionListing(param, (result) => {
          console.log("result", result);
          if (result.status) {
            setLoader(false);
          }
        })
      );
    } catch (error) {
      console.log("Error:", error);
    } finally {
      // setLoader(false)
    }
  };

  useEffect(() => {
    getSubcriptionsPlan();
  }, [planType, lang]);




  const onSubmit = (data) => {
    let business_details = {
      ...employerDetails,
      plan_id: selectedBuyPlan?.id,
    };
    dispatch({
      type: ActionType.EMPLOYER_DETAILS,
      payload: business_details,
    });
    if (!selectedBuyPlan) {
      return toast.error("Please select plan to proceed.")
    }
    const _data = {
      userId: userId,
      planId: selectedBuyPlan?.id,
    };

    dispatch(
      checkout(_data, (result) => {
        window.open(result?.data?.url);
      })
    );
  };

  //Get plan Details
  const getPlanDetail = (_id) => {
    dispatch(
      getPlanDetails(_id, (result) => {
        if (result.status) {
          setSelectedPlan(result.data);
        }
      })
    );
  };

  return (
    <>
      <div>
        <div class="logo-block text-center mb-5">
          <a class="homepage-navigation" href="/">
            <h5 class="back-to-homepage">
              {landingContent?.signup?.back_buttonn}
            </h5>
            <img src={logo} alt="logo" />
          </a>
        </div>

        <div className="cardcontrols">
          <div className="cards">
            <div className="titlecards">
              {landingContent?.signup?.organization_title}
            </div>
            <div className="formdesign">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formControls">
                  <label className="customeLabel">
                    {landingContent?.signup?.plan_desc}
                  </label>
                  <div className="pt-2">
                    <small className="text-secondary">
                      {landingContent?.signup?.plan_note}
                    </small>
                  </div>
                  {/* <div className="dropdown mt-3">
                                        <select
                                            className="form-select authfields"
                                            {...register('professionalPlan')}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Your Professional Plan</option>
                                            {
                                                planList && planList.map((o, i) => (
                                                    <option value={o?._id} key={i}>{o.title}</option>
                                                ))
                                            }

                                        </select>
                                        {errors.professionalPlan && <div className="errorMsg">{errors.professionalPlan.message}</div>}
                                        <img src={DropdownIcon} alt="dropdown-icon" className='dropdown-icon' />
                                    </div> */}

                  {selectedBuyPlan && <div class="plan-card">
                    <div class="plan-header">
                      <h3 class="plan-title">{selectedBuyPlan?.title}</h3>
                      <span class="plan-badge">Selected</span>
                    </div>
                    <div class="plan-price">
                      {selectedBuyPlan.currency != 'eur' ? <span class="currency">$</span> : <span class="currency">€</span>}
                      <span class="amount">{selectedBuyPlan?.amount}</span> <span class="currency">/{selectedBuyPlan?.planType}</span>
                    </div>
                  </div>}

                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sign-in sign_btn  w-100 mt-4"
                    data-bs-toggle="modal"
                    data-bs-target="#viewplanModal"
                  >
                    View plans
                  </button>

                  <div className="text-end pt-2 pb-5">
                    {selectedPlan && (
                      <a
                        type="button"
                        className="link-col"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        {landingContent?.signup?.viewPlanDetails}
                      </a>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <div className="formControls mt-5">
                    <button
                      className="btn border-0 bg-transparent btn-back w-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {landingContent?.signup?.backButtonLabel}
                    </button>
                  </div>
                  <div className="formControls mt-5">
                    <button className="btn btn-primary w-100" type="submit">
                      {landingContent?.signup?.next_button}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Price Modal  */}
      <div
        className="modal modal-plans-tabs fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Subscription Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="cards-tab">
                <div className="title-card">
                  <h3>{selectedPlan?.title}</h3>
                  <h4>{`$${selectedPlan?.amount}`}</h4>
                  <span>{`per organization/${selectedPlan?.planType}`}</span>{" "}
                  <span className="discount-col">{`+ ${selectedPlan?.trial_period_days} days free`}</span>
                </div>
                <div className="body-card">
                  <h5>More details</h5>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: selectedPlan?.description,
                    }}
                  ></p>

                  <div className="text-center">
                    <button className="get-started" data-bs-dismiss="modal">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* View plan Modal  */}
      <div
        className="modal modal-plans-tabs fade"
        id="viewplanModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl subscription-tabs">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Subscriptions
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CompanyTab
                setPlanType={setPlanType}
                loader={loader}
                setSelectedBuyPlan={setSelectedBuyPlan}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalPlan;
