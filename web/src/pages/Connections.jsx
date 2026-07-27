import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { setConnections } from "../store/connectionSlice";
import ConnectionCard from "../components/ConnectionCard";

const Connections = () => {
  const { connections } = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/accepted");
      dispatch(setConnections(res.data.data || []));
    } catch (err) {
      console.error("Failed to fetch connections", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-outfit font-bold text-base-content mb-2">
          Your{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Connections
          </span>
        </h1>
        <p className="text-base-content/50 text-sm mb-8">
          Developers you've matched with
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-infinity loading-xl text-primary"></span>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🤝</div>
            <h2 className="text-xl font-outfit font-semibold text-base-content mb-2">
              No connections yet
            </h2>
            <p className="text-base-content/50 text-sm max-w-sm mx-auto">
              Start swiping on the feed to connect with other developers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connections.map((conn) => (
              <ConnectionCard
                key={conn._id}
                user={conn}
                type="connection"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
