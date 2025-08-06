import { Navigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = UserData();

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
