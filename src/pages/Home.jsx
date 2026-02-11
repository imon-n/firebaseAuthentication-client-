import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { user, logOut } = useAuth();

  return (
    <div>
      <h1>Home Page</h1>

      {user ? (
        <>
          <p>Welcome: {user.email}</p>
          <button onClick={logOut}>Logout</button>
          <br />
          <Link to="/dashboard">Dashboard</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <br />
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
};

export default Home;
