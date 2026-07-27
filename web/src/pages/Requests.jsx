import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { setRequests, removeRequest } from "../store/connectionSlice";
import ConnectionCard from "../components/ConnectionCard";

const Requests = () => {
  const { requests } = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/connection");
      if (res.data.success) {
        dispatch(setRequests(res.data.data || []));
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status, requestId) => {
    setActionError("");
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequest(requestId));
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to review request"
      );
      setTimeout(() => setActionError(""), 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-outfit font-bold text-base-content mb-2">
          Connection{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Requests
          </span>
        </h1>
        <p className="text-base-content/50 text-sm mb-8">
          Developers interested in connecting with you
        </p>

        {/* Error toast */}
        {actionError && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-error">
              <span className="text-sm">{actionError}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-infinity loading-xl text-primary"></span>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">📨</div>
            <h2 className="text-xl font-outfit font-semibold text-base-content mb-2">
              No pending requests
            </h2>
            <p className="text-base-content/50 text-sm max-w-sm mx-auto">
              When someone shows interest in you, their request will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requests.map((req) => (
              <ConnectionCard
                key={req._id}
                user={req.fromUser}
                type="request"
                requestId={req._id}
                onAction={handleReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
