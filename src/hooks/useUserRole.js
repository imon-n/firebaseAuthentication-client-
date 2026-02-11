import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosInstance = useAxios();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return; // wait firebase

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
