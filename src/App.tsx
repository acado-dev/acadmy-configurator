import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MasterFields from "./pages/MasterFields";
import Forms from "./pages/Forms";
import FormEditor from "./pages/FormEditor";
import Universities from "./pages/Universities";
import AddUniversity from "./pages/AddUniversity";
import UniversityDetails from "./pages/UniversityDetails";
import UniversityView from "./pages/UniversityView";
import Courses from "./pages/Courses";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AcceptanceLetters from '@/pages/AcceptanceLetters';
import FormApplications from '@/pages/FormApplications';
import ApplicationReview from "./pages/ApplicationReview";
import ProtectedRoute from "./components/ProtectedRoute";

// User pages
import UserLogin from '@/pages/UserLogin';
import UserRegister from '@/pages/UserRegister';
import UserLayout from '@/components/UserLayout';
import UserProtectedRoute from '@/components/UserProtectedRoute';
import UserDashboard from '@/pages/user/UserDashboard';
import CourseListing from '@/pages/user/CourseListing';
import CourseDetail from '@/pages/user/CourseDetail';
import ApplicationWizard from '@/pages/user/ApplicationWizard';
import Portfolio from '@/pages/user/Portfolio';
import ProfileView from '@/pages/ProfileView';
import MyApplications from '@/pages/user/MyApplications';
import ApplicationDetail from '@/pages/user/ApplicationDetail';
import Communications from '@/pages/user/Communications';

// University Admin Pages
import UniversityLogin from '@/pages/university/UniversityLogin';
import UniversityLayout from '@/components/UniversityLayout';
import UniversityProtectedRoute from '@/components/UniversityProtectedRoute';
import UniversityDashboard from '@/pages/university/UniversityDashboard';
import UniversityCourses from '@/pages/university/UniversityCourses';
import UniversityForms from '@/pages/university/UniversityForms';
import UniversityFormBuilder from '@/pages/university/UniversityFormBuilder';
import ApplicationProcess from '@/pages/university/ApplicationProcess';
import ApplicationProcessList from '@/pages/university/ApplicationProcessList';
import UniversityApplicationReview from '@/pages/university/ApplicationReview';
import ApplicationsList from '@/pages/university/ApplicationsList';
import ApplicationsOverview from '@/pages/university/ApplicationsOverview';
import UniversityInfo from '@/pages/university/UniversityInfo';
import TalentPool from '@/pages/university/TalentPool';
import ProcessSteps from '@/pages/university/ProcessSteps';
import ProcessConfiguration from '@/pages/university/ProcessConfiguration';
import UserManagement from '@/pages/university/UserManagement';
import CourseCategories from '@/pages/CourseCategories';
import CourseLevels from '@/pages/CourseLevels';
import CourseTypes from '@/pages/CourseTypes';
import LearningOutcomes from '@/pages/LearningOutcomes';

const queryClient = new QueryClient();

const App = () => {
  // Enrich existing universities so the view page shows full details even for previously added entries
  React.useEffect(() => {
    // Dynamically import to avoid bundling issues if localStorage is not available in some environments
    import('@/data/enrichUniversities').then((m) => m.enrichUniversitiesWithDemoDetails?.());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="master-fields" element={<MasterFields />} />
              <Route path="forms" element={<Forms />} />
              <Route path="forms/:formId" element={<FormEditor />} />
              <Route path="form-applications" element={<FormApplications />} />
              <Route path="form-applications/:applicationId" element={<ApplicationReview />} />
              <Route path="universities" element={<Universities />} />
              <Route path="universities/add" element={<AddUniversity />} />
              <Route path="universities/edit/:universityId" element={<AddUniversity />} />
              <Route path="universities/:universityId/view" element={<UniversityView />} />
              <Route path="universities/:universityId/details" element={<UniversityDetails />} />
              <Route path="courses" element={<Courses />} />
              <Route path="course-category" element={<CourseCategories />} />
              <Route path="course-level" element={<CourseLevels />} />
              <Route path="course-type" element={<CourseTypes />} />
              <Route path="learning-outcome" element={<LearningOutcomes />} />
              <Route path="users" element={<Users />} />
              {/* Applications - Master Admin */}
              <Route path="applications-overview" element={<ApplicationsOverview />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/selection-process" element={<ApplicationProcessList />} />
              <Route path="applications/acceptance-letters" element={<AcceptanceLetters />} />
            </Route>
            
            {/* User Routes */}
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user" element={
              <UserProtectedRoute>
                <UserLayout />
              </UserProtectedRoute>
            }>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="courses" element={<CourseListing />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="apply/:formId" element={<ApplicationWizard />} />
              <Route path="portfolio" element={<Portfolio />} />
            </Route>
            
            {/* University Admin Routes */}
            <Route path="/university/login" element={<UniversityLogin />} />
            <Route path="/university" element={
              <UniversityProtectedRoute>
                <UniversityLayout />
              </UniversityProtectedRoute>
            }>
              <Route index element={<UniversityDashboard />} />
              <Route path="dashboard" element={<UniversityDashboard />} />
              <Route path="info" element={<UniversityInfo />} />
              <Route path="courses" element={<UniversityCourses />} />
              <Route path="courses/new" element={<UniversityCourses />} />
              <Route path="courses/:courseId" element={<UniversityCourses />} />
              <Route path="courses/:courseId/edit" element={<UniversityCourses />} />
              <Route path="forms" element={<UniversityForms />} />
              <Route path="forms/new" element={<UniversityFormBuilder />} />
              <Route path="forms/:formId" element={<UniversityFormBuilder />} />
              <Route path="application-process/:courseId" element={<ApplicationProcess />} />
              <Route path="application-process-list" element={<ApplicationProcessList />} />
              <Route path="process-steps" element={<ProcessSteps />} />
              <Route path="process-configuration/new" element={<ProcessConfiguration />} />
              <Route path="process-configuration/:courseId" element={<ProcessConfiguration />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<UniversityApplicationReview />} />
              <Route path="applications-overview" element={<ApplicationsOverview />} />
              <Route path="talent" element={<TalentPool />} />
              <Route path="communications" element={<UniversityDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<UniversityDashboard />} />
            </Route>
            
            {/* Public Profile View */}
            <Route path="/profile/:username" element={<ProfileView />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
