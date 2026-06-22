import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tab, setTab] = useState("appointments");

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/appointments").then((res) => setAppointments(res.data));
    api.get("/admin/doctors").then((res) => setDoctors(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Patients" value={stats?.totalPatients ?? "—"} />
        <StatCard label="Total Doctors" value={stats?.totalDoctors ?? "—"} />
        <StatCard label="Total Appointments" value={stats?.totalAppointments ?? "—"} />
      </div>

      <div className="flex gap-4 mb-6 border-b">
        {["appointments", "doctors"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 font-medium text-sm capitalize ${tab === t ? "border-b-2 border-primary-600 text-primary-700" : "text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "appointments" ? (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Patient</th><th className="p-3">Doctor</th>
                <th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.patients?.users?.full_name}</td>
                  <td className="p-3">Dr. {a.doctors?.users?.full_name}</td>
                  <td className="p-3">{a.appointment_date}</td>
                  <td className="p-3">{a.appointment_time}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {doctors.map((d) => (
            <div key={d.id} className="border rounded-xl p-4">
              <p className="font-medium">Dr. {d.users?.full_name}</p>
              <p className="text-sm text-gray-500">{d.specialization} · {d.departments?.name}</p>
              <p className="text-sm text-gray-500">{d.users?.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-xl p-6 text-center">
      <div className="text-3xl font-bold text-primary-700">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
