"use client";

import Link from "next/link";
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Network, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Zap,
  FileText,
  Globe
} from "lucide-react";

export default function SecurityPage() {
  const topics = [
    {
      id: "cryptography",
      title: "Cryptography Fundamentals",
      description: "Symmetric and asymmetric encryption, hash functions",
      icon: Key,
      difficulty: "Hard",
      subtopics: [
        "Symmetric Key Cryptography (AES, DES)",
        "Asymmetric Key Cryptography (RSA, DH)",
        "Hash Functions (MD5, SHA)",
        "Digital Signatures",
        "Key Management"
      ],
      practicalUse: "Secure communication, data integrity",
      tools: ["RSA Calculator", "Hash Generator", "Encryption Simulator"]
    },
    {
      id: "network-security",
      title: "Network Security",
      description: "Firewalls, VPNs, intrusion detection systems",
      icon: Shield,
      difficulty: "Medium",
      subtopics: [
        "Firewalls (Packet Filtering, Stateful)",
        "Virtual Private Networks (VPNs)",
        "Intrusion Detection/Prevention Systems",
        "Access Control Lists (ACLs)",
        "Network Segmentation"
      ],
      practicalUse: "Corporate network protection",
      tools: ["Firewall Simulator", "VPN Configurator", "ACL Builder"]
    },
    {
      id: "authentication",
      title: "Authentication & Authorization",
      description: "User authentication, access control, PKI",
      icon: Lock,
      difficulty: "Medium",
      subtopics: [
        "Authentication Methods (Password, Biometric, Token)",
        "Multi-Factor Authentication (MFA)",
        "Public Key Infrastructure (PKI)",
        "Certificate Authorities",
        "Role-Based Access Control (RBAC)"
      ],
      practicalUse: "User identity verification, access management",
      tools: ["Auth Simulator", "Certificate Viewer", "MFA Demo"]
    },
    {
      id: "web-security",
      title: "Web Security",
      description: "HTTPS, SSL/TLS, web application security",
      icon: Globe,
      difficulty: "Medium",
      subtopics: [
        "SSL/TLS Protocol",
        "HTTPS Implementation",
        "Web Application Vulnerabilities",
        "Cross-Site Scripting (XSS)",
        "SQL Injection Prevention"
      ],
      practicalUse: "Secure web applications, e-commerce",
      tools: ["SSL/TLS Analyzer", "Certificate Inspector", "Vulnerability Scanner"]
    },
    {
      id: "wireless-security",
      title: "Wireless Security",
      description: "WiFi security, WPA, WEP, security protocols",
      icon: Network,
      difficulty: "Medium",
      subtopics: [
        "WiFi Security Protocols (WEP, WPA, WPA2, WPA3)",
        "Wireless Authentication",
        "Rogue Access Points",
        "Wireless Encryption",
        "Enterprise WiFi Security"
      ],
      practicalUse: "Secure wireless networks, enterprise WiFi",
      tools: ["WiFi Security Analyzer", "Protocol Comparator", "Security Tester"]
    },
    {
      id: "threats-attacks",
      title: "Security Threats & Attacks",
      description: "Common attacks, vulnerabilities, defense strategies",
      icon: AlertTriangle,
      difficulty: "Medium",
      subtopics: [
        "DoS and DDoS Attacks",
        "Man-in-the-Middle Attacks",
        "Phishing and Social Engineering",
        "Malware and Ransomware",
        "Network Reconnaissance"
      ],
      practicalUse: "Threat assessment, security awareness",
      tools: ["Attack Simulator", "Threat Analyzer", "Security Assessment"]
    }
  ];

  const learningPath = [
    { step: 1, title: "Security Fundamentals", topics: ["Cryptography Basics", "Security Principles"] },
    { step: 2, title: "Network Protection", topics: ["Firewalls", "VPNs", "Network Security"] },
    { step: 3, title: "Authentication", topics: ["User Authentication", "PKI", "Access Control"] },
    { step: 4, title: "Web Security", topics: ["SSL/TLS", "HTTPS", "Web Vulnerabilities"] },
    { step: 5, title: "Advanced Topics", topics: ["Wireless Security", "Threat Analysis"] }
  ];

  const quickStats = {
    protocols: 12,
    algorithms: 8,
    vulnerabilities: 15,
    standards: 20
  };

  const securityPrinciples = [
    {
      principle: "Confidentiality",
      description: "Information is accessible only to authorized users",
      example: "Encryption protects data from unauthorized access",
      icon: Eye
    },
    {
      principle: "Integrity",
      description: "Information remains accurate and unaltered",
      example: "Digital signatures verify data hasn't been tampered with",
      icon: FileText
    },
    {
      principle: "Availability",
      description: "Information and resources are accessible when needed",
      example: "Redundant systems ensure service continuity",
      icon: Zap
    },
    {
      principle: "Authentication",
      description: "Verify the identity of users and systems",
      example: "Multi-factor authentication confirms user identity",
      icon: Lock
    },
    {
      principle: "Authorization",
      description: "Control access to resources based on identity",
      example: "Role-based access control limits user permissions",
      icon: Shield
    },
    {
      principle: "Non-repudiation",
      description: "Prevent denial of actions or transactions",
      example: "Digital signatures prove message origin",
      icon: Key
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Network Security
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about network security fundamentals, cryptography, authentication, 
            and protection against cyber threats in computer networks.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{quickStats.protocols}</div>
            <div className="text-sm text-gray-600">Security Protocols</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{quickStats.algorithms}</div>
            <div className="text-sm text-gray-600">Crypto Algorithms</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{quickStats.vulnerabilities}</div>
            <div className="text-sm text-gray-600">Known Vulnerabilities</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{quickStats.standards}</div>
            <div className="text-sm text-gray-600">Security Standards</div>
          </div>
        </div>

        {/* Security Principles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Shield className="mr-3 text-red-600" />
            Core Security Principles (CIA Triad+)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityPrinciples.map((principle, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <principle.icon className="mr-3 text-red-600" size={24} />
                  <h3 className="font-semibold text-gray-800">{principle.principle}</h3>
                </div>
                <p className="text-gray-600 mb-3">{principle.description}</p>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-700 font-medium">Example:</p>
                  <p className="text-sm text-gray-600">{principle.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <topic.icon className="text-red-600" size={32} />
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    topic.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                    topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Topics:</h4>
                    <ul className="text-sm text-gray-600">
                      {topic.subtopics.slice(0, 3).map((subtopic, i) => (
                        <li key={i} className="mb-1">• {subtopic}</li>
                      ))}
                      {topic.subtopics.length > 3 && (
                        <li className="text-gray-400">+ {topic.subtopics.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Practical Use:</h4>
                    <p className="text-sm text-gray-600">{topic.practicalUse}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Play size={16} className="text-green-600" />
                    <span className="text-sm text-gray-600">{topic.tools.length} Tools</span>
                  </div>
                  <Link 
                    href={`/cn/security/${topic.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="mr-3 text-red-600" />
            Recommended Learning Path
          </h2>
          <div className="space-y-4">
            {learningPath.map((step, index) => (
              <div key={step.step} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.topics.join(", ")}</p>
                </div>
                {index < learningPath.length - 1 && (
                  <ArrowRight className="text-gray-400" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
