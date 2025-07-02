"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IPCalculationResult {
  ipAddress: string;
  subnetMask: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  isPrivate: boolean;
  binaryIP: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
}

export default function IPAddressingPage() {
  const [ipInput, setIpInput] = useState("192.168.1.100");
  const [cidrInput, setCidrInput] = useState(24);
  const [result, setResult] = useState<IPCalculationResult | null>(null);
  const [subnets, setSubnets] = useState<any[]>([]);
  const [subnetRequirement, setSubnetRequirement] = useState({ subnets: 4, hosts: 50 });

  const ipToDecimal = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  };

  const decimalToIp = (decimal: number): string => {
    return [
      (decimal >>> 24) & 255,
      (decimal >>> 16) & 255,
      (decimal >>> 8) & 255,
      decimal & 255
    ].join('.');
  };

  const ipToBinary = (ip: string): string => {
    return ip.split('.').map(octet => {
      return parseInt(octet).toString(2).padStart(8, '0');
    }).join('.');
  };

  const getSubnetMask = (cidr: number): string => {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return decimalToIp(mask);
  };

  const getIPClass = (firstOctet: number): string => {
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D (Multicast)";
    if (firstOctet >= 240 && firstOctet <= 255) return "E (Reserved)";
    return "Invalid";
  };

  const isPrivateIP = (ip: string): boolean => {
    const octets = ip.split('.').map(Number);
    const [first, second] = octets;
    
    return (
      (first === 10) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 169 && second === 254) // Link-local
    );
  };

  const calculateIP = () => {
    try {
      const ipParts = ipInput.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(part => part < 0 || part > 255)) {
        throw new Error("Invalid IP address");
      }

      if (cidrInput < 0 || cidrInput > 32) {
        throw new Error("Invalid CIDR notation");
      }

      const ipDecimal = ipToDecimal(ipInput);
      const subnetMask = getSubnetMask(cidrInput);
      const maskDecimal = ipToDecimal(subnetMask);
      
      const networkDecimal = ipDecimal & maskDecimal;
      const broadcastDecimal = networkDecimal | (~maskDecimal >>> 0);
      
      const networkAddress = decimalToIp(networkDecimal);
      const broadcastAddress = decimalToIp(broadcastDecimal);
      const firstHost = decimalToIp(networkDecimal + 1);
      const lastHost = decimalToIp(broadcastDecimal - 1);
      
      const totalHosts = Math.pow(2, 32 - cidrInput);
      const usableHosts = totalHosts - 2; // Subtract network and broadcast
      
      const ipClass = getIPClass(ipParts[0]);
      const isPrivate = isPrivateIP(ipInput);

      const calculationResult: IPCalculationResult = {
        ipAddress: ipInput,
        subnetMask,
        cidr: cidrInput,
        networkAddress,
        broadcastAddress,
        firstHost,
        lastHost,
        totalHosts,
        usableHosts,
        ipClass,
        isPrivate,
        binaryIP: ipToBinary(ipInput),
        binaryMask: ipToBinary(subnetMask),
        binaryNetwork: ipToBinary(networkAddress),
        binaryBroadcast: ipToBinary(broadcastAddress)
      };

      setResult(calculationResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation error");
    }
  };

  const calculateSubnets = () => {
    if (!result) return;

    const requiredSubnets = subnetRequirement.subnets;
    const requiredHosts = subnetRequirement.hosts;
    
    // Calculate required subnet bits
    const subnetBits = Math.ceil(Math.log2(requiredSubnets));
    
    // Calculate required host bits
    const hostBits = Math.ceil(Math.log2(requiredHosts + 2)); // +2 for network and broadcast
    
    // New CIDR
    const newCidr = cidrInput + subnetBits;
    
    if (newCidr > 30) {
      alert("Cannot create subnets - not enough address space");
      return;
    }

    const subnetSize = Math.pow(2, 32 - newCidr);
    const networkDecimal = ipToDecimal(result.networkAddress);
    
    const calculatedSubnets = [];
    for (let i = 0; i < Math.pow(2, subnetBits); i++) {
      const subnetNetwork = networkDecimal + (i * subnetSize);
      const subnetBroadcast = subnetNetwork + subnetSize - 1;
      
      calculatedSubnets.push({
        subnetNumber: i,
        networkAddress: decimalToIp(subnetNetwork),
        broadcastAddress: decimalToIp(subnetBroadcast),
        firstHost: decimalToIp(subnetNetwork + 1),
        lastHost: decimalToIp(subnetBroadcast - 1),
        usableHosts: subnetSize - 2,
        cidr: newCidr
      });
    }
    
    setSubnets(calculatedSubnets);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            IP Address Calculator & Subnetting Tool
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Calculate network addresses, subnet masks, and perform subnetting operations for IPv4 addresses. 
            Perfect for network design and CCNA preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>IP Address Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">IP Address</label>
                <Input
                  type="text"
                  placeholder="192.168.1.100"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">CIDR Notation (Subnet Bits)</label>
                <Input
                  type="number"
                  min="1"
                  max="32"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(parseInt(e.target.value) || 24)}
                  className="w-full"
                />
              </div>

              <Button onClick={calculateIP} className="w-full">
                Calculate IP Details
              </Button>

              {/* Quick Examples */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Quick Examples:</h3>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { ip: "192.168.1.0", cidr: 24, desc: "Class C Private Network" },
                    { ip: "10.0.0.0", cidr: 8, desc: "Class A Private Network" },
                    { ip: "172.16.0.0", cidr: 16, desc: "Class B Private Network" },
                    { ip: "203.0.113.0", cidr: 24, desc: "Public Network Example" }
                  ].map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIpInput(example.ip);
                        setCidrInput(example.cidr);
                      }}
                      className="text-xs justify-start"
                    >
                      {example.ip}/{example.cidr} - {example.desc}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-gray-200">IP Address:</strong><br />
                      <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded">{result.ipAddress}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">Subnet Mask:</strong><br />
                      <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded">{result.subnetMask}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">Network Address:</strong><br />
                      <code className="bg-green-800 text-green-200 px-2 py-1 rounded">{result.networkAddress}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">Broadcast Address:</strong><br />
                      <code className="bg-red-800 text-red-200 px-2 py-1 rounded">{result.broadcastAddress}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">First Host:</strong><br />
                      <code className="bg-blue-800 text-blue-200 px-2 py-1 rounded">{result.firstHost}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">Last Host:</strong><br />
                      <code className="bg-blue-800 text-blue-200 px-2 py-1 rounded">{result.lastHost}</code>
                    </div>
                    <div>
                      <strong className="text-gray-200">Total Hosts:</strong><br />
                      <span className="font-mono text-gray-200">{result.totalHosts.toLocaleString()}</span>
                    </div>
                    <div>
                      <strong className="text-gray-200">Usable Hosts:</strong><br />
                      <span className="font-mono text-gray-200">{result.usableHosts.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-200">IP Class:</strong> <span className="text-gray-300">{result.ipClass}</span>
                      </div>
                      <div>
                        <strong className="text-gray-200">Type:</strong> <span className="text-gray-300">{result.isPrivate ? "Private" : "Public"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Binary Representation */}
        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Binary Representation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <strong className="text-gray-200">IP Address:</strong><br />
                  <code className="bg-gray-700 text-black p-2 rounded block">{result.binaryIP}</code>
                </div>
                <div>
                  <strong className="text-gray-200">Subnet Mask:</strong><br />
                  <code className="bg-yellow-700 text-black p-2 rounded block">{result.binaryMask}</code>
                </div>
                <div>
                  <strong className="text-gray-200">Network Address:</strong><br />
                  <code className="bg-green-700 text-black p-2 rounded block">{result.binaryNetwork}</code>
                </div>
                <div>
                  <strong className="text-gray-200">Broadcast Address:</strong><br />
                  <code className="bg-red-700 text-black p-2 rounded block">{result.binaryBroadcast}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subnetting Section */}
        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subnetting Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Required Subnets</label>
                  <Input
                    type="number"
                    min="2"
                    max="256"
                    value={subnetRequirement.subnets}
                    onChange={(e) => setSubnetRequirement({
                      ...subnetRequirement,
                      subnets: parseInt(e.target.value) || 2
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hosts per Subnet</label>
                  <Input
                    type="number"
                    min="2"
                    value={subnetRequirement.hosts}
                    onChange={(e) => setSubnetRequirement({
                      ...subnetRequirement,
                      hosts: parseInt(e.target.value) || 2
                    })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={calculateSubnets} className="w-full">
                    Calculate Subnets
                  </Button>
                </div>
              </div>

              {subnets.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Subnet Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600 text-sm">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">Subnet #</th>
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">Network</th>
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">First Host</th>
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">Last Host</th>
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">Broadcast</th>
                          <th className="border border-gray-600 px-2 py-2 text-gray-200">Usable Hosts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subnets.slice(0, 8).map((subnet, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                            <td className="border border-gray-600 px-2 py-2 text-center font-medium text-gray-200">
                              {subnet.subnetNumber}
                            </td>
                            <td className="border border-gray-600 px-2 py-2 text-gray-200">
                              <code className="text-gray-200">{subnet.networkAddress}/{subnet.cidr}</code>
                            </td>
                            <td className="border border-gray-600 px-2 py-2 text-gray-200">
                              <code className="text-gray-200">{subnet.firstHost}</code>
                            </td>
                            <td className="border border-gray-600 px-2 py-2 text-gray-200">
                              <code className="text-gray-200">{subnet.lastHost}</code>
                            </td>
                            <td className="border border-gray-600 px-2 py-2 text-gray-200">
                              <code className="text-gray-200">{subnet.broadcastAddress}</code>
                            </td>
                            <td className="border border-gray-600 px-2 py-2 text-center text-gray-200">
                              {subnet.usableHosts}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {subnets.length > 8 && (
                      <p className="text-sm text-gray-300 mt-2">
                        Showing first 8 subnets of {subnets.length} total subnets
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CIDR Reference */}
        <Card>
          <CardHeader>
            <CardTitle>CIDR Notation Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { cidr: "/24", mask: "255.255.255.0", hosts: "254", class: "C" },
                { cidr: "/25", mask: "255.255.255.128", hosts: "126", class: "C/2" },
                { cidr: "/26", mask: "255.255.255.192", hosts: "62", class: "C/4" },
                { cidr: "/27", mask: "255.255.255.224", hosts: "30", class: "C/8" },
                { cidr: "/28", mask: "255.255.255.240", hosts: "14", class: "C/16" },
                { cidr: "/29", mask: "255.255.255.248", hosts: "6", class: "C/32" },
                { cidr: "/30", mask: "255.255.255.252", hosts: "2", class: "Point-to-Point" },
                { cidr: "/16", mask: "255.255.0.0", hosts: "65,534", class: "B" }
              ].map((item, index) => (
                <div key={index} className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-sm">
                  <div className="font-bold text-blue-400">{item.cidr}</div>
                  <div className="text-xs text-gray-300">{item.mask}</div>
                  <div className="text-xs text-gray-200">Hosts: {item.hosts}</div>
                  <div className="text-xs text-gray-400">{item.class}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Study Notes & Exam Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-3">IP Address Classes (Historical)</h3>
                <ul className="space-y-1">
                  <li><strong>Class A:</strong> 1.0.0.0 to 126.255.255.255 (/8)</li>
                  <li><strong>Class B:</strong> 128.0.0.0 to 191.255.255.255 (/16)</li>
                  <li><strong>Class C:</strong> 192.0.0.0 to 223.255.255.255 (/24)</li>
                  <li><strong>Class D:</strong> 224.0.0.0 to 239.255.255.255 (Multicast)</li>
                  <li><strong>Class E:</strong> 240.0.0.0 to 255.255.255.255 (Reserved)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Private IP Ranges (RFC 1918)</h3>
                <ul className="space-y-1">
                  <li><strong>10.0.0.0/8:</strong> 10.0.0.0 to 10.255.255.255</li>
                  <li><strong>172.16.0.0/12:</strong> 172.16.0.0 to 172.31.255.255</li>
                  <li><strong>192.168.0.0/16:</strong> 192.168.0.0 to 192.168.255.255</li>
                  <li><strong>169.254.0.0/16:</strong> Link-local (APIPA)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Subnetting Quick Tips</h3>
                <ul className="space-y-1">
                  <li>• 2^n = Number of subnets (n = subnet bits)</li>
                  <li>• 2^h - 2 = Usable hosts (h = host bits)</li>
                  <li>• Always subtract 2 for network & broadcast</li>
                  <li>• /30 networks have only 2 usable hosts</li>
                  <li>• VLSM allows different subnet sizes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Common Exam Questions</h3>
                <ul className="space-y-1">
                  <li>• Calculate network address from IP/mask</li>
                  <li>• Find number of subnets and hosts</li>
                  <li>• Determine if two IPs are in same subnet</li>
                  <li>• Design subnetting scheme for requirements</li>
                  <li>• Convert between decimal and binary</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
