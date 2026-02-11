import useUserRole from "../hooks/useUserRole";

const Dashboard = () => {
   const { role} = useUserRole();

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
