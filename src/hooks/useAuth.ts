import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authStatus = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    
    if (authStatus === "true") {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate("/login");
  };

  return {
    isAuthenticated,
    userEmail,
    logout,
  };
};