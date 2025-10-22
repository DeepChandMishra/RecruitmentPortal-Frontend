import React, { useEffect, useState } from "react";
import appliedIcon from "../../assets/images/applied.svg";
import shorlistIcon from "../../assets/images/shortlisted.svg";
import selectIcon from "../../assets/images/hired.svg";
import DropdownIcon from "../../assets/images/arrow-dropdown.svg";
import NotionIcon from "../../assets/images/notion.png";
import locationIcon from "../../assets/images/location.svg";
import clockIcon from "../../assets/images/Clock.svg";
import euroIcon from "../../assets/images/euro.svg";
import sellIcon from "../../assets/images/sell.svg";
import avatarIcon from "../../assets/images/Avatar.png";
import editIcon from "../../assets/images/edit-icon.svg";
import JobImg from "../../assets/images/ui.png";
import JobImg2 from "../../assets/images/ui-2.png";
import jobImg3 from "../../assets/images/ui-3.png";
import emojiIcon from "../../assets/images/Emoji.svg";
import { jobTypesListing, skillsListing } from "../../redux/actions/common";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplicantByEmployerId,
  listingByJobs,
  saveTalentEmployee,
} from "../../redux/actions/employer";
import EmployerApplicantCards from "../../components/cards/EmployerApplicantCards";
import Loading from "../../components/loader";
import { useTranslation } from "react-i18next";
import Select from "react-select";

export default function OpportunitiesTracker() {
  const [opportunityType, setOpportunityType] = useState(null);
  const [jobsType, setJobsType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillType, setSkillType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("applied");
  const [sort, setSort] = useState(-1);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");
  console.log("landingContent", landingContent);

  const { jobType, skills } = useSelector((state) => state.common);
  const { userDetails } = useSelector((state) => state.user);
  const { applicantList, jobNameList } = useSelector((state) => state.employer);
  const userId = localStorage.getItem("userId");

  console.log("jobNameList==========================>", jobNameList);
  const getJobType = () => {
    dispatch(jobTypesListing((result) => {}));
  };

  const getSkills = () => {
    dispatch(skillsListing((result) => {}));
  };

  const getJobList = () => {
    dispatch(listingByJobs(userDetails?._id, (result) => {}));
  };

  console.log("skillType", skillType);

  const getApplicantList = (type) => {
    setLoader(true);
    let param = {
      order_by: "",
      order: 1,
      sortBy: parseInt(sort),
      page_size: 10,
      page: currentPage,
      status: status,
    };
    if (type !== "clear") {
      if (skillType)
        param.skills = skillType?.map((o) => {
          return o.value;
        });
      if (opportunityType) param.opportunityType = [opportunityType];
      if (jobsType) param.appliedJob = jobsType;
    }
    dispatch(
      getApplicantByEmployerId(param, userId, (result) => {
        setLoader(false);
      })
    );
  };

  useEffect(() => {
    getJobList();
    getJobType();
    getSkills();
  }, []);

  useEffect(() => {
    getApplicantList();
  }, [status]);

  const handleTypeofOpportunity = (e) => {
    setOpportunityType(e.target.value);
  };

  const handleTypeofjobs = (e) => {
    setJobsType(e.target.value);
  };

  const handleStatus = (data) => {
    setStatus(data);
  };

  const handleTypeofSkills = (e) => {
    setSkillType(e.target.value);
  };

  const handleSearch = () => {
    getApplicantList();
  };

  const handleSort = (data) => {
    setSort(data);
  };

  //Clear Filter
  const handleClear = () => {
    setOpportunityType("");
    setSkillType("");
    setSort(1);
    getApplicantList("clear");
  };

  useEffect(() => {
    const skillOptions = skills?.doc?.map((skill) => ({
      value: skill._id,
      label: skill.skillName,
    }));

    setSkillOptions(skillOptions);
  }, [skills]);

  const saveTalent = (employee_id) => {
    let param = {
      employerId: userId,
      talentId: employee_id,
    };
    dispatch(
      saveTalentEmployee(param, (result) => {
        if (result.status) {
          getApplicantList();
        }
      })
    );
  };

  return (
    <div>
      <div className="app_track">
        <main className="job-main-col">
          <div className="container">
            <h2 className="main-heading-sub-col pb-3">
              {landingContent?.tracker?.heading}
            </h2>

            <nav>
              <div
                class="nav nav-tabs tabs-custom d-inline-flex justify-content-between "
                id="nav-tab"
                role="tablist"
              >
                <button
                  class="nav-link active border-0 applicant-nav-link"
                  id="nav-applied-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-applied"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                  onClick={() => handleStatus("applied")}
                >
                  {landingContent?.tracker?.appliedButton}
                </button>

                <button
                  class="nav-link border-0 applicant-nav-link"
                  id="nav-shortlisted-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-shortlisted"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                  onClick={() => handleStatus("shortlisted")}
                >
                  {landingContent?.tracker?.shortListedButton}
                </button>

                <button
                  class="nav-link border-0 applicant-nav-link"
                  id="nav-hired-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-hired"
                  type="button"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                  onClick={() => handleStatus("hired")}
                >
                  {landingContent?.tracker?.hiredButton}
                </button>
              </div>
            </nav>
          </div>
        </main>

        <section className="job-tabs-section">
          <div className="container">
            <div class="tab-content" id="nav-tabContent">
              <div
                class="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="nav-applied-tab"
                tabindex="0"
              >
                <div className="d-flex pt-4 select-employer-row gap-2">
                  <select
                    name="opportunity-type"
                    id="opportunity-type"
                    placeholder="opportunity-type"
                    value={sort}
                    className="select-employer-dashboard"
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="-1">Newest First</option>
                    <option value="1">Oldest First</option>
                  </select>

                  <select
                    name="opportunity-type"
                    id="opportunity-type"
                    placeholder="opportunity-type"
                    className="select-employer-dashboard"
                    value={opportunityType}
                    onChange={handleTypeofOpportunity}
                  >
                    <option value="">Type of Opportunity</option>
                    {jobType &&
                      jobType?.map((item) => (
                        <option key={item?._id} value={item?._id}>
                          {item?.typeName}
                        </option>
                      ))}
                  </select>

                  <select
                    name="opportunity-type"
                    id="opportunity-type"
                    placeholder="opportunity-type"
                    className="select-employer-dashboard"
                    value={jobsType}
                    onChange={handleTypeofjobs}
                  >
                    <option value="">Based on Jobs</option>
                    {jobNameList &&
                      jobNameList?.map((item) => (
                        <option key={item?._id} value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                  </select>

                  {/* <Select
                    value={skillType}
                    options={skillOptions}
                    isMulti
                    onChange={(e) => setSkillType(e)}
                    className={`basic-multi-select`}
                    classNamePrefix="select"
                  /> */}
                  {/* <select
                    name="support-roles"
                    id="support-roles"
                    placeholder="support-roles"
                    className="select-employer-dashboard"
                    value={skillType}
                    onChange={handleTypeofSkills}
                  >


                    <option value="">Skills</option>
                    {skills &&
                      skills?.map((item) => (
                        <option value={item?._id}>{item?.skillName}</option>
                      ))}
                  </select> */}

                  <button
                    className="btn btn-primary m-0"
                    onClick={handleSearch}
                  >
                    {landingContent?.tracker?.searchButton}
                  </button>
                  <button className="btn btn-primary m-0" onClick={handleClear}>
                    {landingContent?.tracker?.clearButton}
                  </button>
                </div>
                {loader ? (
                  <>
                    <Loading />
                    <div className="no-candidate-info">
                    Updating Application Status 
                    </div>
                  </>
                ) : applicantList?.docs?.length > 0 ? (
                  applicantList?.docs?.map((item) => (
                    <EmployerApplicantCards
                      key={item?._id}
                      data={item}
                      setLoader={setLoader}
                      currentPage={currentPage}
                      tab={status}
                      saveTalent={saveTalent}
                    />
                  ))
                ) : (
                  <div className="no-candidate-info">
                    {landingContent?.tracker?.noApplicationMessageEmployer}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
