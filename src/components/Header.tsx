'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, Cpu, Database, Globe } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Automata Theory',
      href: '/auto',
      icon: Cpu,
      submenu: [
        { name: 'Finite Automata (DFA)', href: '/auto/finite-automata/dfa' },
        { name: 'Context-Free Grammar Parser', href: '/auto/context-free-grammar/parser' },
        { name: 'Regular Expression Matcher', href: '/auto/regular-expressions/matcher' },
        { name: 'Turing Machine Simulator', href: '/auto/turing-machines/simulator' },
      ]
    },
    {
      name: 'Design & Analysis of Algorithms',
      href: '/daa',
      icon: BookOpen,
      submenu: [
        { name: 'Greedy Algorithms', href: '/daa/greedy' },
        { name: 'Dynamic Programming', href: '/daa/dynamic' },
        { name: 'Divide & Conquer', href: '/daa/divide-conquer' },
        { name: 'Backtracking', href: '/daa/backtracking' },
        { name: 'Branch & Bound', href: '/daa/branch-bound' },
      ]
    },
    {
      name: 'Operating Systems',
      href: '/os',
      icon: Database,
      submenu: [
        { name: 'CPU Scheduling', href: '/os/cpu-scheduling' },
        { name: 'Memory Allocation', href: '/os/memory-allocation' },
        { name: 'Deadlock Detection', href: '/os/deadlock' },
        { name: 'Synchronization', href: '/os/synchronization' },
        { name: 'Virtual Memory', href: '/os/virtual-memory' },
        { name: 'File Allocation', href: '/os/file-allocation' },
        { name: 'I/O Scheduling', href: '/os/io-scheduling' },
        { name: 'Disk Scheduling', href: '/os/disk' },
        { name: 'Page Replacement', href: '/os/page-replacement' },
      ]
    },
    {
      name: 'Computer Networks',
      href: '/cn',
      icon: Globe,
      submenu: [
        { name: 'Dijkstra Algorithm', href: '/cn/routing/dijkstra' },
        { name: 'IP Address Calculator', href: '/cn/ip-addressing/calculator' },
        { name: 'Huffman Encoding', href: '/cn/compression/huffman' },
        { name: 'Network Protocols', href: '/cn/protocols/tcp-flow' },
        { name: 'Network Security', href: '/cn/security/rsa' },
      ]
    }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AlgoMaster</h1>
              <p className="text-xs text-cyan-200">Engineering Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors duration-200 py-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="py-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 transition-all duration-200"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-cyan-300 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-blue-800">
            {navigation.map((item) => (
              <div key={item.name} className="mb-4">
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
                <div className="ml-7 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block text-cyan-200 hover:text-white transition-colors duration-200 py-1 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
