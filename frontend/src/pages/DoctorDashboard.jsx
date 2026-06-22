import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("today");
  const [today, setToday] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notesDraft, setNotesDraft] = useState({});
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [todayRes, patientsRes] = await Promise.all([
      api.get("/appointments/doctor/today"),
      api.get("/appointments/doctor/patients"),
    ]);
    setToday(todayRes.data);
    setPatients(patientsRes.data);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function saveNotes(id) {
    const notes = notesDraft[id];
    await api.patch(`/appointments/${id}/notes`, { consultation_notes: notes, status: "completed" });
    loadData();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Dr. {user?.full_name}</h1>
      <p className="text-gray-500 mb-6">{user?.email}</p>

      <div className="flex gap-4 mb-6 border-b">
        {["today", "patients"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 font-medium text-sm ${tab === t ? "border-b-2 border-primary-600 text-primary-700" : "text-gray-500"}`}>
            {t === "today" ? "Today's Appointments" : "Patient List"}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : tab === "today" ? (
        <div className="space-y-4">
          {today.length === 0 && <p className="text-gray-500 text-sm">No appointments today.</p>}
          {today.map((a) => (
            <div key={a.id} className="border rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{a.patients?.users?.full_name}</p>
                  <p className="text-sm text-gray-500">{a.appointment_time} · Token #{a.token_number}</p>
                  <p className="text-sm text-gray-500">{a.patients?.users?.email} · {a.patients?.users?.phone}</p>
                  <p className="text-sm mt-1">Reason: {a.reason || "—"}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{a.status}</span>
              </div>
              <textarea
                placeholder="Consultation notes..."
                className="w-full border rounded-md p-3 mt-3 text-sm"
                defaultValue={a.consultation_notes || ""}
                onChange={(e) => setNotesDraft({ ...notesDraft, [a.id]: e.target.value })}
              />
              <button onClick={() => saveNotes(a.id)} className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700">
                Save & Mark Completed
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {patients.length === 0 && <p className="text-gray-500 text-sm">No patients yet.</p>}
          {patients.map((p) => (
            <div key={p.id} className="border rounded-xl p-4">
              <p className="font-medium">{p.users?.full_name}</p>
              <p className="text-sm text-gray-500">{p.users?.email}</p>
              <p className="text-sm text-gray-500">{p.users?.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
