import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", appointment_date: "", appointment_time: "", reason: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [docRes, apptRes] = await Promise.all([api.get("/doctors"), api.get("/appointments/me")]);
    setDoctors(docRes.data);
    setAppointments(apptRes.data);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleBook(e) {
    e.preventDefault();
    setMessage("");
    try {
      const selectedDoctor = doctors.find((d) => d.id === form.doctor_id);
      await api.post("/appointments", { ...form, department_id: selectedDoctor?.departments?.id });
      setMessage("Appointment booked successfully! Confirmation sent via email & WhatsApp.");
      setForm({ doctor_id: "", appointment_date: "", appointment_time: "", reason: "" });
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.error || "Booking failed");
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter((a) => a.appointment_date >= today);
  const history = appointments.filter((a) => a.appointment_date < today);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.full_name}</h1>
      <p className="text-gray-500 mb-8">{user?.email}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Book an Appointment</h2>
          <form onSubmit={handleBook} className="space-y-3">
            <select required className="w-full border rounded-md p-3" value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.users?.full_name} — {d.specialization}</option>
              ))}
            </select>
            <input required type="date" min={today} className="w-full border rounded-md p-3"
              value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} />
            <input required type="time" className="w-full border rounded-md p-3"
              value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} />
            <textarea placeholder="Reason for visit" className="w-full border rounded-md p-3"
              value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            {message && <p className="text-sm text-primary-700">{message}</p>}
            <button className="w-full bg-primary-600 text-white p-3 rounded-md hover:bg-primary-700">
              Book Appointment
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Upcoming Appointments</h2>
          {loading ? <p>Loading...</p> : upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming appointments.</p>
          ) : (
            <div className="space-y-3 mb-8">
              {upcoming.map((a) => <AppointmentCard key={a.id} a={a} />)}
            </div>
          )}

          <h2 className="font-semibold text-lg mb-4">Appointment History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No past appointments.</p>
          ) : (
            <div className="space-y-3">
              {history.map((a) => <AppointmentCard key={a.id} a={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ a }) {
  return (
    <div className="border rounded-lg p-4 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">Dr. {a.doctors?.users?.full_name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{a.status}</span>
      </div>
      <p className="text-gray-500">{a.appointment_date} at {a.appointment_time}</p>
      {a.token_number && <p className="text-gray-500">Token: #{a.token_number}</p>}
      {a.consultation_notes && <p className="mt-1 text-gray-600">Notes: {a.consultation_notes}</p>}
    </div>
  );
}
