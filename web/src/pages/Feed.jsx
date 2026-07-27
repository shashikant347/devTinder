import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { setFeed, removeUserFromFeed, setFeedLoading } from "../store/feedSlice";
import UserCard from "../components/UserCard";

const Feed = () => {
  const { users, isLoading } = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    dispatch(setFeedLoading(true));
    try {
      const res = await api.get("/user/feed?page=1&limit=20");
      if (res.data.success) {
        dispatch(setFeed(res.data.data));
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Feed fetch error", err);
    } finally {
      dispatch(setFeedLoading(false));
    }
  };

  const handleAction = async (status, userId) => {
    setActionError("");
    try {
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeUserFromFeed(userId));
      setCurrentIndex((prev) => Math.min(prev, users.length - 2));
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to send request"
      );
      setTimeout(() => setActionError(""), 3000);
    }
  };

  const currentUser = users[currentIndex];

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center p-4 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Error toast */}
      {actionError && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error">
            <span className="text-sm">{actionError}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-infinity loading-xl text-primary"></span>
          <p className="text-base-content/50 text-sm">
            Finding developers for you...
          </p>
        </div>
      ) : !currentUser || users.length === 0 ? (
        <div className="text-center">
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-2xl font-outfit font-bold text-base-content mb-2">
            No more developers
          </h2>
          <p className="text-base-content/50 mb-6 max-w-sm">
            You've seen everyone! Check back later for new developers joining
            the platform.
          </p>
          <button
            onClick={fetchFeed}
            className="btn bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh Feed
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Card stack effect */}
          {users.length > currentIndex + 1 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90%] h-full bg-base-100/50 rounded-2xl -z-10 scale-[0.95]"></div>
          )}
          {users.length > currentIndex + 2 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] h-full bg-base-100/30 rounded-2xl -z-20 scale-[0.90]"></div>
          )}

          <UserCard user={currentUser} onAction={handleAction} />

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-xs text-base-content/30">
              {users.length - currentIndex} developer
              {users.length - currentIndex !== 1 ? "s" : ""} remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
