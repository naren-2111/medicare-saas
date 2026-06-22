export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">CareWell Hospital</h3>
          <p>Multi-specialty healthcare you can trust. Quality care, every time.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Contact</h3>
          <p>+91 98765 43210</p>
          <p>info@carewellhospital.com</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Address</h3>
          <p>123 Health Street, Gurugram, Haryana, India</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-800">
        © {new Date().getFullYear()} CareWell Hospital. All rights reserved.
      </div>
    </footer>
  );
}
