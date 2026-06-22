import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor" : "/patient";

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl text-primary-700">CareWell Hospital</Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-primary-700">Dashboard</Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium">Login</Link>
              <Link to="/register" className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700">
                Book Appointment
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
