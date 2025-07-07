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
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{quickStats.protocols}</div>
              <div className="text-sm text-gray-600">Security Protocols</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{quickStats.algorithms}</div>
              <div className="text-sm text-gray-600">Crypto Algorithms</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{quickStats.vulnerabilities}</div>
              <div className="text-sm text-gray-600">Common Threats</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{quickStats.standards}</div>
              <div className="text-sm text-gray-600">Security Standards</div>
            </CardContent>
          </Card>
        </div>

        {/* Security Principles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Core Security Principles (CIA Triad+)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityPrinciples.map((principle, index) => {
                const IconComponent = principle.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <IconComponent className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{principle.principle}</h3>
                      <p className="text-sm text-gray-600 mb-2">{principle.description}</p>
                      <p className="text-xs text-gray-500">{principle.example}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-8 w-8 text-red-600" />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      topic.difficulty === "Easy" ? "bg-green-100 text-green-800" : 
                      topic.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Topics:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {topic.subtopics.slice(0, 3).map((subtopic, index) => (
                          <li key={index}>• {subtopic}</li>
                        ))}
                        {topic.subtopics.length > 3 && (
                          <li className="text-gray-500">• +{topic.subtopics.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Applications:</h4>
                      <p className="text-xs text-gray-600">{topic.practicalUse}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={`/cn/security/${topic.id}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Learn
                        </Button>
                      </Link>
                      <Link href={`/cn/security/${topic.id}/tools`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          Tools
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Path */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Recommended Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningPath.map((step, index) => (
                <div key={step.step} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.topics.join(", ")}</p>
                  </div>
                  {index < learningPath.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Standards & Protocols */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Security Standards & Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-3">Encryption Standards</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>AES:</strong> Advanced Encryption Standard</li>
                  <li>• <strong>RSA:</strong> Rivest-Shamir-Adleman</li>
                  <li>• <strong>DES/3DES:</strong> Data Encryption Standard</li>
                  <li>• <strong>ECC:</strong> Elliptic Curve Cryptography</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Network Security</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>IPSec:</strong> Internet Protocol Security</li>
                  <li>• <strong>SSL/TLS:</strong> Secure Socket Layer/Transport Layer Security</li>
                  <li>• <strong>WPA2/WPA3:</strong> WiFi Protected Access</li>
                  <li>• <strong>VPN:</strong> Virtual Private Network</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Authentication</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Kerberos:</strong> Network Authentication</li>
                  <li>• <strong>LDAP:</strong> Lightweight Directory Access</li>
                  <li>• <strong>OAuth:</strong> Open Authorization</li>
                  <li>• <strong>SAML:</strong> Security Assertion Markup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Threats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Security Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Network Attacks</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>DoS/DDoS:</strong> Denial of Service attacks</li>
                  <li>• <strong>Man-in-the-Middle:</strong> Intercepting communications</li>
                  <li>• <strong>Packet Sniffing:</strong> Capturing network traffic</li>
                  <li>• <strong>IP Spoofing:</strong> Forging IP addresses</li>
                  <li>• <strong>ARP Poisoning:</strong> Corrupting ARP tables</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Application Attacks</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>SQL Injection:</strong> Database query manipulation</li>
                  <li>• <strong>Cross-Site Scripting (XSS):</strong> Client-side code injection</li>
                  <li>• <strong>Phishing:</strong> Social engineering attacks</li>
                  <li>• <strong>Malware:</strong> Viruses, worms, trojans</li>
                  <li>• <strong>Ransomware:</strong> Data encryption for ransom</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎯 Exam Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Key Concepts to Master:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Symmetric vs Asymmetric encryption</li>
                  <li>• SSL/TLS handshake process</li>
                  <li>• PKI and certificate management</li>
                  <li>• Firewall types and rules</li>
                  <li>• VPN protocols and implementations</li>
                  <li>• Authentication methods and MFA</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Practice Problems:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• RSA key generation and encryption</li>
                  <li>• Hash function calculations</li>
                  <li>• Firewall rule configurations</li>
                  <li>• Certificate validation processes</li>
                  <li>• Attack scenario analysis</li>
                  <li>• Security protocol comparisons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/cn/transport-layer">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Previous: Transport Layer
            </Button>
          </Link>
          <Link href="/cn">
            <Button variant="outline">
              Back to Computer Networks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
