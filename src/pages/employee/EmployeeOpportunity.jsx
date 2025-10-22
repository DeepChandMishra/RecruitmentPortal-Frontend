import React from "react";
// import OppModal from "../../components/OppModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EmployeeOpportunity = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')

  return (
    <>

      <div class="job-main-col mb-5">
        <div class="container">
          {/* <h2 class="main-heading-col">
            Opportunity 
          </h2> */}

          <div class="pt-2 pt-sm-5 text-center">
            <button class="btn btn-primary btn-main w-50" type="button"
              onClick={() => navigate('/job-search')}>
              {landingContent?.employeeDashboard?.employeeHeader?.nav2}            </button>
          </div>
          <div class="d-flex py-3  pt-sm-5 btn-dashboard-main justify-content-between btn-col">
            <div class="col-sm-6 col-12">
              <button class="btn btn-primary btn-main" type="button"
                onClick={() => navigate('/saved-opportunities')}>
                {landingContent?.employeeDashboard?.employeeHeader?.nav4}              </button>
            </div>
            <div class="col-sm-6 col-12">
              <button class="btn btn-primary btn-main" type="button"
                onClick={() => navigate('/job-tracker')}>
                {landingContent?.employeeDashboard?.applicationButton}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <OppModal/> */}
    </>
  );
};

export default EmployeeOpportunity;
