export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">About CareWell Hospital</h1>
      <p className="text-gray-600 leading-relaxed">
        CareWell Hospital has been serving the community for over 20 years, providing
        compassionate, high-quality healthcare across more than 25 specialties. Our mission is
        to make excellent healthcare accessible, affordable, and convenient through technology
        and a patient-first approach.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {["Compassion", "Excellence", "Innovation"].map((v) => (
          <div key={v} className="p-6 border rounded-xl">
            <h3 className="font-semibold text-lg mb-2">{v}</h3>
            <p className="text-sm text-gray-600">
              We are committed to {v.toLowerCase()} in every interaction with our patients.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
