import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import api from "../utils/api";
import { setUser, clearUser } from "../store/userSlice";

const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      api
        .get("/user/me")
        .then((res) => {
          if (res.data.success) {
            dispatch(setUser(res.data.data));
          } else {
            dispatch(clearUser());
          }
        })
        .catch(() => {
          dispatch(clearUser());
        });
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-infinity loading-xl text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
