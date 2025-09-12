import { Navigate } from "react-router-dom";

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
  const userAuth = localStorage.getItem("userAuth");
  
  if (!userAuth) {
    return <Navigate to="/user/login" replace />;
  }
  
  return <>{children}</>;
};

export default UserProtectedRoute;