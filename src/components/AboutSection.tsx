'use client';

import { Target, Users, Code, Lightbulb, BookOpen, Zap } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: Target,
      title: 'Problem-Focused Learning',
      description: 'Each tool is designed to solve real engineering problems and help you understand complex algorithms through practical implementation.'
    },
    {
      icon: Code,
      title: 'Interactive Simulations',
      description: 'Step-by-step visualizations that show exactly how algorithms work, making abstract concepts concrete and understandable.'
    },
    {
      icon: Users,
      title: 'Built by Students',
      description: 'Created by engineering students who understand the challenges of learning complex computer science concepts.'
    },
    {
      icon: Lightbulb,
      title: 'Instant Understanding',
      description: 'Visual feedback and real-time results help you grasp algorithmic concepts faster than traditional learning methods.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Coverage',
      description: 'Covers essential topics from multiple engineering subjects with practical examples and use cases.'
    },
    {
      icon: Zap,
      title: 'Always Free',
      description: 'Complete access to all tools and simulations at no cost. Education should be accessible to every engineering student.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Students Helped' },
    { number: '15+', label: 'Algorithm Tools' },
    { number: '3', label: 'Core Subjects' },
    { number: '100%', label: 'Success Rate' }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 text-sm font-medium mb-6">
            <Target className="h-4 w-4 mr-2" />
            About AlgoMaster
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              AlgoMaster?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re dedicated to making complex computer science concepts accessible and engaging for every engineering student through interactive learning.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              To empower every engineering student with the tools and knowledge they need to excel in computer science. 
              We believe that complex algorithms become simple when visualized properly, and that every student deserves 
              access to high-quality, interactive learning resources.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">Learn</div>
                <div className="text-gray-600">Through interactive visualizations</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">Practice</div>
                <div className="text-gray-600">With real-world problems</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">Excel</div>
                <div className="text-gray-600">In your engineering journey</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
