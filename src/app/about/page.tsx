import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AlgoMaster - Mission, Team & Vision | Interactive Algorithm Learning",
  description: "Learn about AlgoMaster's mission to make quality computer science education accessible to all engineering students in India. Our story, team, and commitment to free algorithm learning.",
  keywords: [
    "about AlgoMaster",
    "algorithm learning platform",
    "engineering education",
    "computer science education", 
    "free learning resources",
    "educational technology",
    "student empowerment",
    "algorithm visualization",
    "interactive learning",
    "engineering students India",
    "CS education accessibility",
    "learning platform mission",
    "educational innovation",
    "student success"
  ],
  openGraph: {
    title: "About AlgoMaster - Interactive Algorithm Learning Platform",
    description: "Empowering engineering students with free, interactive algorithm learning tools. Learn our mission and commitment to education.",
    url: "https://algomaster.dev/about",
    siteName: "AlgoMaster",
    type: "website",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About AlgoMaster - Educational Mission"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About AlgoMaster - Interactive Algorithm Learning Platform",
    description: "Learn about our mission to make CS education accessible to all engineering students.",
    images: ["/og-about.jpg"]
  },
  alternates: {
    canonical: "https://algomaster.dev/about"
  }
};

import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, Globe, Users, Linkedin, ExternalLink, Code, Sparkles, Brain } from 'lucide-react';

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
              <p className="text-gray-600">Content specifically designed for Indian engineering curricula and university courses.</p>
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
                Today, AlgoMaster aims to help engineering students across India understand complex algorithms through visual learning and interactive simulations.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Algorithm visualizations</span>
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
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meet the Team
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're passionate engineering students and developers committed to making algorithm learning accessible and engaging for everyone.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Yash */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-28 h-28 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    Y
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:animate-bounce">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Yash Jadhav</h3>
                <div className="flex items-center justify-center mb-3">
                  <Code className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-blue-600 font-semibold">Co-Founder & Lead Developer</p>
                </div>
                <p className="text-gray-600 mb-4">Information Technology Student</p>
                <p className="text-sm text-gray-500 mb-6">Passionate about creating interactive learning experiences and algorithm visualization</p>
                
                <a 
                  href="https://www.linkedin.com/in/yash-jadhav-a8a02426b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  Connect on LinkedIn
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
            
            {/* Vaishnavi */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 w-28 h-28 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    V
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center group-hover:animate-bounce">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaishnavi Sawant</h3>
                <div className="flex items-center justify-center mb-3">
                  <Brain className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-600 font-semibold">Co-Founder & Algorithm Expert</p>
                </div>
                <p className="text-gray-600 mb-4">Computer Engineering Student</p>
                <p className="text-sm text-gray-500 mb-6">Expert in algorithm analysis and passionate about making complex concepts simple</p>
                
                <a 
                  href="https://www.linkedin.com/in/vaishnavi-sawant-38a547289/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  Connect on LinkedIn
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Team Stats */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">Our Combined Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">5+</div>
                <div className="text-sm text-gray-300">Years Combined Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-sm text-gray-300">Algorithms Implemented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">4</div>
                <div className="text-sm text-gray-300">Core CS Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">∞</div>
                <div className="text-sm text-gray-300">Passion for Learning</div>
              </div>
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
              <p className="text-gray-300">help.algomaster@gmail.com</p>
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
