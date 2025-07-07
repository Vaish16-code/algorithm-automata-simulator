import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About AlgoMaster
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering engineering students with interactive algorithm learning tools designed specifically for Indian universities.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            To make complex computer science algorithms accessible and understandable for every engineering student in India. 
            We believe that quality education should be free and available to all students who want to excel in their studies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student-Focused</h3>
              <p className="text-gray-600">Built by students, for students. We understand the challenges of learning algorithms.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">University Aligned</h3>
              <p className="text-gray-600">Content specifically designed for Mumbai University and other Indian engineering curricula.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600">Core educational content will always remain free for all students.</p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                AlgoMaster was born out of frustration. As computer engineering students, we struggled to find quality resources that explained algorithms in a way that matched our university syllabus. Most available content was either too theoretical or not aligned with Indian university patterns.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We decided to create the resource we wished we had - interactive algorithm visualizations with step-by-step explanations, designed specifically for students preparing for exams and interviews.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, AlgoMaster helps thousands of engineering students across India understand complex algorithms through visual learning and interactive simulations.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">5000+ students helped</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">50+ interactive algorithm tools</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">4 core CS subjects covered</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">100% exam-focused content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Meet the Team</h2>
          <p className="text-center text-gray-600 mb-8">
            We're a team of passionate engineering students and developers committed to making algorithm learning accessible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                Y
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Yash</h3>
              <p className="text-gray-600 mb-2">Co-Founder & Lead Developer</p>
              <p className="text-sm text-gray-500">Information Technology  Student</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                F
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vasihnavi</h3>
              <p className="text-gray-600 mb-2">Co-Founder & Algorithm Expert</p>
              <p className="text-sm text-gray-500">Computer Engineering Student</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">contact@algomaster.com</p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-green-400" />
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-gray-300">Mumbai, India</p>
            </div>
            
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-purple-400" />
              <h3 className="font-bold mb-2">Support</h3>
              <p className="text-gray-300">Available 24/7</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
