import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await createUser(email, password);

      await updateUserProfile({ displayName: name });

      await axiosInstance.post("/users", {
        name,
        email,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" required />
        <br />
        <input name="email" type="email" placeholder="Email" required />
        <br />
        <input name="password" type="password" placeholder="Password" required />
        <br />
        <button type="submit">Register</button>
      </form>

      <p>{error}</p>
    </div>
  );
};

export default Register;
