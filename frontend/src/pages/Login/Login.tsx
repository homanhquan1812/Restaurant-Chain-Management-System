import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { LoginContainer } from "../../components/LoginComponent/LoginContainer";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.trim().toUpperCase().replace(/\s+/g, "_");

  if (!token) {
    navigate("/");
    return;
  }

  switch (role) {
    case "UTOPIA_MANAGER":
    case "BRAND_MANAGER":
    case "BRANCH_MANAGER":
      navigate("/dashboard");
      break;
    case "BRANCH_EMPLOYEE":
      navigate("/order-list");
      break;
    default:
      navigate("/unauthorized");
      break;
  }
}, []);


  return (
    <div
      className="min-h-screen max-md:min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#FCE2D1",
      }}
    >
      <LoginContainer />
    </div>
  );
};

export default Login;
