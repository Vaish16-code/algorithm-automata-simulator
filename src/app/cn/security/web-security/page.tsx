"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Shield, Lock, AlertTriangle, Eye, Server, Code } from "lucide-react";

export default function WebSecurityPage() {
  const [selectedVulnerability, setSelectedVulnerability] = useState("xss");
  const [sslCertInfo, setSslCertInfo] = useState({
    domain: "example.com",
    issuer: "Let's Encrypt Authority X3",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    algorithm: "RSA 2048-bit",
    status: "Valid"
  });
  const [testUrl, setTestUrl] = useState("https://example.com");
  const [securityHeaders, setSecurityHeaders] = useState([
    { name: "Content-Security-Policy", value: "default-src 'self'", present: true },
    { name: "X-Frame-Options", value: "DENY", present: true },
    { name: "X-XSS-Protection", value: "1; mode=block", present: false },
    { name: "Strict-Transport-Security", value: "max-age=31536000", present: true },
    { name: "X-Content-Type-Options", value: "nosniff", present: true }
  ]);

  const webVulnerabilities = [
    {
      id: "xss",
      name: "Cross-Site Scripting (XSS)",
      description: "Injection of malicious scripts into web pages",
      severity: "High",
      types: ["Reflected XSS", "Stored XSS", "DOM-based XSS"],
      impact: "Session hijacking, data theft, malicious redirects",
      prevention: [
        "Input validation and sanitization",
        "Output encoding",
        "Content Security Policy (CSP)",
        "Use secure frameworks"
      ],
      example: "<script>alert('XSS')</script>"
    },
    {
      id: "sqli",
      name: "SQL Injection",
      description: "Injection of malicious SQL code into database queries",
      severity: "Critical",
      types: ["Classic SQL Injection", "Blind SQL Injection", "Time-based SQL Injection"],
      impact: "Data breach, database manipulation, authentication bypass",
      prevention: [
        "Parameterized queries",
        "Stored procedures",
        "Input validation",
        "Least privilege principle"
      ],
      example: "'; DROP TABLE users; --"
    },
    {
      id: "csrf",
      name: "Cross-Site Request Forgery (CSRF)",
      description: "Unauthorized commands transmitted from a user's browser",
      severity: "Medium",
      types: ["GET-based CSRF", "POST-based CSRF", "PUT/DELETE CSRF"],
      impact: "Unauthorized actions, data modification, privilege escalation",
      prevention: [
        "CSRF tokens",
        "SameSite cookies",
        "Double-submit cookies",
        "Referer header validation"
      ],
      example: "<img src='http://bank.com/transfer?amount=1000&to=attacker'>"
    },
    {
      id: "idor",
      name: "Insecure Direct Object References (IDOR)",
      description: "Direct access to objects based on user input",
      severity: "Medium",
      types: ["Horizontal IDOR", "Vertical IDOR", "Blind IDOR"],
      impact: "Unauthorized data access, privacy violations",
      prevention: [
        "Access controls",
        "Indirect object references",
        "User session validation",
        "Authorization checks"
      ],
      example: "/user/profile?id=123 → /user/profile?id=124"
    }
  ];

  const sslTlsVersions = [
    {
      version: "SSL 2.0",
      year: "1995",
      status: "Deprecated",
      security: "Insecure",
      issues: ["Weak MAC", "No handshake protection", "Cipher downgrade attacks"]
    },
    {
      version: "SSL 3.0",
      year: "1996",
      status: "Deprecated",
      security: "Insecure",
      issues: ["POODLE attack", "Weak MAC", "RC4 cipher vulnerabilities"]
    },
    {
      version: "TLS 1.0",
      year: "1999",
      status: "Deprecated",
      security: "Weak",
      issues: ["BEAST attack", "Lucky 13", "Weak cipher suites"]
    },
    {
      version: "TLS 1.1",
      year: "2006",
      status: "Deprecated",
      security: "Weak",
      issues: ["Limited cipher suites", "No AEAD support", "CBC vulnerabilities"]
    },
    {
      version: "TLS 1.2",
      year: "2008",
      status: "Current",
      security: "Secure",
      issues: ["Some weak cipher suites", "Implementation vulnerabilities"]
    },
    {
      version: "TLS 1.3",
      year: "2018",
      status: "Current",
      security: "Most Secure",
      issues: ["Limited deployment", "Compatibility issues"]
    }
  ];

  const securityBestPractices = [
    {
      category: "Authentication & Authorization",
      practices: [
        "Implement strong password policies",
        "Use multi-factor authentication (MFA)",
        "Apply principle of least privilege",
        "Regular access reviews",
        "Session timeout mechanisms"
      ]
    },
    {
      category: "Data Protection",
      practices: [
        "Encrypt data in transit and at rest",
        "Use HTTPS everywhere",
        "Implement proper key management",
        "Data classification and handling",
        "Secure backup procedures"
      ]
    },
    {
      category: "Input Validation",
      practices: [
        "Validate all user inputs",
        "Use whitelist validation",
        "Encode output data",
        "Implement file upload restrictions",
        "Sanitize database queries"
      ]
    },
    {
      category: "Security Headers",
      practices: [
        "Content Security Policy (CSP)",
        "HTTP Strict Transport Security (HSTS)",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Referrer Policy"
      ]
    }
  ];

  const analyzeSslCertificate = () => {
    // Simulate SSL certificate analysis
    const domain = testUrl.replace(/https?:\/\//, '').split('/')[0];
    setSslCertInfo({
      domain: domain,
      issuer: "DigiCert Inc",
      validFrom: "2024-01-15",
      validTo: "2025-01-15",
      algorithm: "RSA 2048-bit",
      status: "Valid"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cn/security" className="inline-flex items-center text-red-600 hover:text-red-800 mb-4">
            <ArrowLeft className="mr-2" size={20} />
            Back to Security
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Web Security
          </h1>
          <p className="text-xl text-gray-600">
            Learn about web application security, HTTPS, SSL/TLS, and common web vulnerabilities.
          </p>
        </div>

        {/* Web Vulnerabilities */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Web Vulnerabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {webVulnerabilities.map((vuln) => (
              <button
                key={vuln.id}
                onClick={() => setSelectedVulnerability(vuln.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedVulnerability === vuln.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-1">{vuln.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{vuln.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  vuln.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                  vuln.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vuln.severity}
                </span>
              </button>
            ))}
          </div>

          {selectedVulnerability && (
            <div className="bg-gray-50 rounded-lg p-6">
              {(() => {
                const vuln = webVulnerabilities.find(v => v.id === selectedVulnerability);
                return (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">{vuln?.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Types:</h4>
                        <ul className="text-sm text-gray-600">
                          {vuln?.types.map((type, i) => (
                            <li key={i} className="mb-1">• {type}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Impact:</h4>
                        <p className="text-sm text-gray-600">{vuln?.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Prevention:</h4>
                        <ul className="text-sm text-gray-600">
                          {vuln?.prevention.map((method, i) => (
                            <li key={i} className="mb-1">• {method}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-600 mb-2">Example:</h4>
                        <code className="text-xs bg-gray-200 p-2 rounded block">
                          {vuln?.example}
                        </code>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* SSL/TLS Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">SSL/TLS Certificate Analyzer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL:
                </label>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <button
                onClick={analyzeSslCertificate}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Analyze Certificate
              </button>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Certificate Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-medium">{sslCertInfo.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issuer:</span>
                    <span className="font-medium">{sslCertInfo.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid From:</span>
                    <span className="font-medium">{sslCertInfo.validFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid To:</span>
                    <span className="font-medium">{sslCertInfo.validTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Algorithm:</span>
                    <span className="font-medium">{sslCertInfo.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      sslCertInfo.status === 'Valid' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sslCertInfo.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Headers Checker */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Headers Checker</h2>
            <div className="space-y-3">
              {securityHeaders.map((header, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{header.name}</div>
                    <div className="text-xs text-gray-600">{header.value}</div>
                  </div>
                  <div className="ml-3">
                    {header.present ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Missing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Security Score</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-blue-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(securityHeaders.filter(h => h.present).length / securityHeaders.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-800">
                  {securityHeaders.filter(h => h.present).length}/{securityHeaders.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SSL/TLS Versions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">SSL/TLS Protocol Versions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Known Issues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sslTlsVersions.map((version, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {version.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {version.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        version.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {version.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        version.security === 'Most Secure' ? 'bg-green-100 text-green-800' :
                        version.security === 'Secure' ? 'bg-blue-100 text-blue-800' :
                        version.security === 'Weak' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {version.security}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {version.issues.slice(0, 2).map((issue, i) => (
                          <li key={i} className="truncate">{issue}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Web Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityBestPractices.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">{category.category}</h3>
                <ul className="space-y-2">
                  {category.practices.map((practice, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
