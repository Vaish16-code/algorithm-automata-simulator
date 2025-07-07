"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Shield, Lock, Eye, Hash, RefreshCw } from "lucide-react";

export default function CryptographyPage() {
  const [rsaInput, setRsaInput] = useState("");
  const [rsaOutput, setRsaOutput] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("rsa");
  const [isEncrypting, setIsEncrypting] = useState(true);

  // Simple RSA implementation for demonstration
  const simpleRSA = (text: string, encrypt: boolean = true) => {
    // Simple Caesar cipher for demonstration (not real RSA)
    const shift = encrypt ? 3 : -3;
    return text.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift + 26) % 26) + base);
      }
      return char;
    }).join('');
  };

  // Simple hash function
  const simpleHash = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const handleRSAOperation = () => {
    if (rsaInput.trim()) {
      const result = simpleRSA(rsaInput, isEncrypting);
      setRsaOutput(result);
    }
  };

  const handleHashOperation = () => {
    if (hashInput.trim()) {
      const result = simpleHash(hashInput);
      setHashOutput(result);
    }
  };

  const cryptographyTypes = [
    {
      name: "Symmetric Key Cryptography",
      description: "Uses the same key for encryption and decryption",
      examples: ["AES", "DES", "3DES", "Blowfish"],
      advantages: ["Fast", "Efficient for large data"],
      disadvantages: ["Key distribution problem", "Key management complexity"]
    },
    {
      name: "Asymmetric Key Cryptography",
      description: "Uses different keys for encryption and decryption",
      examples: ["RSA", "ECC", "Diffie-Hellman"],
      advantages: ["Secure key exchange", "Digital signatures"],
      disadvantages: ["Slower than symmetric", "More computational overhead"]
    },
    {
      name: "Hash Functions",
      description: "One-way functions that produce fixed-size output",
      examples: ["MD5", "SHA-1", "SHA-256", "SHA-3"],
      advantages: ["Data integrity", "Password storage"],
      disadvantages: ["Not reversible", "Collision vulnerabilities"]
    }
  ];

  const cryptographicPrinciples = [
    {
      principle: "Confidentiality",
      description: "Information is accessible only to authorized users",
      icon: Eye
    },
    {
      principle: "Integrity",
      description: "Information remains accurate and unaltered",
      icon: Shield
    },
    {
      principle: "Authentication",
      description: "Verify the identity of users and systems",
      icon: Lock
    },
    {
      principle: "Non-repudiation",
      description: "Prevent denial of actions or transactions",
      icon: Key
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
            Cryptography Fundamentals
          </h1>
          <p className="text-xl text-gray-600">
            Learn about encryption, decryption, and cryptographic algorithms used in network security.
          </p>
        </div>

        {/* Cryptographic Principles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cryptographic Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cryptographicPrinciples.map((principle, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <principle.icon className="mx-auto mb-2 text-red-600" size={32} />
                <h3 className="font-semibold text-gray-800 mb-2">{principle.principle}</h3>
                <p className="text-sm text-gray-600">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptography Types */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Types of Cryptography</h2>
          <div className="space-y-6">
            {cryptographyTypes.map((type, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-3">{type.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-600">
                      {type.examples.map((example, i) => (
                        <li key={i} className="mb-1">• {example}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Advantages:</h4>
                    <ul className="text-sm text-gray-600">
                      {type.advantages.map((advantage, i) => (
                        <li key={i} className="mb-1">• {advantage}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Disadvantages:</h4>
                    <ul className="text-sm text-gray-600">
                      {type.disadvantages.map((disadvantage, i) => (
                        <li key={i} className="mb-1">• {disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RSA Simulator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">RSA Encryption/Decryption</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Text:
                </label>
                <input
                  type="text"
                  value={rsaInput}
                  onChange={(e) => setRsaInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter text to encrypt/decrypt"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operation"
                    checked={isEncrypting}
                    onChange={() => setIsEncrypting(true)}
                    className="mr-2"
                  />
                  Encrypt
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operation"
                    checked={!isEncrypting}
                    onChange={() => setIsEncrypting(false)}
                    className="mr-2"
                  />
                  Decrypt
                </label>
              </div>

              <button
                onClick={handleRSAOperation}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                {isEncrypting ? 'Encrypt' : 'Decrypt'} Text
              </button>

              {rsaOutput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output:
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <code className="text-sm">{rsaOutput}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hash Function Simulator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hash Function Generator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Text:
                </label>
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter text to hash"
                />
              </div>

              <button
                onClick={handleHashOperation}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Generate Hash
              </button>

              {hashOutput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hash Output:
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <code className="text-sm font-mono">{hashOutput}</code>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Note:</strong> This is a simplified hash function for demonstration. 
                Real cryptographic hash functions like SHA-256 are much more complex.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Encryption Process</h3>
              <ol className="space-y-2 text-gray-600">
                <li>1. Plaintext → Input message</li>
                <li>2. Key → Secret value</li>
                <li>3. Algorithm → Encryption method</li>
                <li>4. Ciphertext → Encrypted output</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Properties</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Computational Security</li>
                <li>• Perfect Secrecy</li>
                <li>• Semantic Security</li>
                <li>• Forward Secrecy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
