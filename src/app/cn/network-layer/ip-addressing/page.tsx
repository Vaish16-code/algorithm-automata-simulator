"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Globe, Calculator, Play, RotateCcw } from "lucide-react";

interface IPAddress {
  address: string;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  cidr: number;
  class: string;
}

export default function IPAddressingPage() {
  const [ipInput, setIpInput] = useState("192.168.1.100");
  const [subnetInput, setSubnetInput] = useState("255.255.255.0");
  const [cidrInput, setCidrInput] = useState(24);
  const [result, setResult] = useState<IPAddress | null>(null);
  const [subnets, setSubnets] = useState<IPAddress[]>([]);

  const getIPClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
    if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
    if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
    if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
    if (firstOctet >= 240 && firstOctet <= 255) return "Class E (Reserved)";
    return "Invalid";
  };

  const ipToNumber = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  };

  const numberToIp = (num: number): string => {
    return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
  };

  const cidrToSubnetMask = (cidr: number): string => {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return numberToIp(mask);
  };

  const subnetMaskToCidr = (mask: string): number => {
    const maskNum = ipToNumber(mask);
    return 32 - Math.log2((~maskNum >>> 0) + 1);
  };

  const calculateSubnet = () => {
    try {
      const ipNum = ipToNumber(ipInput);
      const maskNum = ipToNumber(subnetInput);
      const networkNum = ipNum & maskNum;
      const broadcastNum = networkNum | (~maskNum >>> 0);
      const totalHosts = (~maskNum >>> 0) + 1;
      const usableHosts = totalHosts - 2; // Subtract network and broadcast

      const ipResult: IPAddress = {
        address: ipInput,
        subnetMask: subnetInput,
        networkAddress: numberToIp(networkNum),
        broadcastAddress: numberToIp(broadcastNum),
        firstHost: numberToIp(networkNum + 1),
        lastHost: numberToIp(broadcastNum - 1),
        totalHosts: usableHosts,
        cidr: subnetMaskToCidr(subnetInput),
        class: getIPClass(ipInput)
      };

      setResult(ipResult);
    } catch (error) {
      alert("Invalid IP address or subnet mask format!");
    }
  };

  const calculateVLSM = () => {
    try {
      const networkBase = ipToNumber(ipInput);
      const maskBits = cidrInput;
      const subnetBits = 8 - maskBits % 8; // Simplified for demo
      const numSubnets = Math.pow(2, subnetBits);
      const hostsPerSubnet = Math.pow(2, 32 - maskBits - subnetBits) - 2;
      
      const vlsmSubnets: IPAddress[] = [];
      const subnetMask = cidrToSubnetMask(maskBits + subnetBits);
      
      for (let i = 0; i < Math.min(numSubnets, 8); i++) {
        const subnetNetwork = networkBase + (i * (hostsPerSubnet + 2));
        const subnetBroadcast = subnetNetwork + hostsPerSubnet + 1;
        
        vlsmSubnets.push({
          address: numberToIp(subnetNetwork),
          subnetMask: subnetMask,
          networkAddress: numberToIp(subnetNetwork),
          broadcastAddress: numberToIp(subnetBroadcast),
          firstHost: numberToIp(subnetNetwork + 1),
          lastHost: numberToIp(subnetBroadcast - 1),
          totalHosts: hostsPerSubnet,
          cidr: maskBits + subnetBits,
          class: getIPClass(numberToIp(subnetNetwork))
        });
      }
      
      setSubnets(vlsmSubnets);
    } catch (error) {
      alert("Invalid network configuration!");
    }
  };

  const reset = () => {
    setResult(null);
    setSubnets([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/network-layer" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">IP Addressing & Subnetting</h1>
              <p className="text-blue-100 text-lg">IPv4 address calculation, subnetting, and VLSM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Address Space</h3>
              <p className="text-sm text-blue-100">32-bit IPv4 addresses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Subnetting</h3>
              <p className="text-sm text-blue-100">CIDR and VLSM support</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Classes</h3>
              <p className="text-sm text-blue-100">A, B, C, D, E classification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* IP Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">IP Address Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subnet Mask</label>
              <input
                type="text"
                value={subnetInput}
                onChange={(e) => setSubnetInput(e.target.value)}
                placeholder="255.255.255.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={calculateSubnet}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate Subnet</span>
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Subnet Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">IP Address:</span>
                  <span className="ml-2 font-mono text-blue-600">{result.address}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Subnet Mask:</span>
                  <span className="ml-2 font-mono text-blue-600">{result.subnetMask}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Network Address:</span>
                  <span className="ml-2 font-mono text-green-600">{result.networkAddress}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Broadcast Address:</span>
                  <span className="ml-2 font-mono text-red-600">{result.broadcastAddress}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">First Host:</span>
                  <span className="ml-2 font-mono text-purple-600">{result.firstHost}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Host:</span>
                  <span className="ml-2 font-mono text-purple-600">{result.lastHost}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Hosts:</span>
                  <span className="ml-2 font-mono text-orange-600">{result.totalHosts}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CIDR Notation:</span>
                  <span className="ml-2 font-mono text-indigo-600">/{result.cidr}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">IP Class:</span>
                  <span className="ml-2 text-yellow-600">{result.class}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VLSM Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">VLSM (Variable Length Subnet Masking)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Address</label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="192.168.1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIDR Prefix</label>
              <input
                type="number"
                value={cidrInput}
                onChange={(e) => setCidrInput(parseInt(e.target.value) || 24)}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={calculateVLSM}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 mb-6"
          >
            <Play className="h-4 w-4" />
            <span>Generate Subnets</span>
          </button>

          {subnets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Subnets</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Subnet</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Network</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Broadcast</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Host Range</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Hosts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subnets.map((subnet, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="border border-gray-300 px-4 py-2 font-mono">
                          {subnet.networkAddress}/{subnet.cidr}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-green-600">
                          {subnet.networkAddress}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-red-600">
                          {subnet.broadcastAddress}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-purple-600">
                          {subnet.firstHost} - {subnet.lastHost}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-orange-600">
                          {subnet.totalHosts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* IP Classes Reference */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">IP Address Classes</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Default Mask</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Networks</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hosts/Network</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Class A</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">1.0.0.0 - 126.255.255.255</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">255.0.0.0 (/8)</td>
                  <td className="border border-gray-300 px-4 py-2">126</td>
                  <td className="border border-gray-300 px-4 py-2">16,777,214</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Class B</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">128.0.0.0 - 191.255.255.255</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">255.255.0.0 (/16)</td>
                  <td className="border border-gray-300 px-4 py-2">16,384</td>
                  <td className="border border-gray-300 px-4 py-2">65,534</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Class C</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">192.0.0.0 - 223.255.255.255</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">255.255.255.0 (/24)</td>
                  <td className="border border-gray-300 px-4 py-2">2,097,152</td>
                  <td className="border border-gray-300 px-4 py-2">254</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Class D</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">224.0.0.0 - 239.255.255.255</td>
                  <td className="border border-gray-300 px-4 py-2">N/A</td>
                  <td className="border border-gray-300 px-4 py-2">Multicast</td>
                  <td className="border border-gray-300 px-4 py-2">N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Class E</td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">240.0.0.0 - 255.255.255.255</td>
                  <td className="border border-gray-300 px-4 py-2">N/A</td>
                  <td className="border border-gray-300 px-4 py-2">Reserved</td>
                  <td className="border border-gray-300 px-4 py-2">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Private IP Ranges */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Private IP Address Ranges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Class A Private</h3>
              <p className="text-sm text-blue-600 font-mono">10.0.0.0 - 10.255.255.255</p>
              <p className="text-xs text-blue-500 mt-1">10.0.0.0/8 - 1 network, 16M hosts</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Class B Private</h3>
              <p className="text-sm text-green-600 font-mono">172.16.0.0 - 172.31.255.255</p>
              <p className="text-xs text-green-500 mt-1">172.16.0.0/12 - 16 networks, 65K hosts each</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Class C Private</h3>
              <p className="text-sm text-purple-600 font-mono">192.168.0.0 - 192.168.255.255</p>
              <p className="text-xs text-purple-500 mt-1">192.168.0.0/16 - 256 networks, 254 hosts each</p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Special Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Loopback:</span>
                <span className="ml-2 font-mono text-blue-600">127.0.0.1 - 127.255.255.255</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Link-Local:</span>
                <span className="ml-2 font-mono text-blue-600">169.254.0.0 - 169.254.255.255</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Multicast:</span>
                <span className="ml-2 font-mono text-blue-600">224.0.0.0 - 239.255.255.255</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Broadcast:</span>
                <span className="ml-2 font-mono text-blue-600">255.255.255.255</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
