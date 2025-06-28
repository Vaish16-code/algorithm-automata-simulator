'use client';

import Link from 'next/link';
import { ArrowRight, Cpu, BookOpen, Brain, Zap, Trophy, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const features = [
    'Interactive Algorithm Visualizations',
    'Step-by-step Problem Solving',
    'Multiple Engineering Subjects',
    'Real-time Simulations'
  ];

  const stats = [
    { number: '15+', label: 'Algorithms', icon: Cpu },
    { number: '3', label: 'Subjects', icon: BookOpen },
    { number: '50+', label: 'Problems', icon: Brain },
    { number: '100%', label: 'Free Access', icon: Trophy }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Engineering Algorithm Simulator
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master Algorithms
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Ace Your Engineering
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Interactive simulations and visualizations for Automata Theory, Algorithm Design, 
              and Operating Systems. Built by students, for students.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="#subjects"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Explore Algorithms
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
