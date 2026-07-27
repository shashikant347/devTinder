import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Signup = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/user/signin", form);
      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-content/5 relative z-10">
        <div className="card-body p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-outfit font-bold">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Dev
              </span>
              <span className="text-base-content">Tinder</span>
              <span className="ml-1">🔥</span>
            </h1>
            <p className="text-base-content/50 mt-2 text-sm">
              Join the developer community
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error alert-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Name row */}
            <div className="flex gap-3 mb-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text text-base-content/70 text-sm font-medium">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="John"
                  className="input input-bordered bg-base-200/50 focus:border-primary/50 transition-colors w-full"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  id="signup-firstname"
                />
              </div>
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text text-base-content/70 text-sm font-medium">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  className="input input-bordered bg-base-200/50 focus:border-primary/50 transition-colors w-full"
                  value={form.lastname}
                  onChange={handleChange}
                  id="signup-lastname"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base-content/70 text-sm font-medium">
                  Email
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200/50 focus-within:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  type="email"
                  name="emailId"
                  placeholder="you@example.com"
                  className="grow bg-transparent"
                  value={form.emailId}
                  onChange={handleChange}
                  required
                  id="signup-email"
                />
              </label>
            </div>

            {/* Password */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-base-content/70 text-sm font-medium">
                  Password
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200/50 focus-within:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="grow bg-transparent"
                  value={form.password}
                  onChange={handleChange}
                  required
                  id="signup-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-base-content/40 hover:text-base-content/70 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-500/20"
              id="signup-submit"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="divider text-base-content/30 text-xs">OR</div>

          <p className="text-center text-sm text-base-content/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
