import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import api from "../utils/api";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    about: user?.about || "",
    age: user?.age || "",
    gender: user?.gender || "",
    photoUrl: user?.photoUrl || "",
    skills: user?.skills?.join(", ") || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        about: form.about,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        photoUrl: form.photoUrl || undefined,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      // Remove undefined values
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const res = await api.patch("/user/update", payload);
      if (res.data.success) {
        dispatch(setUser(res.data.data));
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile"
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const previewSkills = form.skills
    ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-outfit font-bold text-base-content mb-8">
          Edit{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Profile
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card bg-base-100/80 backdrop-blur-sm border border-base-content/5 shadow-xl">
            <div className="card-body">
              {/* Alerts */}
              {success && (
                <div className="alert alert-success alert-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm">{success}</span>
                </div>
              )}
              {error && (
                <div className="alert alert-error alert-sm">
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Photo URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-base-content/70">
                      Photo URL
                    </span>
                  </label>
                  <input
                    type="url"
                    name="photoUrl"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered bg-base-200/50 focus:border-primary/50 w-full"
                    value={form.photoUrl}
                    onChange={handleChange}
                    id="profile-photo"
                  />
                </div>

                {/* About */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-base-content/70">
                      About
                    </span>
                  </label>
                  <textarea
                    name="about"
                    placeholder="Tell devs about yourself..."
                    className="textarea textarea-bordered bg-base-200/50 focus:border-primary/50 h-24 resize-none"
                    value={form.about}
                    onChange={handleChange}
                    id="profile-about"
                  ></textarea>
                </div>

                {/* Age + Gender */}
                <div className="flex gap-4">
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text text-sm font-medium text-base-content/70">
                        Age
                      </span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="18"
                      max="100"
                      placeholder="25"
                      className="input input-bordered bg-base-200/50 focus:border-primary/50 w-full"
                      value={form.age}
                      onChange={handleChange}
                      id="profile-age"
                    />
                  </div>
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text text-sm font-medium text-base-content/70">
                        Gender
                      </span>
                    </label>
                    <select
                      name="gender"
                      className="select select-bordered bg-base-200/50 focus:border-primary/50 w-full"
                      value={form.gender}
                      onChange={handleChange}
                      id="profile-gender"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-base-content/70">
                      Skills
                    </span>
                    <span className="label-text-alt text-base-content/40">
                      comma separated
                    </span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="React, Node.js, Python"
                    className="input input-bordered bg-base-200/50 focus:border-primary/50 w-full"
                    value={form.skills}
                    onChange={handleChange}
                    id="profile-skills"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-500/20 mt-2"
                  id="profile-save"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-base-content/50 mb-4 uppercase tracking-wider">
              Live Preview
            </h3>
            <div className="card w-80 bg-base-100 shadow-2xl overflow-hidden border border-base-content/5">
              <figure className="relative h-72">
                <img
                  src={
                    form.photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://geographyandyou.com/images/user-profile.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-xl font-outfit font-bold text-base-content">
                    {user?.firstname} {user?.lastname}
                    {form.age && (
                      <span className="text-base font-normal text-base-content/60 ml-2">
                        {form.age}
                      </span>
                    )}
                  </h2>
                  {form.gender && (
                    <span className="badge badge-sm badge-outline badge-primary mt-1 capitalize">
                      {form.gender}
                    </span>
                  )}
                </div>
              </figure>
              <div className="card-body p-5 pt-2">
                {form.about && (
                  <p className="text-sm text-base-content/60 line-clamp-2">
                    {form.about}
                  </p>
                )}
                {previewSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {previewSkills.slice(0, 5).map((skill, i) => (
                      <span
                        key={i}
                        className="badge badge-sm bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-primary border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
