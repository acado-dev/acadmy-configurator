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
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// User pages
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserLayout from "./components/UserLayout";
import UserProtectedRoute from "./components/UserProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import CourseListing from "./pages/user/CourseListing";
import CourseDetail from "./pages/user/CourseDetail";
import ApplicationWizard from "./pages/user/ApplicationWizard";
import Portfolio from "./pages/user/Portfolio";
import ProfileView from "./pages/ProfileView";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="universities" element={<Universities />} />
            <Route path="universities/add" element={<AddUniversity />} />
            <Route path="universities/edit/:universityId" element={<AddUniversity />} />
            <Route path="courses" element={<Courses />} />
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
          
          {/* Public Profile View */}
          <Route path="/profile/:username" element={<ProfileView />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
