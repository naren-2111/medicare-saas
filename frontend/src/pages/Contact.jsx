export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-gray-600 mb-2">📍 123 Health Street, Gurugram, Haryana, India</p>
          <p className="text-gray-600 mb-2">📞 +91 98765 43210</p>
          <p className="text-gray-600 mb-2">✉️ info@carewellhospital.com</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full border rounded-md p-3" placeholder="Your Name" />
          <input className="w-full border rounded-md p-3" placeholder="Email" type="email" />
          <textarea className="w-full border rounded-md p-3" rows="4" placeholder="Message" />
          <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
