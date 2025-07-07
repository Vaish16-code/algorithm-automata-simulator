"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wifi, Shield, Lock, Radio, AlertTriangle, Eye, Signal } from "lucide-react";

export default function WirelessSecurityPage() {
  const [selectedProtocol, setSelectedProtocol] = useState("wpa3");
  const [wirelessScanResults, setWirelessScanResults] = useState([
    { ssid: "HomeNetwork", security: "WPA3", signal: -45, channel: 6, encryption: "AES" },
    { ssid: "OfficeWiFi", security: "WPA2", signal: -52, channel: 11, encryption: "AES" },
    { ssid: "PublicHotspot", security: "Open", signal: -38, channel: 1, encryption: "None" },
    { ssid: "LegacyRouter", security: "WEP", signal: -67, channel: 9, encryption: "WEP" },
    { ssid: "Enterprise", security: "WPA2-Enterprise", signal: -41, channel: 36, encryption: "AES" }
  ]);
  const [selectedAttack, setSelectedAttack] = useState("deauth");

  const wirelessProtocols = [
    {
      id: "wep",
      name: "WEP (Wired Equivalent Privacy)",
      year: "1997",
      security: "Very Weak",
      description: "First wireless security standard, now deprecated",
      keyLength: "40-bit or 104-bit",
      encryption: "RC4 stream cipher",
      authentication: "Open System or Shared Key",
      vulnerabilities: [
        "Weak IV (Initialization Vector)",
        "Key recovery attacks",
        "Reused keystreams",
        "CRC-32 integrity check weakness"
      ],
      advantages: ["Universal compatibility", "Low computational overhead"],
      disadvantages: ["Easily cracked", "Deprecated", "No secure key management"]
    },
    {
      id: "wpa",
      name: "WPA (Wi-Fi Protected Access)",
      year: "2003",
      security: "Weak",
      description: "Interim solution to replace WEP",
      keyLength: "256-bit",
      encryption: "TKIP (Temporal Key Integrity Protocol)",
      authentication: "802.1X or Pre-shared Key",
      vulnerabilities: [
        "TKIP vulnerabilities",
        "Weak handshake",
        "Dictionary attacks on PSK"
      ],
      advantages: ["Better than WEP", "Dynamic key generation", "Message integrity"],
      disadvantages: ["Still vulnerable", "Performance overhead", "Deprecated"]
    },
    {
      id: "wpa2",
      name: "WPA2 (Wi-Fi Protected Access 2)",
      year: "2004",
      security: "Strong",
      description: "Current standard with AES encryption",
      keyLength: "256-bit",
      encryption: "AES-CCMP",
      authentication: "802.1X or Pre-shared Key",
      vulnerabilities: [
        "KRACK attack",
        "Weak PSK passwords",
        "Rogue access points"
      ],
      advantages: ["Strong AES encryption", "Widely supported", "Enterprise features"],
      disadvantages: ["KRACK vulnerability", "PSK brute force", "No forward secrecy"]
    },
    {
      id: "wpa3",
      name: "WPA3 (Wi-Fi Protected Access 3)",
      year: "2018",
      security: "Very Strong",
      description: "Latest security standard with enhanced protection",
      keyLength: "384-bit (Enterprise)",
      encryption: "AES-GCMP-256",
      authentication: "SAE (Simultaneous Authentication of Equals)",
      vulnerabilities: [
        "Implementation flaws",
        "Downgrade attacks",
        "Side-channel attacks"
      ],
      advantages: ["Forward secrecy", "Improved handshake", "Enhanced open networks"],
      disadvantages: ["Limited device support", "Newer standard", "Complexity"]
    }
  ];

  const wirelessAttacks = [
    {
      id: "deauth",
      name: "Deauthentication Attack",
      description: "Disconnect clients from wireless networks",
      difficulty: "Easy",
      impact: "Denial of Service",
      prevention: ["802.11w PMF", "Network monitoring", "Intrusion detection"],
      tools: ["Aircrack-ng", "MDK3", "Scapy"]
    },
    {
      id: "evil-twin",
      name: "Evil Twin Attack",
      description: "Rogue access point mimicking legitimate network",
      difficulty: "Medium",
      impact: "Data interception, credential theft",
      prevention: ["Certificate pinning", "VPN usage", "Network verification"],
      tools: ["Hostapd", "Airbase-ng", "WiFi Pineapple"]
    },
    {
      id: "wps-attack",
      name: "WPS PIN Attack",
      description: "Exploit WPS PIN vulnerability",
      difficulty: "Easy",
      impact: "Network key recovery",
      prevention: ["Disable WPS", "Use WPA3", "Regular updates"],
      tools: ["Reaver", "Bully", "Pixiewps"]
    },
    {
      id: "krack",
      name: "KRACK Attack",
      description: "Key reinstallation attack against WPA2",
      difficulty: "Hard",
      impact: "Traffic decryption, injection",
      prevention: ["Software updates", "WPA3 migration", "VPN usage"],
      tools: ["Krack-test-tool", "Custom scripts"]
    }
  ];

  const enterpriseFeatures = [
    {
      name: "802.1X Authentication",
      description: "Port-based network access control",
      components: ["Supplicant", "Authenticator", "Authentication Server"],
      protocols: ["EAP-TLS", "PEAP", "EAP-TTLS", "EAP-FAST"],
      benefits: ["Centralized authentication", "Dynamic key distribution", "User accountability"]
    },
    {
      name: "RADIUS Integration",
      description: "Remote Authentication Dial-In User Service",
      components: ["RADIUS Server", "Network Access Server", "Client"],
      protocols: ["RADIUS", "TACACS+", "Diameter"],
      benefits: ["Centralized AAA", "Scalability", "Accounting features"]
    },
    {
      name: "Certificate Management",
      description: "Public Key Infrastructure for wireless",
      components: ["CA", "Certificate Store", "CRL"],
      protocols: ["X.509", "PKCS", "SCEP"],
      benefits: ["Strong authentication", "Non-repudiation", "Scalable trust"]
    }
  ];

  const getSignalStrength = (dbm: number) => {
    if (dbm > -50) return { level: "Excellent", color: "text-green-600" };
    if (dbm > -60) return { level: "Good", color: "text-blue-600" };
    if (dbm > -70) return { level: "Fair", color: "text-yellow-600" };
    return { level: "Poor", color: "text-red-600" };
  };

  const getSecurityLevel = (security: string) => {
    switch (security) {
      case "WPA3": return { level: "Very Strong", color: "bg-green-100 text-green-800" };
      case "WPA2": return { level: "Strong", color: "bg-blue-100 text-blue-800" };
      case "WPA2-Enterprise": return { level: "Very Strong", color: "bg-green-100 text-green-800" };
      case "WPA": return { level: "Weak", color: "bg-yellow-100 text-yellow-800" };
      case "WEP": return { level: "Very Weak", color: "bg-red-100 text-red-800" };
      case "Open": return { level: "None", color: "bg-gray-100 text-gray-800" };
      default: return { level: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
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
            Wireless Security
          </h1>
          <p className="text-xl text-gray-600">
            Learn about WiFi security protocols, wireless attacks, and enterprise wireless security.
          </p>
        </div>

        {/* Wireless Security Protocols */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Wireless Security Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {wirelessProtocols.map((protocol) => (
              <button
                key={protocol.id}
                onClick={() => setSelectedProtocol(protocol.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedProtocol === protocol.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-1">{protocol.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{protocol.year}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  protocol.security === 'Very Strong' ? 'bg-green-100 text-green-800' :
                  protocol.security === 'Strong' ? 'bg-blue-100 text-blue-800' :
                  protocol.security === 'Weak' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {protocol.security}
                </span>
              </button>
            ))}
          </div>

          {selectedProtocol && (
            <div className="bg-gray-50 rounded-lg p-6">
              {(() => {
                const protocol = wirelessProtocols.find(p => p.id === selectedProtocol);
                return (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">{protocol?.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Technical Details:</h4>
                        <ul className="text-sm text-gray-600">
                          <li>• Key Length: {protocol?.keyLength}</li>
                          <li>• Encryption: {protocol?.encryption}</li>
                          <li>• Authentication: {protocol?.authentication}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Vulnerabilities:</h4>
                        <ul className="text-sm text-gray-600">
                          {protocol?.vulnerabilities.slice(0, 3).map((vuln, i) => (
                            <li key={i} className="mb-1">• {vuln}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Advantages:</h4>
                        <ul className="text-sm text-gray-600">
                          {protocol?.advantages.map((advantage, i) => (
                            <li key={i} className="mb-1">• {advantage}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">Disadvantages:</h4>
                        <ul className="text-sm text-gray-600">
                          {protocol?.disadvantages.map((disadvantage, i) => (
                            <li key={i} className="mb-1">• {disadvantage}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{protocol?.description}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Wireless Network Scanner */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Wireless Network Scanner</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SSID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encryption
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wirelessScanResults.map((network, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wifi className="mr-2 text-blue-600" size={16} />
                        <span className="text-sm font-medium text-gray-900">{network.ssid}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getSecurityLevel(network.security).color
                      }`}>
                        {network.security}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Signal className={`mr-2 ${getSignalStrength(network.signal).color}`} size={16} />
                        <span className="text-sm text-gray-900">{network.signal} dBm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {network.channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {network.encryption}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        network.security === 'Open' || network.security === 'WEP' ? 'bg-red-100 text-red-800' :
                        network.security === 'WPA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {network.security === 'Open' || network.security === 'WEP' ? 'High' :
                         network.security === 'WPA' ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wireless Attacks */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Wireless Attacks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {wirelessAttacks.map((attack) => (
              <button
                key={attack.id}
                onClick={() => setSelectedAttack(attack.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAttack === attack.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-1">{attack.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{attack.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    attack.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    attack.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {attack.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedAttack && (
            <div className="bg-gray-50 rounded-lg p-6">
              {(() => {
                const attack = wirelessAttacks.find(a => a.id === selectedAttack);
                return (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">{attack?.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Impact:</h4>
                        <p className="text-sm text-gray-600">{attack?.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Prevention:</h4>
                        <ul className="text-sm text-gray-600">
                          {attack?.prevention.map((method, i) => (
                            <li key={i} className="mb-1">• {method}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Common Tools:</h4>
                        <ul className="text-sm text-gray-600">
                          {attack?.tools.map((tool, i) => (
                            <li key={i} className="mb-1">• {tool}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Enterprise Wireless Security */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enterprise Wireless Security</h2>
          <div className="space-y-6">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-gray-800 mb-2">{feature.name}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Components:</h4>
                    <ul className="text-sm text-gray-600">
                      {feature.components.map((component, i) => (
                        <li key={i} className="mb-1">• {component}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-600 mb-2">Protocols:</h4>
                    <ul className="text-sm text-gray-600">
                      {feature.protocols.map((protocol, i) => (
                        <li key={i} className="mb-1">• {protocol}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Benefits:</h4>
                    <ul className="text-sm text-gray-600">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="mb-1">• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
