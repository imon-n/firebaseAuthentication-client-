import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const TutorRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) return <p>Loading...</p>;

  if (!user || role !== "tutor") {
    return <Navigate to="/error" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default TutorRoutes;
