import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface UniversityProtectedRouteProps {
  children: React.ReactElement;
}

const UniversityProtectedRoute = ({ children }: UniversityProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if university is authenticated from localStorage
    const authStatus = localStorage.getItem("universityAuth");
    setIsAuthenticated(authStatus === "true");
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/university/login" replace />;
  }

  return children;
};

export default UniversityProtectedRoute;