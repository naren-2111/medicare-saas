const services = [
  { name: "Cardiology", desc: "Comprehensive heart care from diagnosis to surgery." },
  { name: "Orthopedics", desc: "Bone, joint, and muscle treatment and rehabilitation." },
  { name: "Pediatrics", desc: "Specialized care for infants, children, and adolescents." },
  { name: "General Medicine", desc: "Routine checkups, diagnosis, and treatment." },
  { name: "Emergency Care", desc: "24/7 emergency response and critical care." },
  { name: "Diagnostics & Lab", desc: "Advanced imaging and lab testing services." },
];

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.name} className="border rounded-xl p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
