import { useState } from "react";

const UserCard = ({ user, onAction }) => {
  const [animating, setAnimating] = useState(null); // "left" | "right" | null
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setAnimating(status === "interested" ? "right" : "left");

    // Wait for animation, then call parent
    setTimeout(async () => {
      await onAction(status, user._id);
      setAnimating(null);
      setIsProcessing(false);
    }, 400);
  };

  const getAnimClass = () => {
    if (animating === "right") return "translate-x-[120%] rotate-12 opacity-0";
    if (animating === "left") return "-translate-x-[120%] -rotate-12 opacity-0";
    return "translate-x-0 rotate-0 opacity-100";
  };

  return (
    <div
      className={`card w-80 sm:w-96 bg-base-100 shadow-2xl overflow-hidden transition-all duration-400 ease-out ${getAnimClass()}`}
    >
      {/* Photo */}
      <figure className="relative h-80 sm:h-96">
        <img
          src={
            user.photoUrl ||
            "https://geographyandyou.com/images/user-profile.png"
          }
          alt={user.firstname || "User"}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/20 to-transparent"></div>

        {/* Info on photo */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-2xl font-outfit font-bold text-base-content">
            {user.firstname} {user.lastname}
            {user.age && (
              <span className="text-lg font-normal text-base-content/60 ml-2">
                {user.age}
              </span>
            )}
          </h2>
          {user.gender && (
            <span className="badge badge-sm badge-outline badge-primary mt-1 capitalize">
              {user.gender}
            </span>
          )}
        </div>
      </figure>

      <div className="card-body p-5 pt-2">
        {/* About */}
        {user.about && (
          <p className="text-sm text-base-content/60 line-clamp-2">
            {user.about}
          </p>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {user.skills.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="badge badge-sm bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-primary border-primary/20"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 5 && (
              <span className="badge badge-sm badge-ghost">
                +{user.skills.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-center mt-4 gap-6">
          {/* Ignore */}
          <button
            onClick={() => handleAction("ignored")}
            disabled={isProcessing}
            className="btn btn-circle btn-lg border-2 border-error/30 bg-error/5 hover:bg-error hover:border-error text-error hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-error/25"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Interested */}
          <button
            onClick={() => handleAction("interested")}
            disabled={isProcessing}
            className="btn btn-circle btn-lg border-2 border-success/30 bg-success/5 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:border-pink-500 text-success hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-pink-500/25"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
