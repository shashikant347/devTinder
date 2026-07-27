const ConnectionCard = ({ user, type, onAction, requestId }) => {
  return (
    <div className="card bg-base-100/80 backdrop-blur-sm border border-base-content/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="card-body p-4 flex-row items-center gap-4">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-14 h-14 rounded-full ring-2 ring-primary/20">
            <img
              src={
                user.photoUrl ||
                "https://geographyandyou.com/images/user-profile.png"
              }
              alt={user.firstname || "User"}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base-content truncate">
            {user.firstname} {user.lastname}
          </h3>
          {user.age && (
            <p className="text-xs text-base-content/50">Age: {user.age}</p>
          )}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {user.skills.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="badge badge-xs bg-primary/10 text-primary border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions for requests */}
        {type === "request" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAction("accepted", requestId)}
              className="btn btn-sm btn-success btn-outline hover:scale-105 transition-transform"
              title="Accept"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </button>
            <button
              onClick={() => onAction("rejected", requestId)}
              className="btn btn-sm btn-error btn-outline hover:scale-105 transition-transform"
              title="Reject"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Badge for connections */}
        {type === "connection" && (
          <div className="badge badge-success badge-outline gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Connected
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
