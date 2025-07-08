"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  BookOpen, 
  Database, 
  Globe, 
  Brain, 
  Zap, 
  Trophy, 
  CheckCircle, 
  Play, 
  Star, 
  Users, 
  Award,
  Code,
  MessageSquare,
  Sparkles,
  Clock,
  Shield,
  TrendingUp,
  Target
} from "lucide-react";

// Ad Components
const AdBanner = ({ slot, format = "horizontal" }: { slot: string; format?: "horizontal" | "vertical" | "square" }) => {
  const adStyles = {
    horizontal: "w-full h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300",
    vertical: "w-48 h-80 bg-gradient-to-b from-green-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300",
    square: "w-64 h-64 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-300"
  };

  return (
    <div className={adStyles[format]}>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-1">Advertisement</div>
        <div className="text-xs text-gray-500">AdSense - {slot}</div>
        <div className="text-xs text-gray-400 mt-1">
          {format === "horizontal" ? "728x90" : format === "vertical" ? "160x600" : "300x250"}
        </div>
      </div>
    </div>
  );
};

const SponsoredContent = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-purple-400">
      <div className="flex items-center mb-3">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <Star className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-900">Sponsored: Premium Algorithm Course</h3>
          <p className="text-sm text-purple-600">Master DSA for top tech companies</p>
        </div>
      </div>
      <div className="text-sm text-purple-700 mb-3">
        Get interview-ready with our comprehensive Data Structures & Algorithms course designed for FAANG preparation.
      </div>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
        Start Free Trial →
      </button>
    </div>
  );
};

export default function Home() {
  const features = [
    'Interactive Algorithm Visualizations',
    'Step-by-step Problem Solving', 
    'University Exam Preparation',
    'Real-time Simulations'
  ];

  const stats = [
    { number: '50+', label: 'Live Algorithms', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
    { number: '4', label: 'Core Subjects', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    // { number: '10K+', label: 'Happy Students', icon: Users, color: 'from-green-500 to-emerald-500' },
    { number: '100%', label: 'Free Forever', icon: Trophy, color: 'from-orange-500 to-red-500' }
  ];

  const subjects = [
    {
      title: 'Automata Theory',
      description: 'Master finite automata, context-free grammars, regular expressions, and Turing machines',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      href: '/auto',
      difficulty: 'Intermediate',
      examWeight: 'High',
      tools: ['DFA Simulator', 'CFG Parser', 'Regex Matcher', 'Turing Machine'],
      stats: { algorithms: '15+', coverage: '100%' }
    },
    {
      title: 'Algorithm Design & Analysis',
      description: 'Greedy, dynamic programming, divide & conquer, backtracking, and branch & bound',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-500',
      href: '/daa',
      difficulty: 'Advanced',
      examWeight: 'Very High',
      tools: ['Knapsack Solver', 'MST Algorithms', 'Sorting Visualizer', 'DP Solutions'],
      stats: { algorithms: '25+', coverage: '100%' }
    },
    {
      title: 'Operating Systems',
      description: 'Process scheduling, memory management, disk algorithms, and synchronization',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      href: '/os',
      difficulty: 'Intermediate',
      examWeight: 'High',
      tools: ['CPU Scheduling', 'Disk Scheduling', 'Page Replacement', 'Deadlock Detection'],
      stats: { algorithms: '20+', coverage: '100%' }
    },
    {
      title: 'Computer Networks',
      description: 'Routing protocols, IP addressing, network security, and data compression',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      href: '/cn',
      difficulty: 'Advanced',
      examWeight: 'High',
      tools: ['Dijkstra Router', 'IP Calculator', 'Huffman Encoder', 'Security Protocols'],
      stats: { algorithms: '15+', coverage: '100%' }
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getExamWeightColor = (weight: string) => {
    switch (weight) {
      case "Very High": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
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
                India's #1 Engineering Algorithm Platform
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Master Computer Science
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Algorithms & Ace Your Exams!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Interactive algorithm simulators trusted by <span className="text-cyan-400 font-bold">10,000+ engineering students</span> across India! 
                Master Automata Theory, Algorithm Design, Operating Systems, and Computer Networks with 
                <span className="text-yellow-400 font-bold"> step-by-step visual learning</span>.
              </p>
              
              {/* Urgency/Excitement Banner */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg border border-red-400/30">
            
                <p className="text-white">
                  🎯 Perfect for VTU, AKTU & all Indian engineering curricula
                </p>
              </div>
            </div>

            {/* Feature List */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white text-sm font-medium">{feature}</span>
                </div>
              ))}
              {/* Special highlight badge */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/40">
              
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="#subjects"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Explore Subjects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl mb-3 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
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

      {/* Urgency/FOMO Section
      <section className="py-16 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="animate-bounce mb-4">
              <TrendingUp className="h-16 w-16 mx-auto text-yellow-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
               Don't Get Left Behind This Semester! 
            </h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto">
              While your classmates struggle with traditional textbooks, you can master algorithms 10x faster with our interactive simulators!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-yellow-300">📈 95%</div>
                <div className="text-sm">Students see grade improvement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-green-300">⚡ 5x</div>
                <div className="text-sm">Faster concept understanding</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold text-cyan-300">🎯 100%</div>
                <div className="text-sm">Exam syllabus coverage</div>
              </div>
            </div>

            <div className="bg-yellow-400 text-gray-900 rounded-lg p-4 mb-6 font-bold text-lg animate-pulse">
              🔥 HOT: 2,000+ students used AlgoMaster to ace their last semester exams!
            </div>

            <Link
              href="#subjects"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg"
            >
              🚀 Start Dominating Your Algorithms Now!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* Attention-Grabbing Alert Banner */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <div className="animate-pulse mr-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="font-bold text-lg">
              🚀 NEW: 50+ Algorithm Simulators Now Live! Perfect for Your Upcoming Exams! 
              <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">100% Free</span>
            </p>
            <div className="animate-pulse ml-3">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner slot="home-top-banner" format="horizontal" />
      </div>

      {/* Subjects Section */}
      <section id="subjects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Core Engineering Subjects
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete Computer Science
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Algorithm Library
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master every essential computer science subject with interactive tools, step-by-step explanations, and exam-focused content.
            </p>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${subject.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <subject.icon className="h-8 w-8" />
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subject.difficulty)}`}>
                        {subject.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamWeightColor(subject.examWeight)}`}>
                        {subject.examWeight} Weight
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{subject.title}</h3>
                  <p className="text-white/90">{subject.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Popular Tools */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-600" />
                      Popular Tools
                    </h4>
                    <div className="space-y-2">
                      {subject.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          <span className="text-sm font-medium text-gray-700">{tool}</span>
                          <Play className="h-4 w-4 text-blue-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-blue-700">{subject.stats.algorithms}</div>
                        <div className="text-gray-600">Algorithms</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-700">{subject.stats.coverage}</div>
                        <div className="text-gray-600">Coverage</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={subject.href}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                  >
                    Explore {subject.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-Content Sponsored Section */}
          <div className="mb-16">
            <SponsoredContent />
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 mb-16 text-white overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-300 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              🚀 EXCITING NEWS: More Subjects Coming Soon!
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🎯 Expand Your Knowledge Arsenal!
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're working hard to bring you even more subjects to master your engineering journey. 
              <span className="text-cyan-400 font-bold"> Be the first to access these when they launch!</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Compiler Design */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-cyan-300">Compiler Design</h3>
              <p className="text-sm text-gray-300 mb-3">
                Lexical analysis, parsing, code generation, and optimization techniques
              </p>
             
            </div>

            {/* Data Warehousing & Mining */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-purple-300">Data Warehousing & Mining</h3>
              <p className="text-sm text-gray-300 mb-3">
                ETL processes, data mining algorithms, OLAP, and business intelligence
              </p>
      
            </div>

            {/* Machine Learning */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-green-300">Machine Learning</h3>
              <p className="text-sm text-gray-300 mb-3">
                Supervised/unsupervised learning, neural networks, and AI algorithms
              </p>

            </div>

            {/* Software Engineering */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-orange-300">Software Engineering</h3>
              <p className="text-sm text-gray-300 mb-3">
                SDLC models, project management, testing, and software metrics
              </p>
              
            </div>
          </div>

          {/* Call to action for early access
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                🎉 Get Early Access & Special Perks!
              </h3>
              <p className="text-gray-300 mb-4">
                Join our waitlist to be notified when these subjects launch + get exclusive early access!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
                >
                  🚀 Join Waitlist (Free)
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose AlgoMaster?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built by engineering students, for engineering students. We understand the challenges of learning complex algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
              <p className="text-gray-600">
                Watch algorithms execute step-by-step with real-time visualizations and interactive controls.
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exam Focused</h3>
              <p className="text-gray-600">
                Content specifically designed for university exams with practice problems and solutions.
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Always Free</h3>
              <p className="text-gray-600">
                Core educational content remains free for all students. No hidden costs or subscriptions.
              </p>
            </div>
          </div>

          {/* Sidebar Ad */}
          <div className="flex justify-center mb-8">
            <AdBanner slot="home-sidebar" format="square" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="animate-bounce mb-6">
              <Sparkles className="h-20 w-20 mx-auto text-yellow-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🎯 Your Algorithm Mastery Journey Starts NOW!
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-6">
              Join <span className="text-cyan-400 font-bold">successful students</span> who transformed their CS journey with AlgoMaster. 
              Don't let another semester pass struggling with algorithms!
            </p>
            
            {/* Urgency bar */}
            
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link
              href="#subjects"
              className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 text-lg"
            >
              🚀 Start Mastering Algorithms NOW!
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-200" />
            </Link>
            
          </div>

          {/* Benefits reminder */}
          

          <div className="text-lg text-gray-400">
            🔥 <span className="text-yellow-400 font-bold">TRENDING:</span> Most students see grade improvement within 2 weeks! • 
            <span className="text-green-400 font-bold">100% Free</span> • No Hidden Costs • 
            <span className="text-cyan-400 font-bold">University Focused</span>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
            <div className="text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">
                Need Help Getting Started?
              </h2>
              <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
                Have questions about algorithms, need study guidance, or want to request new features? 
                Our team is here to support your learning journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
                >
                  Contact Support →
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Important Information
              </h2>
              <p className="text-gray-600">
                Access essential information about our platform and policies
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/privacy"
                className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-blue-600 font-medium">Privacy Policy</div>
                <div className="text-xs text-blue-500 mt-1">Data protection & cookies</div>
              </Link>
              <Link
                href="/terms"
                className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
              >
                <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-green-600 font-medium">Terms of Service</div>
                <div className="text-xs text-green-500 mt-1">Usage terms & conditions</div>
              </Link>
              <Link
                href="/about"
                className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
              >
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-purple-600 font-medium">About Us</div>
                <div className="text-xs text-purple-500 mt-1">Our mission & team</div>
              </Link>
              <Link
                href="/contact"
                className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
              >
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-orange-600 font-medium">Contact</div>
                <div className="text-xs text-orange-500 mt-1">Get support & feedback</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AdBanner slot="home-bottom-banner" format="horizontal" />
      </div>
    </div>
  );
}
