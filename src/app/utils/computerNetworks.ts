// Computer Networks utility functions

export interface DijkstraResult {
  distances: number[];
  previous: (number | null)[];
  path: number[];
}

export function dijkstraAlgorithm(
  graph: number[][],
  source: number
): DijkstraResult {
  const n = graph.length;
  const distances = new Array(n).fill(Infinity);
  const previous = new Array(n).fill(null);
  const visited = new Array(n).fill(false);
  
  distances[source] = 0;
  
  for (let count = 0; count < n - 1; count++) {
    // Find minimum distance vertex
    let minDistance = Infinity;
    let minVertex = -1;
    
    for (let v = 0; v < n; v++) {
      if (!visited[v] && distances[v] <= minDistance) {
        minDistance = distances[v];
        minVertex = v;
      }
    }
    
    if (minVertex === -1) break;
    
    visited[minVertex] = true;
    
    // Update distances
    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[minVertex][v] !== 0 && 
          distances[minVertex] !== Infinity &&
          distances[minVertex] + graph[minVertex][v] < distances[v]) {
        distances[v] = distances[minVertex] + graph[minVertex][v];
        previous[v] = minVertex;
      }
    }
  }
  
  return { distances, previous, path: [] };
}

export interface IPAddress {
  address: string;
  mask: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  class: string;
  isPrivate: boolean;
}

export function calculateIPDetails(ip: string, cidr: number): IPAddress {
  const ipParts = ip.split('.').map(Number);
  const ipDecimal = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
  
  const maskDecimal = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const mask = [
    (maskDecimal >>> 24) & 255,
    (maskDecimal >>> 16) & 255,
    (maskDecimal >>> 8) & 255,
    maskDecimal & 255
  ].join('.');
  
  const networkDecimal = ipDecimal & maskDecimal;
  const broadcastDecimal = networkDecimal | (~maskDecimal);
  
  const networkAddress = [
    (networkDecimal >>> 24) & 255,
    (networkDecimal >>> 16) & 255,
    (networkDecimal >>> 8) & 255,
    networkDecimal & 255
  ].join('.');
  
  const broadcastAddress = [
    (broadcastDecimal >>> 24) & 255,
    (broadcastDecimal >>> 16) & 255,
    (broadcastDecimal >>> 8) & 255,
    broadcastDecimal & 255
  ].join('.');
  
  const firstHost = [
    ((networkDecimal + 1) >>> 24) & 255,
    ((networkDecimal + 1) >>> 16) & 255,
    ((networkDecimal + 1) >>> 8) & 255,
    (networkDecimal + 1) & 255
  ].join('.');
  
  const lastHost = [
    ((broadcastDecimal - 1) >>> 24) & 255,
    ((broadcastDecimal - 1) >>> 16) & 255,
    ((broadcastDecimal - 1) >>> 8) & 255,
    (broadcastDecimal - 1) & 255
  ].join('.');
  
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = totalHosts - 2;
  
  const ipClass = getIPClass(ipParts[0]);
  const isPrivate = isPrivateIP(ip);
  
  return {
    address: ip,
    mask,
    cidr,
    networkAddress,
    broadcastAddress,
    firstHost,
    lastHost,
    totalHosts,
    usableHosts,
    class: ipClass,
    isPrivate
  };
}

function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  return "E";
}

function isPrivateIP(ip: string): boolean {
  const octets = ip.split('.').map(Number);
  const [first, second] = octets;
  
  return (
    (first === 10) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

export interface HuffmanNode {
  char: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

export function buildHuffmanTree(text: string): HuffmanNode | null {
  // Calculate frequencies
  const freqMap: {[char: string]: number} = {};
  for (const char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }
  
  // Create priority queue
  const nodes: HuffmanNode[] = Object.entries(freqMap).map(([char, freq]) => ({
    char,
    freq
  }));
  
  // Build tree
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    
    const merged: HuffmanNode = {
      char: `${left.char}+${right.char}`,
      freq: left.freq + right.freq,
      left,
      right
    };
    
    nodes.push(merged);
  }
  
  return nodes[0] || null;
}

export function generateHuffmanCodes(root: HuffmanNode): {[char: string]: string} {
  const codes: {[char: string]: string} = {};
  
  function traverse(node: HuffmanNode, code: string = '') {
    if (!node.left && !node.right) {
      codes[node.char] = code || '0';
      return;
    }
    
    if (node.left) traverse(node.left, code + '0');
    if (node.right) traverse(node.right, code + '1');
  }
  
  traverse(root);
  return codes;
}

export interface NetworkProtocol {
  name: string;
  layer: number;
  description: string;
  headerSize: number;
  features: string[];
}

export const commonProtocols: NetworkProtocol[] = [
  {
    name: "HTTP",
    layer: 7,
    description: "HyperText Transfer Protocol",
    headerSize: 20,
    features: ["Stateless", "Request-Response", "TCP-based"]
  },
  {
    name: "TCP",
    layer: 4,
    description: "Transmission Control Protocol",
    headerSize: 20,
    features: ["Reliable", "Connection-oriented", "Flow control"]
  },
  {
    name: "IP",
    layer: 3,
    description: "Internet Protocol",
    headerSize: 20,
    features: ["Routing", "Addressing", "Fragmentation"]
  },
  {
    name: "Ethernet",
    layer: 2,
    description: "Local Area Network Protocol",
    headerSize: 14,
    features: ["MAC addressing", "CSMA/CD", "Framing"]
  }
];

export interface SubnetCalculation {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  cidr: number;
}

export function calculateSubnets(
  networkIP: string,
  originalCIDR: number,
  requiredSubnets: number
): SubnetCalculation[] {
  const subnetBits = Math.ceil(Math.log2(requiredSubnets));
  const newCIDR = originalCIDR + subnetBits;
  
  if (newCIDR > 30) return [];
  
  const subnetSize = Math.pow(2, 32 - newCIDR);
  const networkDecimal = ipToDecimal(networkIP);
  
  const subnets: SubnetCalculation[] = [];
  
  for (let i = 0; i < Math.pow(2, subnetBits); i++) {
    const subnetNetwork = networkDecimal + (i * subnetSize);
    const subnetBroadcast = subnetNetwork + subnetSize - 1;
    
    subnets.push({
      networkAddress: decimalToIP(subnetNetwork),
      broadcastAddress: decimalToIP(subnetBroadcast),
      firstHost: decimalToIP(subnetNetwork + 1),
      lastHost: decimalToIP(subnetBroadcast - 1),
      usableHosts: subnetSize - 2,
      cidr: newCIDR
    });
  }
  
  return subnets;
}

function ipToDecimal(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function decimalToIP(decimal: number): string {
  return [
    (decimal >>> 24) & 255,
    (decimal >>> 16) & 255,
    (decimal >>> 8) & 255,
    decimal & 255
  ].join('.');
}
