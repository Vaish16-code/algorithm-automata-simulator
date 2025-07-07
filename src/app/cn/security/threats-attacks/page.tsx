"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Shield, Eye, Target, Zap, Bug, Lock, Network } from "lucide-react";

export default function ThreatsAttacksPage() {
  const [selectedThreat, setSelectedThreat] = useState("ddos");
  const [attackScenario, setAttackScenario] = useState("phishing");
  const [threatLevel, setThreatLevel] = useState("medium");
  const [incidentLog, setIncidentLog] = useState([
    { id: 1, type: "DDoS", severity: "High", status: "Mitigated", timestamp: "2024-01-15 14:30:00", target: "Web Server" },
    { id: 2, type: "Phishing", severity: "Medium", status: "Detected", timestamp: "2024-01-15 12:15:00", target: "Email System" },
    { id: 3, type: "Malware", severity: "High", status: "Contained", timestamp: "2024-01-15 09:45:00", target: "Workstation" },
    { id: 4, type: "Reconnaissance", severity: "Low", status: "Monitoring", timestamp: "2024-01-15 08:20:00", target: "Network" }
  ]);

  const securityThreats = [
    {
      id: "ddos",
      name: "DDoS (Distributed Denial of Service)",
      description: "Overwhelm target with traffic from multiple sources",
      severity: "High",
      category: "Availability",
      impact: "Service disruption, financial loss, reputation damage",
      techniques: [
        "Volume-based attacks (UDP floods, ICMP floods)",
        "Protocol attacks (SYN floods, Ping of Death)",
        "Application layer attacks (HTTP floods, Slowloris)"
      ],
      indicators: [
        "Unusually slow network performance",
        "Unavailability of websites or services",
        "Inability to access specific websites",
        "Dramatic increase in spam emails"
      ],
      mitigation: [
        "DDoS protection services",
        "Rate limiting and traffic filtering",
        "Load balancing and redundancy",
        "Incident response planning"
      ],
      icon: Zap
    },
    {
      id: "mitm",
      name: "Man-in-the-Middle (MITM)",
      description: "Intercept and potentially alter communications",
      severity: "High",
      category: "Confidentiality",
      impact: "Data theft, credential harvesting, session hijacking",
      techniques: [
        "ARP spoofing",
        "DNS spoofing",
        "SSL stripping",
        "Rogue access points"
      ],
      indicators: [
        "Unexpected certificate warnings",
        "Unusual network behavior",
        "Slow connection speeds",
        "Redirects to suspicious sites"
      ],
      mitigation: [
        "Use HTTPS and certificate pinning",
        "VPN for sensitive communications",
        "Public key infrastructure (PKI)",
        "Network monitoring and intrusion detection"
      ],
      icon: Eye
    },
    {
      id: "phishing",
      name: "Phishing & Social Engineering",
      description: "Trick users into revealing sensitive information",
      severity: "Medium",
      category: "Human Factor",
      impact: "Credential theft, financial fraud, data breach",
      techniques: [
        "Email phishing",
        "Spear phishing",
        "Whaling (CEO fraud)",
        "Vishing (voice phishing)",
        "Smishing (SMS phishing)"
      ],
      indicators: [
        "Suspicious email attachments",
        "Urgent requests for credentials",
        "Misspelled URLs or domains",
        "Unexpected financial requests"
      ],
      mitigation: [
        "Security awareness training",
        "Email filtering and authentication",
        "Multi-factor authentication",
        "Verification procedures"
      ],
      icon: Target
    },
    {
      id: "malware",
      name: "Malware & Ransomware",
      description: "Malicious software to damage or gain unauthorized access",
      severity: "Critical",
      category: "Integrity",
      impact: "System compromise, data encryption, financial extortion",
      techniques: [
        "Viruses and worms",
        "Trojans and backdoors",
        "Ransomware encryption",
        "Keyloggers and spyware",
        "Rootkits and bootkits"
      ],
      indicators: [
        "Unusual system behavior",
        "Encrypted files with ransom notes",
        "Unauthorized network connections",
        "Performance degradation"
      ],
      mitigation: [
        "Antivirus and anti-malware solutions",
        "Regular system updates and patching",
        "Backup and recovery procedures",
        "Application whitelisting"
      ],
      icon: Bug
    },
    {
      id: "recon",
      name: "Network Reconnaissance",
      description: "Gather information about target systems and networks",
      severity: "Low",
      category: "Information Gathering",
      impact: "Intelligence gathering for future attacks",
      techniques: [
        "Port scanning",
        "Network mapping",
        "Vulnerability scanning",
        "DNS enumeration",
        "OSINT gathering"
      ],
      indicators: [
        "Unusual network scanning activity",
        "Multiple failed login attempts",
        "Unexpected database queries",
        "Abnormal traffic patterns"
      ],
      mitigation: [
        "Network monitoring and logging",
        "Intrusion detection systems",
        "Access controls and segmentation",
        "Threat intelligence sharing"
      ],
      icon: Network
    }
  ];

  const attackKillChain = [
    {
      phase: "1. Reconnaissance",
      description: "Gather information about the target",
      activities: ["OSINT collection", "Network scanning", "Social media research"],
      detection: "Monitor for unusual scanning activity"
    },
    {
      phase: "2. Weaponization",
      description: "Create or obtain attack tools",
      activities: ["Malware creation", "Exploit development", "Payload preparation"],
      detection: "Threat intelligence and signature detection"
    },
    {
      phase: "3. Delivery",
      description: "Transmit the weapon to the target",
      activities: ["Email attachment", "Malicious links", "USB drops"],
      detection: "Email filtering and endpoint protection"
    },
    {
      phase: "4. Exploitation",
      description: "Trigger the vulnerability",
      activities: ["Code execution", "Privilege escalation", "System compromise"],
      detection: "Behavior analysis and anomaly detection"
    },
    {
      phase: "5. Installation",
      description: "Install malware on target system",
      activities: ["Backdoor creation", "Persistence establishment", "Remote access"],
      detection: "File integrity monitoring and system analysis"
    },
    {
      phase: "6. Command & Control",
      description: "Establish communication channel",
      activities: ["C2 communication", "Data exfiltration", "Lateral movement"],
      detection: "Network monitoring and traffic analysis"
    },
    {
      phase: "7. Actions on Objectives",
      description: "Achieve the attack goals",
      activities: ["Data theft", "System destruction", "Financial gain"],
      detection: "Data loss prevention and incident response"
    }
  ];

  const riskAssessment = {
    high: {
      threats: ["Advanced Persistent Threats", "Ransomware", "Nation-state attacks"],
      likelihood: "High",
      impact: "Severe",
      color: "bg-red-100 text-red-800"
    },
    medium: {
      threats: ["Phishing campaigns", "Malware infections", "Insider threats"],
      likelihood: "Medium",
      impact: "Moderate",
      color: "bg-yellow-100 text-yellow-800"
    },
    low: {
      threats: ["Script kiddies", "Opportunistic attacks", "Accidental breaches"],
      likelihood: "Low",
      impact: "Minor",
      color: "bg-green-100 text-green-800"
    }
  };

  const defenseStrategies = [
    {
      category: "Prevention",
      icon: Shield,
      strategies: [
        "Security awareness training",
        "Access controls and authentication",
        "Network segmentation",
        "Regular security updates",
        "Vulnerability management"
      ]
    },
    {
      category: "Detection",
      icon: Eye,
      strategies: [
        "Intrusion detection systems",
        "Security information and event management (SIEM)",
        "Network monitoring",
        "Endpoint detection and response (EDR)",
        "Threat hunting"
      ]
    },
    {
      category: "Response",
      icon: AlertTriangle,
      strategies: [
        "Incident response planning",
        "Forensic analysis capabilities",
        "Communication procedures",
        "Recovery and restoration",
        "Lessons learned process"
      ]
    },
    {
      category: "Recovery",
      icon: Lock,
      strategies: [
        "Backup and restore procedures",
        "Business continuity planning",
        "Disaster recovery testing",
        "System hardening",
        "Security improvements"
      ]
    }
  ];

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
            Security Threats & Attacks
          </h1>
          <p className="text-xl text-gray-600">
            Learn about common security threats, attack methodologies, and defense strategies.
          </p>
        </div>

        {/* Threat Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Threats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {securityThreats.map((threat) => (
              <button
                key={threat.id}
                onClick={() => setSelectedThreat(threat.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedThreat === threat.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <threat.icon className="mr-2 text-red-600" size={20} />
                  <h3 className="font-semibold text-gray-800">{threat.name}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-2">{threat.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${getThreatLevelColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                  <span className="text-xs text-gray-500">{threat.category}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedThreat && (
            <div className="bg-gray-50 rounded-lg p-6">
              {(() => {
                const threat = securityThreats.find(t => t.id === selectedThreat);
                return (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">{threat?.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Attack Techniques:</h4>
                        <ul className="text-sm text-gray-600">
                          {threat?.techniques.map((technique, i) => (
                            <li key={i} className="mb-1">• {technique}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2">Indicators:</h4>
                        <ul className="text-sm text-gray-600">
                          {threat?.indicators.map((indicator, i) => (
                            <li key={i} className="mb-1">• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Mitigation:</h4>
                        <ul className="text-sm text-gray-600">
                          {threat?.mitigation.map((method, i) => (
                            <li key={i} className="mb-1">• {method}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Impact:</h4>
                        <p className="text-sm text-gray-600">{threat?.impact}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Attack Kill Chain */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cyber Attack Kill Chain</h2>
          <div className="space-y-4">
            {attackKillChain.map((phase, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-6">
                <h3 className="font-semibold text-gray-800 mb-1">{phase.phase}</h3>
                <p className="text-gray-600 mb-2">{phase.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-1">Activities:</h4>
                    <ul className="text-sm text-gray-600">
                      {phase.activities.map((activity, i) => (
                        <li key={i} className="mb-1">• {activity}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">Detection:</h4>
                    <p className="text-sm text-gray-600">{phase.detection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Assessment Matrix</h2>
            <div className="space-y-4">
              {Object.entries(riskAssessment).map(([level, data]) => (
                <div key={level} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 capitalize">{level} Risk</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${data.color}`}>
                      {data.likelihood} Likelihood
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Impact: {data.impact}</p>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Common Threats:</h4>
                    <ul className="text-sm text-gray-600">
                      {data.threats.map((threat, i) => (
                        <li key={i} className="mb-1">• {threat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Incident Log */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Incident Log</h2>
            <div className="space-y-3">
              {incidentLog.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{incident.type} Attack</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      incident.severity === 'High' ? 'bg-red-100 text-red-800' :
                      incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Target: {incident.target}</span>
                    <span className={`font-medium ${
                      incident.status === 'Mitigated' ? 'text-green-600' :
                      incident.status === 'Contained' ? 'text-blue-600' :
                      incident.status === 'Detected' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {incident.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defense Strategies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Defense Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defenseStrategies.map((defense, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
                  <defense.icon className="text-red-600" size={32} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-3">{defense.category}</h3>
                <ul className="text-sm text-gray-600 text-left">
                  {defense.strategies.map((strategy, i) => (
                    <li key={i} className="mb-2">• {strategy}</li>
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
