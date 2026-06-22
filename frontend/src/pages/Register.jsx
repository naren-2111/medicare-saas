import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      const path = user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/patient";
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full Name" className="w-full border rounded-md p-3"
          value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-md p-3"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone (e.g. 919876543210)" className="w-full border rounded-md p-3"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required type="password" placeholder="Password" className="w-full border rounded-md p-3"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full border rounded-md p-3" value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-primary-600 text-white p-3 rounded-md hover:bg-primary-700 disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-sm mt-4 text-gray-600">
        Already have an account? <Link to="/login" className="text-primary-700 font-medium">Login</Link>
      </p>
    </div>
  );
}
