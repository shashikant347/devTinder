import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import api from "../utils/api";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/user/logout");
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar bg-base-100/60 backdrop-blur-xl border-b border-base-content/5 sticky top-0 z-50 px-4 lg:px-8">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-outfit font-bold gap-1 hover:bg-transparent"
        >
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Dev
          </span>
          <span className="text-base-content">Tinder</span>
          <span className="text-2xl">🔥</span>
        </Link>
      </div>

      {/* Nav Links */}
      {user && (
        <div className="flex-none gap-2">
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="btn btn-ghost btn-sm font-medium text-base-content/70 hover:text-primary transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/connections"
              className="btn btn-ghost btn-sm font-medium text-base-content/70 hover:text-primary transition-colors"
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className="btn btn-ghost btn-sm font-medium text-base-content/70 hover:text-primary transition-colors relative"
            >
              Requests
            </Link>
          </div>

          {/* Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-primary/30 hover:ring-primary/60 transition-all"
            >
              <div className="w-9 rounded-full">
                <img
                  alt="avatar"
                  src={
                    user.photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200/95 backdrop-blur-xl rounded-box z-10 mt-3 w-56 p-3 shadow-2xl border border-base-content/5"
            >
              <li className="mb-2">
                <div className="flex flex-col items-start gap-0 hover:bg-transparent cursor-default">
                  <span className="font-semibold text-base-content">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="text-xs text-base-content/50">
                    {user.emailId}
                  </span>
                </div>
              </li>
              <div className="divider my-0"></div>
              <li>
                <Link to="/profile" className="text-base-content/80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </Link>
              </li>

              {/* Mobile-only nav links */}
              <li className="md:hidden">
                <Link to="/" className="text-base-content/80">Feed</Link>
              </li>
              <li className="md:hidden">
                <Link to="/connections" className="text-base-content/80">Connections</Link>
              </li>
              <li className="md:hidden">
                <Link to="/requests" className="text-base-content/80">Requests</Link>
              </li>

              <div className="divider my-0"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
