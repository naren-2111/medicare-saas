import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="bg-primary-50">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Quality Healthcare, <span className="text-primary-700">Anytime You Need It</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Book appointments with expert doctors, manage your medical records, and get care
              from a hospital that puts patients first.
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/register" className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700">
                Book an Appointment
              </Link>
              <Link to="/doctors" className="border border-primary-600 text-primary-700 px-6 py-3 rounded-md font-medium hover:bg-primary-50">
                Find a Doctor
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <Stat number="25+" label="Departments" />
              <Stat number="150+" label="Doctors" />
              <Stat number="50k+" label="Patients Treated" />
              <Stat number="24/7" label="Emergency Care" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Why Choose CareWell</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature title="Expert Doctors" desc="Highly qualified specialists across every department." />
          <Feature title="Easy Booking" desc="Book appointments online in under a minute, anytime." />
          <Feature title="Digital Records" desc="Access your medical history and prescriptions securely." />
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary-700">{number}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
