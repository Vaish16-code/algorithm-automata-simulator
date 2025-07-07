"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Network, Lock, Eye, AlertTriangle, Filter, Settings } from "lucide-react";

export default function NetworkSecurityPage() {
  const [selectedFirewallType, setSelectedFirewallType] = useState("packet-filtering");
  const [aclRules, setAclRules] = useState([
    { id: 1, action: "Allow", protocol: "TCP", srcIP: "192.168.1.0/24", dstIP: "10.0.0.5", port: "80" },
    { id: 2, action: "Deny", protocol: "TCP", srcIP: "0.0.0.0/0", dstIP: "10.0.0.5", port: "22" },
    { id: 3, action: "Allow", protocol: "UDP", srcIP: "192.168.1.0/24", dstIP: "8.8.8.8", port: "53" }
  ]);
  const [newRule, setNewRule] = useState({
    action: "Allow",
    protocol: "TCP",
    srcIP: "",
    dstIP: "",
    port: ""
  });
  const [testPacket, setTestPacket] = useState({
    srcIP: "192.168.1.100",
    dstIP: "10.0.0.5",
    protocol: "TCP",
    port: "80"
  });
  const [packetResult, setPacketResult] = useState("");

  const firewallTypes = [
    {
      id: "packet-filtering",
      name: "Packet Filtering Firewall",
      description: "Examines packets at network layer, makes decisions based on IP addresses, ports, and protocols",
      pros: ["Fast", "Low cost", "Transparent to users"],
      cons: ["Limited inspection", "No application awareness", "Vulnerable to IP spoofing"]
    },
    {
      id: "stateful",
      name: "Stateful Inspection Firewall",
      description: "Tracks connection state and makes decisions based on context of traffic",
      pros: ["Connection tracking", "Better security", "Protocol awareness"],
      cons: ["Higher resource usage", "More complex", "Potential bottleneck"]
    },
    {
      id: "application",
      name: "Application Layer Firewall",
      description: "Operates at application layer, can inspect application-specific data",
      pros: ["Deep inspection", "Application awareness", "Content filtering"],
      cons: ["High overhead", "Performance impact", "Complex configuration"]
    }
  ];

  const networkSecurityTools = [
    {
      name: "Intrusion Detection System (IDS)",
      description: "Monitors network traffic for malicious activity",
      types: ["Network-based IDS", "Host-based IDS", "Hybrid IDS"],
      icon: Eye
    },
    {
      name: "Intrusion Prevention System (IPS)",
      description: "Actively blocks detected threats in real-time",
      types: ["Network-based IPS", "Host-based IPS", "Wireless IPS"],
      icon: Shield
    },
    {
      name: "Virtual Private Network (VPN)",
      description: "Creates secure encrypted tunnels over public networks",
      types: ["Site-to-Site VPN", "Remote Access VPN", "SSL VPN"],
      icon: Lock
    },
    {
      name: "Network Segmentation",
      description: "Divides network into smaller, isolated segments",
      types: ["VLANs", "Subnets", "DMZ", "Air-gapped networks"],
      icon: Network
    }
  ];

  const addAclRule = () => {
    if (newRule.srcIP && newRule.dstIP && newRule.port) {
      setAclRules([...aclRules, { id: Date.now(), ...newRule }]);
      setNewRule({ action: "Allow", protocol: "TCP", srcIP: "", dstIP: "", port: "" });
    }
  };

  const removeAclRule = (id: number) => {
    setAclRules(aclRules.filter(rule => rule.id !== id));
  };

  const testFirewallRule = () => {
    // Simple firewall rule testing logic
    let result = "Deny (Default)";
    
    for (const rule of aclRules) {
      const srcMatch = rule.srcIP === "0.0.0.0/0" || testPacket.srcIP.startsWith(rule.srcIP.split('/')[0].slice(0, -1));
      const dstMatch = rule.dstIP === testPacket.dstIP || testPacket.dstIP.startsWith(rule.dstIP.split('/')[0].slice(0, -1));
      const protocolMatch = rule.protocol === testPacket.protocol;
      const portMatch = rule.port === testPacket.port;
      
      if (srcMatch && dstMatch && protocolMatch && portMatch) {
        result = `${rule.action} (Rule ${rule.id})`;
        break;
      }
    }
    
    setPacketResult(result);
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
            Network Security
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive network security concepts including firewalls, VPNs, and intrusion detection systems.
          </p>
        </div>

        {/* Firewall Types */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Firewall Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {firewallTypes.map((firewall) => (
              <button
                key={firewall.id}
                onClick={() => setSelectedFirewallType(firewall.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedFirewallType === firewall.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{firewall.name}</h3>
                <p className="text-sm text-gray-600">{firewall.description}</p>
              </button>
            ))}
          </div>
          
          {selectedFirewallType && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                {firewallTypes.find(f => f.id === selectedFirewallType)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Advantages:</h4>
                  <ul className="text-sm text-gray-600">
                    {firewallTypes.find(f => f.id === selectedFirewallType)?.pros.map((pro, i) => (
                      <li key={i} className="mb-1">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Disadvantages:</h4>
                  <ul className="text-sm text-gray-600">
                    {firewallTypes.find(f => f.id === selectedFirewallType)?.cons.map((con, i) => (
                      <li key={i} className="mb-1">• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Network Security Tools */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Network Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkSecurityTools.map((tool, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <tool.icon className="text-red-600 mr-3" size={24} />
                  <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                </div>
                <p className="text-gray-600 mb-3">{tool.description}</p>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Types:</h4>
                  <ul className="text-sm text-gray-600">
                    {tool.types.map((type, i) => (
                      <li key={i} className="mb-1">• {type}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACL Rule Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Control List (ACL) Builder</h2>
            
            {/* Add New Rule */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Rule</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Allow">Allow</option>
                  <option value="Deny">Deny</option>
                </select>
                <select
                  value={newRule.protocol}
                  onChange={(e) => setNewRule({...newRule, protocol: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Source IP (e.g., 192.168.1.0/24)"
                  value={newRule.srcIP}
                  onChange={(e) => setNewRule({...newRule, srcIP: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="Destination IP"
                  value={newRule.dstIP}
                  onChange={(e) => setNewRule({...newRule, dstIP: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="Port"
                  value={newRule.port}
                  onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={addAclRule}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Add Rule
              </button>
            </div>

            {/* Current Rules */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Current ACL Rules</h3>
              <div className="space-y-2">
                {aclRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="text-sm">
                      <span className={`font-medium ${rule.action === 'Allow' ? 'text-green-600' : 'text-red-600'}`}>
                        {rule.action}
                      </span>
                      <span className="text-gray-600 ml-2">
                        {rule.protocol} {rule.srcIP} → {rule.dstIP}:{rule.port}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAclRule(rule.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Firewall Tester */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Firewall Rule Tester</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Packet Configuration
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Source IP"
                    value={testPacket.srcIP}
                    onChange={(e) => setTestPacket({...testPacket, srcIP: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Destination IP"
                    value={testPacket.dstIP}
                    onChange={(e) => setTestPacket({...testPacket, dstIP: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <select
                    value={testPacket.protocol}
                    onChange={(e) => setTestPacket({...testPacket, protocol: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Port"
                    value={testPacket.port}
                    onChange={(e) => setTestPacket({...testPacket, port: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                onClick={testFirewallRule}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Test Packet
              </button>

              {packetResult && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Test Result:</h3>
                  <div className={`p-3 rounded-md ${
                    packetResult.includes('Allow') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {packetResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Network Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Defense in Depth</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multiple layers of security controls</li>
                <li>• Network segmentation</li>
                <li>• Regular security audits</li>
                <li>• Continuous monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Access Control</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Principle of least privilege</li>
                <li>• Strong authentication</li>
                <li>• Regular access reviews</li>
                <li>• Network access control (NAC)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
