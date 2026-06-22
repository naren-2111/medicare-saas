import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const path = user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/patient";
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required placeholder="Email" className="w-full border rounded-md p-3"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password" required placeholder="Password" className="w-full border rounded-md p-3"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-primary-600 text-white p-3 rounded-md hover:bg-primary-700 disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm mt-4 text-gray-600">
        No account? <Link to="/register" className="text-primary-700 font-medium">Register</Link>
      </p>
    </div>
  );
}
