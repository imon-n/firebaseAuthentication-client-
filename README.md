```
✔ Firebase Auth
✔ MongoDB User Store
✔ Role Based Routing
✔ No JWT
✔ No Cookies
✔ Clean Professional Structure
✔ React Router v6.4+ (createBrowserRouter)
```

# 🔥 CLIENT SIDE (FULL CODE)
# ===============================

## 📁 Project Structure
```
src/
 ├── firebase/
 │     firebase.init.js
 ├── context/
 │     AuthContext.jsx
 │     AuthProvider.jsx
 ├── hooks/
 │     useAuth.js
 │     useAxios.js
 │     useUserRole.js
 ├── routes/
 │     PrivateRoute.jsx
 │     AdminRoute.jsx
 │     TutorRoutes.jsx
 ├── pages/
 │     Home.jsx
 │     Dashboard.jsx
 │     ErrorPage.jsx
 │     login/Login.jsx
 │     register/Register.jsx
 ├── router.jsx
 ├── main.jsx
```
---

# 🔥 firebase/firebase.init.js

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
````

# 🔥 context/AuthContext.jsx

```js
import { createContext } from "react";

export const AuthContext = createContext(null);
```

# 🔥 context/AuthProvider.jsx

```js
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
```

# 🔥 hooks/useAuth.js
```js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
```

# 🔥 hooks/useAxios.js
```js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
```

# 🔥 hooks/useUserRole.js

```js
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosInstance = useAxios();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    axiosInstance
      .get(`/users/role/${user.email}`)
      .then((res) => {
        setRole(res.data.role);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });

  }, [user, loading, axiosInstance]);

  return { role, roleLoading };
};

export default useUserRole;
```

# 🔥 routes/PrivateRoute.jsx

```js
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
```

# 🔥 routes/AdminRoute.jsx

```js
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) return <p>Loading...</p>;

  if (!user || role !== "admin") {
    return <Navigate to="/error" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AdminRoute;
```

# 🔥 routes/TutorRoutes.jsx

```js
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
```

# 🔥 pages/Home.jsx

```js
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
```

# 🔥 pages/Dashboard.jsx

```js
import useUserRole from "../hooks/useUserRole";

const Dashboard = () => {
  const { role } = useUserRole();

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Your Role: {role}</h3>

      {role === "admin" && <p>Admin Panel</p>}
      {role === "tutor" && <p>Tutor Panel</p>}
      {role === "user" && <p>User Panel</p>}
    </div>
  );
};

export default Dashboard;
```

# 🔥 pages/ErrorPage.jsx

```js
const ErrorPage = () => {
  return (
    <div>
      <h1>Access Denied</h1>
    </div>
  );
};

export default ErrorPage;
```

# 🔥 pages/register/Register.jsx

```js
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
```

# 🔥 pages/login/Login.jsx

```js
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
```

# 🔥 router.jsx

```js
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
        <h1>Tutor Only Page</h1>
      </TutorRoutes>
    ),
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
]);

export default router;

```

# 🔥 main.jsx

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import AuthProvider from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
```

---

# ===============================

# 🔥 BACKEND (FULL WORKING CODE)

# ===============================

## 📁 server structure
```
server/
├── config/db.js
├── controllers/user.controller.js
├── models/user.model.js
├── routes/user.routes.js
├── server.js
```

# 🔥 config/db.js

```js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  await client.connect();
  db = client.db("studyZone");
  console.log("MongoDB Connected");
};

const getDB = () => db;

module.exports = { connectDB, getDB };
```

# 🔥 models/user.model.js

```js
const { getDB } = require("../config/db");

const userCollection = () => {
  return getDB().collection("users");
};

module.exports = userCollection;
```

# 🔥 controllers/user.controller.js

```js
const userCollection = require("../models/user.model");

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await userCollection().findOne({
      email: userData.email,
    });

    if (existingUser) {
      return res.send({ message: "User already exists" });
    }

    const result = await userCollection().insertOne(userData);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateLastLogin = async (req, res) => {
  try {
    const { email, last_log_in } = req.body;

    const result = await userCollection().updateOne(
      { email },
      { $set: { last_log_in } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userCollection().findOne({ email });

    res.send({ role: user?.role || null });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
```

# 🔥 routes/user.routes.js

```js
const express = require("express");
const {
  createUser,
  updateLastLogin,
  getUserRole,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/", createUser);
router.patch("/login", updateLastLogin);
router.get("/role/:email", getUserRole);

module.exports = router;
```

# 🔥 server.js

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
```

---

# 🎉 DONE

✔ Register
✔ Login
✔ Google Login
✔ MongoDB user store
✔ Role based route
✔ Admin route
✔ Tutor route
✔ Dashboard role detect
✔ Update last login

```
```
