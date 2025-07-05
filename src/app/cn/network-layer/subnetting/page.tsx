"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Calculator, Play } from "lucide-react";

interface SubnetInfo {
  subnetId: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
}

interface SubnettingResult {
  originalNetwork: string;
  subnetBitsNeeded: number;
  newCidr: number;
  maxHostsOriginal: number;
  hostsPerSubnet: number;
  subnets: SubnetInfo[];
}

export default function SubnettingPage() {
  const [ipAddress, setIpAddress] = useState("192.168.1.0");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [cidr, setCidr] = useState(24);
  const [requiredSubnets, setRequiredSubnets] = useState(4);
  const [subnettingResult, setSubnettingResult] = useState<SubnettingResult | null>(null);

  const calculateSubnetting = () => {
    // Basic subnetting calculation
    const hostBits = 32 - cidr;
    const maxHosts = Math.pow(2, hostBits) - 2;
    const subnetBits = Math.ceil(Math.log2(requiredSubnets));
    const newCidr = cidr + subnetBits;
    const newHostBits = 32 - newCidr;
    const hostsPerSubnet = Math.pow(2, newHostBits) - 2;
    
    const subnets: SubnetInfo[] = [];
    const ipParts = ipAddress.split('.').map(Number);
    let baseIp = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    
    for (let i = 0; i < requiredSubnets; i++) {
      const subnetAddress = baseIp + (i * Math.pow(2, newHostBits));
      const networkAddress = [
        (subnetAddress >>> 24) & 255,
        (subnetAddress >>> 16) & 255,
        (subnetAddress >>> 8) & 255,
        subnetAddress & 255
      ].join('.');
      
      const broadcastAddress = [
        ((subnetAddress + Math.pow(2, newHostBits) - 1) >>> 24) & 255,
        ((subnetAddress + Math.pow(2, newHostBits) - 1) >>> 16) & 255,
        ((subnetAddress + Math.pow(2, newHostBits) - 1) >>> 8) & 255,
        (subnetAddress + Math.pow(2, newHostBits) - 1) & 255
      ].join('.');
      
      const firstHost = [
        (subnetAddress >>> 24) & 255,
        (subnetAddress >>> 16) & 255,
        (subnetAddress >>> 8) & 255,
        (subnetAddress & 255) + 1
      ].join('.');
      
      const lastHost = [
        ((subnetAddress + Math.pow(2, newHostBits) - 2) >>> 24) & 255,
        ((subnetAddress + Math.pow(2, newHostBits) - 2) >>> 16) & 255,
        ((subnetAddress + Math.pow(2, newHostBits) - 2) >>> 8) & 255,
        (subnetAddress + Math.pow(2, newHostBits) - 2) & 255
      ].join('.');
      
      subnets.push({
        subnetId: `Subnet ${i + 1}`,
        networkAddress: networkAddress,
        broadcastAddress: broadcastAddress,
        firstHost: firstHost,
        lastHost: lastHost,
        totalHosts: Math.pow(2, newHostBits),
        usableHosts: hostsPerSubnet
      });
    }
    
    const result: SubnettingResult = {
      originalNetwork: `${ipAddress}/${cidr}`,
      maxHostsOriginal: maxHosts,
      subnetBitsNeeded: subnetBits,
      newCidr: newCidr,
      hostsPerSubnet: hostsPerSubnet,
      subnets: subnets
    };
    
    setSubnettingResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/network-layer" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">IP Subnetting</h1>
              <p className="text-green-100 text-lg">Subnet calculation and VLSM techniques</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Subnet Calculation</h3>
              <p className="text-sm text-green-100">Calculate network, broadcast, and host ranges</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">VLSM Support</h3>
              <p className="text-sm text-green-100">Variable Length Subnet Masking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Interactive Tools</h3>
              <p className="text-sm text-green-100">Step-by-step subnet planning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subnet Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Subnet Calculator
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="192.168.1.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIDR Notation</label>
              <input
                type="number"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value))}
                min="8"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Subnets</label>
              <input
                type="number"
                value={requiredSubnets}
                onChange={(e) => setRequiredSubnets(parseInt(e.target.value))}
                min="2"
                max="256"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={calculateSubnetting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Calculate</span>
              </button>
            </div>
          </div>

          {/* Results */}
          {subnettingResult && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Subnetting Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div><strong>Original Network:</strong> {subnettingResult.originalNetwork}</div>
                  <div><strong>Subnet Bits Needed:</strong> {subnettingResult.subnetBitsNeeded}</div>
                  <div><strong>New CIDR:</strong> /{subnettingResult.newCidr}</div>
                  <div><strong>Original Max Hosts:</strong> {subnettingResult.maxHostsOriginal}</div>
                  <div><strong>Hosts per Subnet:</strong> {subnettingResult.hostsPerSubnet}</div>
                  <div><strong>Total Subnets:</strong> {subnettingResult.subnets.length}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Subnet Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Subnet #</th>
                        <th className="border border-gray-300 px-4 py-2">Network Address</th>
                        <th className="border border-gray-300 px-4 py-2">First Host</th>
                        <th className="border border-gray-300 px-4 py-2">Last Host</th>
                        <th className="border border-gray-300 px-4 py-2">Broadcast</th>
                        <th className="border border-gray-300 px-4 py-2">Hosts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subnettingResult.subnets.map((subnet, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2 text-center font-medium">{subnet.subnetId}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{subnet.networkAddress}/{subnettingResult.newCidr}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{subnet.firstHost}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{subnet.lastHost}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{subnet.broadcastAddress}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subnet.usableHosts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theory Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Subnetting Concepts</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Key Formulas</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div><strong>Number of Subnets:</strong> 2^(subnet bits)</div>
                  <div><strong>Hosts per Subnet:</strong> 2^(host bits) - 2</div>
                  <div><strong>Subnet Increment:</strong> 256 - subnet mask octet</div>
                  <div><strong>Network Address:</strong> IP AND Subnet Mask</div>
                  <div><strong>Broadcast Address:</strong> Next network - 1</div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">VLSM Benefits</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Efficient IP address utilization</li>
                  <li>• Different subnet sizes for different needs</li>
                  <li>• Reduced routing table entries</li>
                  <li>• Better network organization</li>
                  <li>• Supports route summarization</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Subnetting Steps</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Determine number of subnets needed</li>
                <li>2. Determine number of hosts per subnet needed</li>
                <li>3. Calculate subnet bits required (2^n ≥ subnets needed)</li>
                <li>4. Calculate new subnet mask</li>
                <li>5. Calculate subnet increment</li>
                <li>6. List all subnet ranges</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Points to Remember</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Know powers of 2 (2^1 to 2^16)</li>
                <li>• Understand CIDR notation (/24, /25, etc.)</li>
                <li>• Remember: Hosts = 2^host_bits - 2</li>
                <li>• Network and broadcast addresses cannot be assigned</li>
                <li>• VLSM allows variable subnet sizes</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Subnet 192.168.1.0/24 into 8 subnets" (8 marks)</li>
                <li>• "Calculate hosts per subnet for /26" (3 marks)</li>
                <li>• "Design VLSM for given requirements" (10 marks)</li>
                <li>• "Find network and broadcast addresses" (5 marks)</li>
                <li>• "Convert between CIDR and subnet mask" (4 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
