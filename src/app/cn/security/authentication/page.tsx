"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Key, Shield, Eye, EyeOff, User, Smartphone, CreditCard } from "lucide-react";

export default function AuthenticationPage() {
  const [selectedAuthMethod, setSelectedAuthMethod] = useState("password");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [selectedMfaMethod, setSelectedMfaMethod] = useState("sms");
  const [authenticationLog, setAuthenticationLog] = useState([
    { id: 1, user: "alice@company.com", method: "Password + SMS", result: "Success", timestamp: "2024-01-15 10:30:00" },
    { id: 2, user: "bob@company.com", method: "Password", result: "Failed", timestamp: "2024-01-15 10:25:00" },
    { id: 3, user: "charlie@company.com", method: "Biometric", result: "Success", timestamp: "2024-01-15 10:20:00" }
  ]);

  const authenticationMethods = [
    {
      id: "password",
      name: "Password Authentication",
      description: "Traditional username and password combination",
      security: "Low to Medium",
      pros: ["Familiar to users", "Easy to implement", "Low cost"],
      cons: ["Vulnerable to attacks", "Password fatigue", "Weak passwords"],
      icon: Lock
    },
    {
      id: "biometric",
      name: "Biometric Authentication",
      description: "Using unique biological characteristics",
      security: "High",
      pros: ["Unique to individual", "Convenient", "Difficult to forge"],
      cons: ["Privacy concerns", "Expensive", "False positives/negatives"],
      icon: Eye
    },
    {
      id: "token",
      name: "Token-Based Authentication",
      description: "Physical or digital tokens for authentication",
      security: "Medium to High",
      pros: ["Two-factor security", "Portable", "Time-limited"],
      cons: ["Can be lost/stolen", "Battery dependence", "Cost"],
      icon: Key
    },
    {
      id: "certificate",
      name: "Certificate-Based Authentication",
      description: "Digital certificates for identity verification",
      security: "Very High",
      pros: ["Strong cryptography", "Non-repudiation", "Scalable"],
      cons: ["Complex setup", "Certificate management", "PKI infrastructure"],
      icon: Shield
    }
  ];

  const mfaMethods = [
    {
      id: "sms",
      name: "SMS Verification",
      description: "Send verification code via SMS",
      security: "Medium",
      pros: ["Widely available", "Easy to use", "No additional apps"],
      cons: ["SIM swapping risk", "Network dependency", "Not always reliable"]
    },
    {
      id: "app",
      name: "Authenticator App",
      description: "Time-based one-time passwords (TOTP)",
      security: "High",
      pros: ["Offline capability", "More secure", "Multiple accounts"],
      cons: ["Requires smartphone", "App dependency", "Clock synchronization"]
    },
    {
      id: "hardware",
      name: "Hardware Token",
      description: "Physical security keys (FIDO2/WebAuthn)",
      security: "Very High",
      pros: ["Phishing resistant", "No batteries", "Multi-protocol"],
      cons: ["Can be lost", "Cost", "Limited device support"]
    }
  ];

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push("Lowercase letters");

    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push("Uppercase letters");

    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push("Numbers");

    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else feedback.push("Special characters");

    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return {
      level: levels[strength] || "Very Weak",
      score: strength,
      feedback: feedback
    };
  };

  const handlePasswordChange = (password: string) => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength(password);
  };

  const accessControlModels = [
    {
      name: "Discretionary Access Control (DAC)",
      description: "Resource owners control access to their resources",
      example: "File permissions in Unix/Linux systems",
      pros: ["Flexible", "User-controlled", "Simple to understand"],
      cons: ["Information leakage", "Trojan horse attacks", "Inconsistent security"]
    },
    {
      name: "Mandatory Access Control (MAC)",
      description: "System enforces access control based on security labels",
      example: "Military security classifications (Top Secret, Secret, etc.)",
      pros: ["High security", "Prevents information leakage", "Consistent policy"],
      cons: ["Inflexible", "Complex administration", "User inconvenience"]
    },
    {
      name: "Role-Based Access Control (RBAC)",
      description: "Access permissions assigned to roles, users assigned to roles",
      example: "Employee roles (Manager, Developer, HR) with specific permissions",
      pros: ["Scalable", "Easy management", "Reflects organizational structure"],
      cons: ["Role explosion", "Static permissions", "Complex role hierarchies"]
    },
    {
      name: "Attribute-Based Access Control (ABAC)",
      description: "Access decisions based on attributes of users, resources, and environment",
      example: "Access granted based on user department, resource classification, and time of day",
      pros: ["Very flexible", "Context-aware", "Fine-grained control"],
      cons: ["Complex to implement", "Policy management overhead", "Performance impact"]
    }
  ];

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
            Authentication & Authorization
          </h1>
          <p className="text-xl text-gray-600">
            Learn about user authentication methods, access control models, and authorization mechanisms.
          </p>
        </div>

        {/* Authentication Methods */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Authentication Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {authenticationMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedAuthMethod(method.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAuthMethod === method.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <method.icon className="mb-2 text-red-600" size={24} />
                <h3 className="font-semibold text-gray-800 mb-1">{method.name}</h3>
                <p className="text-xs text-gray-600">{method.description}</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    method.security === 'Very High' ? 'bg-green-100 text-green-800' :
                    method.security === 'High' ? 'bg-blue-100 text-blue-800' :
                    method.security === 'Medium to High' ? 'bg-blue-100 text-blue-800' :
                    method.security === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {method.security}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedAuthMethod && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                {authenticationMethods.find(m => m.id === selectedAuthMethod)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Advantages:</h4>
                  <ul className="text-sm text-gray-600">
                    {authenticationMethods.find(m => m.id === selectedAuthMethod)?.pros.map((pro, i) => (
                      <li key={i} className="mb-1">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Disadvantages:</h4>
                  <ul className="text-sm text-gray-600">
                    {authenticationMethods.find(m => m.id === selectedAuthMethod)?.cons.map((con, i) => (
                      <li key={i} className="mb-1">• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Password Strength Checker */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Strength Checker</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password to check strength"
                  value={passwordStrength}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {passwordStrength && (
                <div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Strength:</span>
                      <span className={`text-sm font-medium ${
                        checkPasswordStrength(passwordStrength).level === 'Strong' ? 'text-green-600' :
                        checkPasswordStrength(passwordStrength).level === 'Good' ? 'text-blue-600' :
                        checkPasswordStrength(passwordStrength).level === 'Fair' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {checkPasswordStrength(passwordStrength).level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          checkPasswordStrength(passwordStrength).score >= 4 ? 'bg-green-500' :
                          checkPasswordStrength(passwordStrength).score >= 3 ? 'bg-blue-500' :
                          checkPasswordStrength(passwordStrength).score >= 2 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(checkPasswordStrength(passwordStrength).score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {checkPasswordStrength(passwordStrength).feedback.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Missing requirements:</p>
                      <ul className="text-sm text-gray-600">
                        {checkPasswordStrength(passwordStrength).feedback.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MFA Simulator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multi-Factor Authentication (MFA)</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable MFA</span>
                <button
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    mfaEnabled ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {mfaEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select MFA Method:
                  </label>
                  <select
                    value={selectedMfaMethod}
                    onChange={(e) => setSelectedMfaMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {mfaMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedMfaMethod && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {mfaMethods.find(m => m.id === selectedMfaMethod)?.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {mfaMethods.find(m => m.id === selectedMfaMethod)?.description}
                      </p>
                      <div className="text-xs">
                        <span className={`px-2 py-1 rounded ${
                          mfaMethods.find(m => m.id === selectedMfaMethod)?.security === 'Very High' ? 'bg-green-100 text-green-800' :
                          mfaMethods.find(m => m.id === selectedMfaMethod)?.security === 'High' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mfaMethods.find(m => m.id === selectedMfaMethod)?.security} Security
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Access Control Models */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Access Control Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessControlModels.map((model, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{model.name}</h3>
                <p className="text-gray-600 mb-3">{model.description}</p>
                <div className="mb-3">
                  <h4 className="font-medium text-blue-600 mb-1">Example:</h4>
                  <p className="text-sm text-gray-600">{model.example}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <h4 className="font-medium text-green-600 mb-1">Advantages:</h4>
                    <ul className="text-sm text-gray-600">
                      {model.pros.map((pro, i) => (
                        <li key={i} className="mb-1">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-1">Disadvantages:</h4>
                    <ul className="text-sm text-gray-600">
                      {model.cons.map((con, i) => (
                        <li key={i} className="mb-1">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authenticationLog.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.result === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
