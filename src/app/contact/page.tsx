"use client";

import { Mail, MessageSquare, MapPin, Phone, Send, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Message sent successfully!'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300 text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                AlgoMaster
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Have questions about our algorithms, found a bug, or want to contribute? 
              We'd love to hear from you and help improve your learning experience.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="bug-report">Bug Report</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="algorithm-question">Algorithm Question</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="partnership">Partnership/Collaboration</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your inquiry in detail..."
                  required
                />
              </div>

              {/* Status Message */}
              {submitStatus.type && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {submitStatus.type === 'success' ? (
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{submitStatus.message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">help.algomaster@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <p className="text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
              <div className="grid grid-cols-3 gap-4">
                <a 
                  href="#" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Github className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </a>
                <a 
                  href="#" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Linkedin className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </a>
                <a 
                  href="#" 
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Twitter className="h-8 w-8 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </a>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-l-4 border-yellow-400">
              <h2 className="text-xl font-bold text-yellow-900 mb-4">Quick Help</h2>
              <div className="space-y-3 text-sm text-yellow-800">
                <p><strong>🔧 Technical Issues:</strong> Describe the algorithm, input data, and expected vs actual output</p>
                <p><strong>📚 Algorithm Questions:</strong> Let us know which subject and specific topic you need help with</p>
                <p><strong>💡 Feature Requests:</strong> Explain the feature, its educational value, and target audience</p>
                <p><strong>🐛 Bug Reports:</strong> Include browser, device, and steps to reproduce the issue</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How accurate are the algorithm implementations?</h3>
              <p className="text-gray-600 text-sm mb-4">
                All algorithms are implemented following standard academic references and tested extensively. 
                We ensure correctness for educational purposes and exam preparation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I request new algorithms or features?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Absolutely! We're always looking to expand our algorithm library. 
                Send us your requests through the contact form above.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is the platform free to use?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, our core features are free. We support the platform through ads and optional premium features 
                for advanced users and institutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How can I contribute to the project?</h3>
              <p className="text-gray-600 text-sm mb-4">
                We welcome contributions! You can help by reporting bugs, suggesting improvements, 
                or even contributing code if you're a developer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
