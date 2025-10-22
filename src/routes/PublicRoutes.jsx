import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "../components/loader";
import ProtectedRoutes from "./ProtectedRoutes";
import { useSelector } from "react-redux";

// Lazy load the components
const Authlayout = lazy(() => import("../layouts/Authlayout"));
const EmployeeOpportunity = lazy(() => import("../pages/employee/EmployeeOpportunity"));
const Landinglayout = lazy(() => import("../layouts/Landinglayout"));
const Employeelayout = lazy(() => import("../layouts/Employeelayout"));
const Employeeflowlayout = lazy(() => import("../layouts/Employeeflowlayout"));
const Employerflowlayout = lazy(() => import("../layouts/Employerflowlayout"));

const Landingpage = lazy(() => import("../pages/Landingsite/Landingpage"));
const Subscriptionpage = lazy(() => import("../pages/Landingsite/Subscriptionpage"));
const FAQ = lazy(() => import("../pages/Landingsite/FAQ"));

const Forgetpassword = lazy(() => import("../pages/auth/forgetpassword"));
const ResetPassword = lazy(() => import("../pages/auth/resetPassoword"));
const ResetAdminPassword = lazy(() => import("../pages/auth/forgetAdminPassword"));
const Signup = lazy(() => import("../pages/auth/SignIn"));
const LoginSuccess = lazy(() => import("../pages/auth/success/loginSuccess.jsx"));
const JobSlotSuccess = lazy(() => import("../pages/auth/success/jobSlotSuccess.jsx"));
const WelcomeCandidate = lazy(() => import("../pages/auth/welcome/WelcomeCandidate.jsx"));
const Login = lazy(() => import("../pages/auth/login/index.jsx"));
const VerifyUserSuccess = lazy(() => import("../pages/auth/success/verifyUserSuccess"));
const CanclePayment = lazy(() => import("../pages/auth/success/canclePayment"));

const TitleDetails = lazy(() => import("../pages/auth/employee/title"));
const SkillsDetails = lazy(() => import("../pages/auth/employee/skills"));
const FileDetails = lazy(() => import("../pages/auth/employee/file"));
const SelectPlan = lazy(() => import("../pages/auth/employee/plan"));

const EmployerDetails = lazy(() => import("../pages/auth/employer/Employerdetails"));
const OrganizationDetails = lazy(() => import("../pages/auth/employer/OrganizationDetails"));
const OrganizationEmail = lazy(() => import("../pages/auth/employer/OrganizationEmail"));
const ProfessionalPlan = lazy(() => import("../pages/auth/employer/ProfessionalPlan"));
const OrganizationDescription = lazy(() => import("../pages/auth/employer/OrganizationDescription"));
const SocialDetails = lazy(() => import("../pages/auth/employer/SocialDetails"));
const Payment = lazy(() => import("../pages/auth/employer/payment"));

const JobPostTitle = lazy(() => import("../pages/jobpost/JobPostTitle"));
const JobPostOpportunity = lazy(() => import("../pages/jobpost/JobPostOpportunity"));
const JobPostCommitment = lazy(() => import("../pages/jobpost/JobPostCommitment"));
const JobPostRole = lazy(() => import("../pages/jobpost/JobPostRole"));
const JobPostRange = lazy(() => import("../pages/jobpost/JobPostRange"));
const JobPostInformation = lazy(() => import("../pages/jobpost/JobPostInformation"));
const JobPostDetails = lazy(() => import("../pages/jobpost/JobPostDetails"));

const EmployeeDashboard = lazy(() => import("../pages/employee/EmployeeDashboard"));
const JobDescription = lazy(() => import("../pages/employee/JobDescription"));
const JobSearch = lazy(() => import("../pages/employee/JobSearch"));
const JobTracker = lazy(() => import("../pages/employee/JobTracker"));
const SavedOpportunities = lazy(() => import("../pages/employee/SavedOpportunities"));
const CalenderTabs = lazy(() => import("../pages/employee/CalenderTabs"));
const ProfileUser = lazy(() => import("../pages/employee/ProfileUser"));
const ProfilePublicMode = lazy(() => import("../pages/employee/ProfilePublicMode"));
const FindeOpportunity = lazy(() => import("../pages/employee/FindeOpportunity"));

const EmployerFlowDashboard = lazy(() => import("../pages/employer/EmployerFlowDashboard"));
const EmployerJobPosted = lazy(() => import("../pages/employer/EmployerJobPosted"));
const EmployerCandidates = lazy(() => import("../pages/employer/EmployerCandidates"));
const OpportunitiesTracker = lazy(() => import("../pages/employer/OpportunitiesTracker"));
const EmployerCalendar = lazy(() => import("../pages/employer/EmployerCalendar"));
const EmployerJobDescription = lazy(() => import("../pages/employer/EmployerJobDescription"));
const JobDescriptionCandidates = lazy(() => import("../pages/employer/JobDescriptionCandidates"));
const JobDescriptionEmployer = lazy(() => import("../pages/employer/JobDescriptionEmployer"));

const Messages = lazy(() => import("../pages/dashboard/messages"));
const BuySlot = lazy(() => import("../pages/employer/BuySlot"));
const SubUser = lazy(() => import("../pages/employer/UserDescription"));

const PublicRoutes = () => {
    const role = useSelector((state) => state.user?.userDetails?.role);

    const getLayout = (Component) => {
        if (role === "employee") {
            return <Landinglayout>{Component}</Landinglayout>;
        } else if (role === "employer") {
            return <Landinglayout>{Component}</Landinglayout>;
        } else {
            return <Landinglayout>{Component}</Landinglayout>;
        }
    };
    console.log("asdasd")
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={getLayout(<Landingpage />)} />
                    <Route path="/company" element={getLayout(<Subscriptionpage />)} />
                    <Route path="/information" element={getLayout(<FAQ />)} />
                    <Route path="/signin" element={<Authlayout><Login /></Authlayout>} />
                    <Route path="/forgetpassword" element={<Authlayout><Forgetpassword /></Authlayout>} />
                    <Route path="/resetpassword/:id" element={<Authlayout><ResetPassword /></Authlayout>} />
                    <Route path="/resetAdminPassword/:id" element={<ResetAdminPassword />} />
                    <Route path="/login" element={<Authlayout><Login /></Authlayout>} />
                    <Route path="/success" element={<Authlayout><LoginSuccess /></Authlayout>} />
                    <Route path="/registeredsuccess" element={<Authlayout><LoginSuccess /></Authlayout>} />
                    <Route path="/paymentsuccess/:planId/:id" element={<Authlayout><LoginSuccess /></Authlayout>} />
                    <Route path="/jobslotpaymentsuccess/:planId/:id" element={<Authlayout><JobSlotSuccess /></Authlayout>} />
                    <Route path="/forgotsuccess" element={<Authlayout><LoginSuccess /></Authlayout>} />
                    <Route path="/welcome" element={<Authlayout><WelcomeCandidate /></Authlayout>} />
                    <Route path="/verifysuccess/:id" element={<Authlayout><VerifyUserSuccess /></Authlayout>} />
                    <Route path="/cancelpayment/:id" element={<Authlayout><CanclePayment /></Authlayout>} />
                    <Route path="/details-title" element={<Authlayout><TitleDetails /></Authlayout>} />
                    <Route path="/details-skills" element={<Authlayout><SkillsDetails /></Authlayout>} />
                    <Route path="/details-file" element={<Authlayout><FileDetails /></Authlayout>} />
                    <Route path="/details-plan" element={<Authlayout><SelectPlan /></Authlayout>} />
                    <Route path="/details-employer" element={<Authlayout><EmployerDetails /></Authlayout>} />
                    <Route path="/details-organization" element={<Authlayout><OrganizationDetails /></Authlayout>} />
                    <Route path="/details-organization-email" element={<Authlayout><OrganizationEmail /></Authlayout>} />
                    <Route path="/details-organization-plan" element={<Authlayout><ProfessionalPlan /></Authlayout>} />
                    <Route path="/details-organization-description" element={<Authlayout><OrganizationDescription /></Authlayout>} />
                    <Route path="/details-organization-social" element={<Authlayout><SocialDetails /></Authlayout>} />
                    <Route path="/details-organization-payment" element={<Authlayout><Payment /></Authlayout>} />
                    <Route path="/signup" element={<Authlayout><Signup /></Authlayout>} />

                    {/* Employer Protected Routes */}
                    <Route element={<ProtectedRoutes allowedRoles={["employer"]} />}>
                        <Route path="/job-title" element={<Employerflowlayout><JobPostTitle /></Employerflowlayout>} />
                        <Route path="/job-title/:id" element={<Employerflowlayout><JobPostTitle /></Employerflowlayout>} />
                        <Route path="/job-opportunity" element={<Employerflowlayout><JobPostOpportunity /></Employerflowlayout>} />
                        <Route path="/job-commitment" element={<Employerflowlayout><JobPostCommitment /></Employerflowlayout>} />
                        <Route path="/job-role" element={<Employerflowlayout><JobPostRole /></Employerflowlayout>} />
                        <Route path="/job-range" element={<Employerflowlayout><JobPostRange /></Employerflowlayout>} />
                        <Route path="/job-info" element={<Employerflowlayout><JobPostInformation /></Employerflowlayout>} />
                        <Route path="/job-details" element={<Employerflowlayout><JobPostDetails /></Employerflowlayout>} />
                        <Route path="/employer-message" element={<Employerflowlayout><Messages /></Employerflowlayout>} />
                        <Route path="/employer-dashboard" element={<Employerflowlayout><EmployerFlowDashboard /></Employerflowlayout>} />
                        <Route path="/employer-job-post" element={<Employerflowlayout><EmployerJobPosted /></Employerflowlayout>} />
                        <Route path="/employer-candidates" element={<Employerflowlayout><EmployerCandidates /></Employerflowlayout>} />
                        <Route path="/applicant-tracker" element={<Employerflowlayout><OpportunitiesTracker /></Employerflowlayout>} />
                        <Route path="/employer-calendar" element={<Employerflowlayout><EmployerCalendar /></Employerflowlayout>} />
                        <Route path="/employer-job-description" element={<Employerflowlayout><EmployerJobDescription /></Employerflowlayout>} />
                        <Route path="/employer-job-candidate/:id" element={<Employerflowlayout><JobDescriptionCandidates /></Employerflowlayout>} />
                        <Route path="/job-description-employer/:id" element={<Employerflowlayout><JobDescriptionEmployer /></Employerflowlayout>} />
                        <Route path="/messages/:id" element={<Employerflowlayout><Messages /></Employerflowlayout>} />
                        <Route path="/profile-user/:id" element={<Employerflowlayout><ProfilePublicMode /></Employerflowlayout>} />
                        <Route path="/buy-slot" element={<Employerflowlayout><BuySlot /></Employerflowlayout>} />
                        <Route path="/sub-user" element={<Employerflowlayout><SubUser /></Employerflowlayout>} />
                    </Route>

                    {/* Employee Protected Routes */}
                    <Route element={<ProtectedRoutes allowedRoles={["employee"]} />}>
                        <Route path="/profile-user-employee/:id" element={<Employeeflowlayout><ProfilePublicMode /></Employeeflowlayout>} />
                        <Route path="/messages" element={<Employeeflowlayout><Messages /></Employeeflowlayout>} />
                        <Route path="/employee-dashboard" element={<Employeeflowlayout><EmployeeDashboard /></Employeeflowlayout>} />
                        <Route path="/job-description/:id" element={<Employeeflowlayout><JobDescription /></Employeeflowlayout>} />
                        <Route path="/job-search" element={<Employeeflowlayout><JobSearch /></Employeeflowlayout>} />
                        <Route path="/job-tracker" element={<Employeeflowlayout><JobTracker /></Employeeflowlayout>} />
                        <Route path="/saved-opportunities" element={<Employeeflowlayout><SavedOpportunities /></Employeeflowlayout>} />
                        <Route path="/calender-tabs" element={<Employeeflowlayout><CalenderTabs /></Employeeflowlayout>} />
                        <Route path="/employee-calendar" element={<Employeeflowlayout><EmployerCalendar /></Employeeflowlayout>} />
                        <Route path="/profile-user" element={<Employeeflowlayout><ProfileUser /></Employeeflowlayout>} />
                        <Route path="/employee-opportunity" element={<Employeeflowlayout><EmployeeOpportunity /></Employeeflowlayout>} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default PublicRoutes;
