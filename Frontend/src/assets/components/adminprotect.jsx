// components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail === "xpeditionorg@gmail.com") {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedAdminRoute;
