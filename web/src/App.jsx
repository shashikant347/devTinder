import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";

function App() {
  return (
    <div data-theme="dark" className="min-h-screen flex flex-col bg-base-200">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Feed />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Profile />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/connections"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Connections />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/requests"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Requests />
                </main>
                <Footer />
              </>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
