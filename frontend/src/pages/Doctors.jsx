import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/doctors").then((res) => setDoctors(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-gray-500">No doctors listed yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-lg">Dr. {doc.users?.full_name}</h3>
              <p className="text-primary-700 text-sm">{doc.specialization}</p>
              <p className="text-sm text-gray-500 mt-1">{doc.departments?.name}</p>
              <p className="text-sm text-gray-600 mt-2">{doc.qualification} · {doc.experience_years || 0} yrs exp</p>
              <p className="text-sm font-medium mt-2">Fee: ₹{doc.consultation_fee}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
