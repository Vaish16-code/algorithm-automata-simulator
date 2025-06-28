import Link from 'next/link';
import { Github, Mail, Heart, Cpu } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    subjects: [
      { name: 'Automata Theory', href: '/auto' },
      { name: 'Algorithm Design', href: '/daa' },
      { name: 'Operating Systems', href: '/os' },
    ],
    algorithms: [
      { name: 'Finite Automata', href: '/auto/finite-automata/dfa' },
      { name: 'Greedy Algorithms', href: '/daa/greedy' },
      { name: 'Dynamic Programming', href: '/daa/dynamic/knapsack' },
      { name: 'Disk Scheduling', href: '/os/disk' },
    ],
    resources: [
      { name: 'About Project', href: '#about' },
      { name: 'Collaboration', href: '#collaboration' },
      { name: 'Documentation', href: '#docs' },
    ]
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AlgoMaster</h2>
                <p className="text-xs text-cyan-200">Engineering Solutions</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Empowering engineering students with interactive algorithm simulations and problem-solving tools across multiple computer science domains.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Subjects</h3>
            <ul className="space-y-2">
              {footerLinks.subjects.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Algorithms */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Popular Tools</h3>
            <ul className="space-y-2">
              {footerLinks.algorithms.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AlgoMaster. Built for engineering students with{' '}
              <Heart className="inline h-4 w-4 text-red-500" /> and dedication.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
