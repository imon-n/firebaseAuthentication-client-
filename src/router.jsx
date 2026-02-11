import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import TutorRoutes from "./routes/TutorRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <h1>Admin Only Page</h1>
      </AdminRoute>
    ),
  },
  {
    path: "/tutor",
    element: (
      <TutorRoutes>
        <h1>Tutor Only Page+</h1>
      </TutorRoutes>
    ),
  },

]);

export default router;
