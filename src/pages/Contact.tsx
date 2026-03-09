import React, { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SOCIAL_LINKS } from "@/lib/constants";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Create mailto link with form data
    const mailtoLink = `mailto:support@geotech4all.com?subject=${encodeURIComponent(formData.subject || 'Website Contact Form')}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.open(mailtoLink, '_blank');

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with the message. Please click send to deliver your message.",
      duration: 5000,
    });

    setIsSending(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-geotech-black" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1426604966848-d7adac402bff')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container-wide text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with our team for inquiries, collaborations, or to discuss your geoscience needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We'd love to hear from you. Whether you have a question about our services,
                need a consultation, or want to explore collaboration opportunities,
                our team is here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-geotech-red rounded-full p-3 text-white mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Our Locations</h3>
                    <p className="text-gray-600">Lagos, Nigeria</p>
                    <p className="text-gray-600">London, United Kingdom</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-geotech-red rounded-full p-3 text-white mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-geotech-red transition-colors">
                        {SOCIAL_LINKS.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-geotech-red rounded-full p-3 text-white mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">
                      <a href={`tel:${SOCIAL_LINKS.phone}`} className="hover:text-geotech-red transition-colors">
                        {SOCIAL_LINKS.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-geotech-gray p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-geotech-red"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-geotech-red"
                      placeholder="Your email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-geotech-red"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Service Question">Service Question</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Training Request">Training Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-geotech-red"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isSending ? "Opening Email..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
