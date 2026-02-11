import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/dashboard";
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signIn(email, password);

      await axiosInstance.patch("/users/login", {
        email,
        last_log_in: new Date().toISOString(),
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      await axiosInstance.post("/users", {
        name: user.displayName,
        email: user.email,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" required />
        <br />
        <input name="password" type="password" placeholder="Password" required />
        <br />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleGoogleLogin}>Login with Google</button>

      <p>{error}</p>
    </div>
  );
};

export default Login;
