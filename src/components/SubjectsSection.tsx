'use client';

import Link from 'next/link';
import { Cpu, BookOpen, Database, ArrowRight, Play, Code, GitBranch, Layers, HardDrive, Brain, Shuffle, Globe, Network, Shield } from 'lucide-react';

export default function SubjectsSection() {
  const subjects = [
    {
      title: 'Automata Theory',
      description: 'Explore finite automata, context-free grammars, regular expressions, and Turing machines with interactive visualizations.',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      href: '/auto',
      algorithms: [
        { name: 'Finite Automata (DFA)', href: '/auto/finite-automata/dfa', icon: GitBranch },
        { name: 'Context-Free Grammar', href: '/auto/context-free-grammar/parser', icon: Code },
        { name: 'Regular Expressions', href: '/auto/regular-expressions/matcher', icon: Layers },
        { name: 'Turing Machines', href: '/auto/turing-machines/simulator', icon: Cpu }
      ],
      stats: { algorithms: 4, problems: '15+' }
    },
    {
      title: 'Design & Analysis of Algorithms',
      description: 'Master algorithmic paradigms including greedy, dynamic programming, divide & conquer, and backtracking approaches.',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      href: '/daa',
      algorithms: [
        { name: 'Greedy Algorithms', href: '/daa/greedy', icon: Shuffle },
        { name: 'Dynamic Programming', href: '/daa/dynamic/knapsack', icon: Brain },
        { name: 'Divide & Conquer', href: '/daa/divide-conquer/merge-sort', icon: GitBranch },
        { name: 'Backtracking', href: '/daa/backtracking/n-queens', icon: ArrowRight }
      ],
      stats: { algorithms: 7, problems: '20+' }
    },
    {
      title: 'Operating Systems',
      description: 'Understand OS concepts through disk scheduling algorithms, page replacement strategies, and process management.',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      href: '/os',
      algorithms: [
        { name: 'Disk Scheduling', href: '/os/disk', icon: HardDrive },
        { name: 'Page Replacement', href: '/os/page-replacement', icon: Layers }
      ],
      stats: { algorithms: 4, problems: '12+' }
    },
    {
      title: 'Computer Networks',
      description: 'Master networking concepts including routing algorithms, IP addressing, protocols, and network security.',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      href: '/cn',
      algorithms: [
        { name: 'Dijkstra Algorithm', href: '/cn/routing/dijkstra', icon: Network },
        { name: 'IP Addressing', href: '/cn/ip-addressing/calculator', icon: Globe },
        { name: 'Huffman Encoding', href: '/cn/compression/huffman', icon: Code },
        { name: 'Network Protocols', href: '/cn/protocols/tcp-flow', icon: Shield }
      ],
      stats: { algorithms: 6, problems: '25+' }
    }
  ];

  return (
    <section id="subjects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Engineering Subjects
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Master Core Computer Science
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Subjects
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive interactive tools covering the essential subjects every computer science engineering student needs to master.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
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
                  <div className="text-right">
                    <div className="text-sm opacity-90">{subject.stats.algorithms} Tools</div>
                    <div className="text-sm opacity-90">{subject.stats.problems} Problems</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{subject.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{subject.description}</p>
              </div>

              {/* Algorithms List */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {subject.algorithms.map((algorithm, algIndex) => (
                    <Link
                      key={algIndex}
                      href={algorithm.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group/item"
                    >
                      <div className={`bg-gradient-to-r ${subject.color} p-2 rounded-lg`}>
                        <algorithm.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium group-hover/item:text-gray-900">
                        {algorithm.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover/item:text-gray-600 group-hover/item:translate-x-1 transition-all duration-200" />
                    </Link>
                  ))}
                </div>

                {/* Explore Button */}
                <Link
                  href={subject.href}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${subject.color} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-200 group`}
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Explore {subject.title.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Choose any subject above and start exploring interactive algorithm simulations. 
              Each tool provides step-by-step explanations and real-time visualizations.
            </p>
            <Link
              href="/auto"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
            >
              Start with Automata Theory
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
