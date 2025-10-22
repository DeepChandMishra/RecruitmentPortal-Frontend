import React, { useEffect, useState } from "react";
import bagIcon from "../../assets/images/Bag.svg";
import bookMarkIcon from "../../assets/images/BookmarkSimple.svg";
import eyeIcon from "../../assets/images/eyenav.svg";
import peopleIcon from "../../assets/images/UsersThree.svg";
import EmployerHiresCards from "../../components/cards/EmployerHiresCards";
import PreviousHiresCards from "../../components/cards/PreviousHiresCards";
import {
  ListGroup,
  Badge,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import searchIcon from "../../assets/images/search-icon.svg";
import DownloadIcon from "../../assets/images/DownloadSimple.svg";
import searchWhite from "../../assets/images/magnifying-white.svg";
import filterIcon from "../../assets/images/filter.svg";
import EmployerCandidatesCards from "../../components/cards/EmployerCandidatesCards";
import EmployerDashboardCard from "../../components/cards/EmployerDashboardCard";
import ModalChat from "../../components/ModalChat";
import {
  getJobPosted,
  hiredCandidateList,
  saveTalent,
  saveTalentEmployee,
} from "../../redux/actions/employer";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useDebounce from "../../customHook/useDebounce";

export default function EmployerJobDescription() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageS, setCurrentPageS] = useState(1);
  const [totalPagesS, setTotalPagesS] = useState(1);
  const [currentPageO, setCurrentPageO] = useState(1);
  const [totalPagesO, setTotalPagesO] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [hireSearch, setHireSearch] = useState();
  const [searchSaved, setSearchSaved] = useState();
  const [activeTab, setActiveTab] = useState("Your Hires");

  const { t, i18n } = useTranslation();
  const landingContent = t("landingPage");

  const { jobPosted, hiredCandidate, savedTalentList } = useSelector(
    (state) => state.employer
  );
  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedSavedSearchText = useDebounce(searchSaved, 500);
  console.log(
    "🚀 ~ EmployerJobDescription ~ debouncedSearchText:",
    debouncedSavedSearchText
  );
  const debouncedHireSearch = useDebounce(hireSearch, 500);

  console.log(
    "🚀 ~ EmployerJobDescription ~ debouncedHireSearch:",
    debouncedHireSearch
  );

  console.log({ savedTalentList });

  const getjobPost = () => {
    let param = {
      sortBy: "",
      limit: 10,
      page: currentPageO,
    };
    if (debouncedSearchText) {
      param.query = {};
      param.query.search = debouncedSearchText;
    }
    dispatch(
      getJobPosted(param, userId, (result) => {
        if (result.status) {
          setTotalPagesO(result?.data?.totalPages);
        }
      })
    );
  };

  console.log("totott", totalPages);
  const getHiredCandidate = () => {
    let param = {
      sortBy: 1,
      limit: 10,
      page: currentPage,
    };
    if (debouncedHireSearch) {
      param.search = debouncedHireSearch;
    }

    dispatch(
      hiredCandidateList(param, userId, (result) => {
        console.log("dsfsdfsdf", result);
        setTotalPages(result?.data?.totalPages);
      })
    );
  };

  const getSavedTalent = () => {
    let param = {
      sortBy: 1,
      limit: 10,
      page: currentPageS,
    };
    if (debouncedSavedSearchText) {
      param.search = debouncedSavedSearchText;
    }
    dispatch(
      saveTalent(param, userId, (result) => {
        if (result.status) {
          setTotalPagesS(result?.data?.totalPages);
        }
      })
    );
  };

  const saveTalentEmployees = (employee_id) => {
    let param = {
      employerId: userId,
      talentId: employee_id,
    };
    dispatch(
      saveTalentEmployee(param, (result) => {
        if (result.status) {
          getHiredCandidate();
          getSavedTalent();
        }
      })
    );
  };

  useEffect(() => {
    if (activeTab == "Your Hires") {
      getjobPost();
    }
    getHiredCandidate();
  }, [currentPage, debouncedSearchText, debouncedHireSearch, currentPageO]);

  useEffect(() => {
    getSavedTalent();
  }, [currentPageS, debouncedSavedSearchText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChangeO = (page) => {
    setCurrentPageO(page);
  };
  const handlePageChangeS = (page) => {
    setCurrentPageS(page);
  };

  return (
    <div>
      <section>
        <div className="container py-5 employer-job-opportunities-tabs">
          <div class="d-flex align-items-start nav-main-row">
            <div
              class="nav flex-column nav-pills me-3"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <button
                class="nav-link active"
                id="v-pills-hires"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-your-hires"
                type="button"
                role="tab"
                aria-controls="v-pills-your-hires"
                aria-selected="true"
              >
                <img src={bagIcon} alt="icon" /> Your hires
              </button>

              <button
                class="nav-link"
                id="v-pills-saved-talent"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-saved"
                type="button"
                role="tab"
                aria-controls="v-pills-messages"
                aria-selected="false"
              >
                <img src={bookMarkIcon} alt="icon" /> Saved Talent
              </button>
              <button
                class="nav-link"
                id="v-pills-posted-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-posted"
                type="button"
                role="tab"
                aria-controls="v-pills-settings"
                aria-selected="false"
              >
                <img src={peopleIcon} alt="icon" />
                Your Posted Opportunities
              </button>
            </div>
            <div class="tab-content w-100" id="v-pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="v-pills-your-hires"
                role="tabpanel"
                aria-labelledby="v-pills-hires"
                tabindex="0"
              >
                <h2 className="hire-nav-heading">Your hires</h2>
                <p className="hire-nav-para">
                  Look up people you’re working with
                </p>

                <div className="d-flex">
                  <InputGroup className="mb-3 input-search">
                    <input
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      value={hireSearch}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setHireSearch(e.target.value);
                      }}
                    />
                    <img src={searchIcon} alt="search-icon" />
                  </InputGroup>
                  {/* <button className="btn btn-search search-btn-employer btn-primary">Search</button> */}
                </div>

                <div className="employer-hire-wrapper">
                  {hiredCandidate &&
                    hiredCandidate?.docs?.map((item) => (
                      <EmployerHiresCards
                        data={item}
                        saveTalentEmployee={saveTalentEmployees}
                      />
                    ))}
                </div>
                {hiredCandidate?.totalDocs == 0 ? (
                  <div className="no-candidate-info">
                    {landingContent?.tracker?.noApplicationMessageEmployer}
                  </div>
                ) : (
                  <div className="text-center candidate-icon-col mt-4 mb-3">
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {landingContent?.pagination?.previousButton}
                    </button>
                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {landingContent?.pagination?.nextButton}
                    </button>
                  </div>
                )}
              </div>

              <div
                class="tab-pane fade w-100"
                id="v-pills-previous"
                role="tabpanel"
                aria-labelledby="v-pills-previous-hires"
                tabindex="0"
              >
                <h2 className="hire-nav-heading">Your hires</h2>
                <p className="hire-nav-para">
                  Look up people you’re worked with
                </p>

                <div className="d-flex">
                  <InputGroup className="mb-3 input-search">
                    <input
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />

                    <img src={searchIcon} alt="search-icon" />
                  </InputGroup>
                </div>

                <div className="prev-outer-wrapper">
                  <div className="d-flex gap-2 align-items-center mb-3">
                    <div className="d-flex flex-1">
                      <input
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon2"
                        className="prev-input-col"
                      />
                      <button className="prev-btn-col btn-primary">
                        <img src={searchWhite} alt="icon" />
                      </button>
                    </div>

                    <button className="bg-transparent d-flex gap-2 filter-hire-btn">
                      <img src={filterIcon} alt="icon" />
                      Filter
                    </button>
                  </div>

                  <div className="d-flex gap-3 align-items-center justify-content-center flex-wrap py-3 ">
                    <label>Sort by:</label>
                    <select
                      name="opportunity-status"
                      id="opportunity-status"
                      placeholder="opportunity-status"
                      className="select-employer-dashboard"
                    >
                      <option value="volvo">opportunity-status</option>
                      <option value="saab">Saab</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="audi">Audi</option>
                    </select>

                    <select
                      name="opportunity-status"
                      id="opportunity-status"
                      placeholder="opportunity-status"
                      className="select-employer-dashboard"
                    >
                      <option value="volvo">opportunity-status</option>
                      <option value="saab">Saab</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="audi">Audi</option>
                    </select>

                    <span>106 Total</span>

                    <button className="border-0 bg-transparent btn-csv d-flex align-items-center gap-2">
                      <img src={DownloadIcon} alt="icon" /> Download CSV
                    </button>
                  </div>

                  <div className="pt-2">
                    <PreviousHiresCards />

                    <PreviousHiresCards />

                    <PreviousHiresCards />

                    <PreviousHiresCards />

                    <PreviousHiresCards />
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="v-pills-saved"
                role="tabpanel"
                aria-labelledby="v-pills-saved-talent"
                tabindex="0"
              >
                <h2 className="hire-nav-heading">Saved talent</h2>
                <p className="hire-nav-para">Look up people you saved</p>

                <InputGroup className="mb-3 input-search">
                  <input
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setCurrentPageS(1);
                      setSearchSaved(e.target.value);
                    }}
                  />

                  <img src={searchIcon} alt="search-icon" />
                </InputGroup>

                {savedTalentList &&
                  savedTalentList?.docs?.map((item) => (
                    <EmployerCandidatesCards
                      data={item?.TalentData}
                      saveTalent={saveTalentEmployees}
                      isSaved={true}
                    />
                  ))}
                {savedTalentList?.totalDocs === 0 ? (
                  <div className="no-candidate-info">
                    {landingContent?.tracker?.noApplicationMessageEmployer}
                  </div>
                ) : (
                  <div className="text-center candidate-icon-col mb-3">
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChangeS(currentPageS - 1)}
                      disabled={currentPageS === 1}
                    >
                      {landingContent?.pagination?.previousButton}
                    </button>
                    <span className="mx-3">
                      Page {currentPageS} of {totalPagesS}
                    </span>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(currentPageS + 1)}
                      disabled={currentPageS === totalPagesS}
                    >
                      {landingContent?.pagination?.nextButton}
                    </button>
                  </div>
                )}
              </div>
              <div
                class="tab-pane fade"
                id="v-pills-posted"
                role="tabpanel"
                aria-labelledby="v-pills-posted-tab"
                tabindex="0"
              >
                <h2 className="hire-nav-heading">Your posted opportunities</h2>
                <p className="hire-nav-para">
                  Look up opportunities you have posted
                </p>

                <InputGroup className="mb-3 input-search">
                  <input
                    type="search"
                    value={searchText}
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setCurrentPageO(1);
                      setSearchText(e.target.value);
                    }}
                  />

                  <img src={searchIcon} alt="search-icon" />
                </InputGroup>

                {jobPosted?.docs?.length > 0 &&
                  jobPosted?.docs?.map((item) => (
                    <EmployerDashboardCard
                      data={item}
                      saveTalent={saveTalent}
                    />
                  ))}
                {jobPosted?.totalDocs == 0 ? (
                  <div className="no-candidate-info">
                    {landingContent?.tracker?.noApplicationMessageEmployer}
                  </div>
                ) : (
                  <div className=" mb-3 text-center candidate-icon-col">
                    {console.log("currentPageO", currentPageO)}
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChangeO(currentPageO - 1)}
                      disabled={currentPageO === 1}
                    >
                      {landingContent?.pagination?.previousButton}
                    </button>
                    <span className="mx-3">
                      Page {currentPageO} of {totalPagesO}
                    </span>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChangeO(currentPageO + 1)}
                      disabled={currentPageO === totalPagesO}
                    >
                      {landingContent?.pagination?.nextButton}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
