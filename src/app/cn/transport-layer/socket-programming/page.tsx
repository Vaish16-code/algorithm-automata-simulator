"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Code, Server, Globe, Terminal, Play, Copy, CheckCircle } from "lucide-react";

export default function SocketProgrammingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedSocketType, setSelectedSocketType] = useState("tcp");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [serverPort, setServerPort] = useState(8080);
  const [clientMessage, setClientMessage] = useState("Hello, Server!");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const languages = ["python", "java", "c", "javascript"];
  const socketTypes = ["tcp", "udp"];

  const socketConcepts = [
    {
      name: "Socket",
      description: "Endpoint for communication between processes",
      types: ["Stream Socket (TCP)", "Datagram Socket (UDP)", "Raw Socket"],
      characteristics: ["IP address + Port number", "Bidirectional communication", "Network abstraction"]
    },
    {
      name: "Client-Server Model",
      description: "Communication pattern with server listening and client connecting",
      types: ["One-to-One", "One-to-Many", "Many-to-One"],
      characteristics: ["Server binds to port", "Client connects to server", "Request-response pattern"]
    },
    {
      name: "TCP Socket",
      description: "Connection-oriented, reliable stream socket",
      types: ["Blocking I/O", "Non-blocking I/O", "Multiplexed I/O"],
      characteristics: ["Connection establishment", "Reliable delivery", "Flow control"]
    },
    {
      name: "UDP Socket",
      description: "Connectionless, unreliable datagram socket",
      types: ["Unicast", "Multicast", "Broadcast"],
      characteristics: ["No connection setup", "Fast transmission", "No delivery guarantee"]
    }
  ];

  const codeExamples = {
    python: {
      tcp: {
        server: `import socket
import threading

def handle_client(client_socket, address):
    print(f"Connection from {address}")
    
    while True:
        try:
            message = client_socket.recv(1024).decode('utf-8')
            if not message:
                break
            
            print(f"Received: {message}")
            
            # Echo the message back
            client_socket.send(f"Echo: {message}".encode('utf-8'))
            
        except Exception as e:
            print(f"Error: {e}")
            break
    
    client_socket.close()

def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    server.bind(('localhost', 8080))
    server.listen(5)
    
    print("Server listening on port 8080...")
    
    while True:
        client_socket, address = server.accept()
        client_thread = threading.Thread(
            target=handle_client, 
            args=(client_socket, address)
        )
        client_thread.start()

if __name__ == "__main__":
    start_server()`,
        client: `import socket

def start_client():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        client.connect(('localhost', 8080))
        print("Connected to server")
        
        while True:
            message = input("Enter message (or 'quit' to exit): ")
            
            if message.lower() == 'quit':
                break
                
            client.send(message.encode('utf-8'))
            
            response = client.recv(1024).decode('utf-8')
            print(f"Server response: {response}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    start_client()`
      },
      udp: {
        server: `import socket

def start_udp_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind(('localhost', 8080))
    
    print("UDP Server listening on port 8080...")
    
    while True:
        try:
            message, client_address = server.recvfrom(1024)
            print(f"Received from {client_address}: {message.decode('utf-8')}")
            
            # Echo the message back
            response = f"Echo: {message.decode('utf-8')}"
            server.sendto(response.encode('utf-8'), client_address)
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    start_udp_server()`,
        client: `import socket

def start_udp_client():
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_address = ('localhost', 8080)
    
    try:
        while True:
            message = input("Enter message (or 'quit' to exit): ")
            
            if message.lower() == 'quit':
                break
                
            client.sendto(message.encode('utf-8'), server_address)
            
            response, _ = client.recvfrom(1024)
            print(f"Server response: {response.decode('utf-8')}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    start_udp_client()`
      }
    },
    java: {
      tcp: {
        server: `import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class TCPServer {
    private static final int PORT = 8080;
    private static final int THREAD_POOL_SIZE = 10;
    
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server listening on port " + PORT);
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                executor.submit(new ClientHandler(clientSocket));
            }
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
        }
    }
    
    static class ClientHandler implements Runnable {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
                 PrintWriter out = new PrintWriter(
                    clientSocket.getOutputStream(), true)) {
                
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    System.out.println("Received: " + inputLine);
                    out.println("Echo: " + inputLine);
                }
                
            } catch (IOException e) {
                System.err.println("Client handler error: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    System.err.println("Error closing socket: " + e.getMessage());
                }
            }
        }
    }
}`,
        client: `import java.io.*;
import java.net.*;
import java.util.Scanner;

public class TCPClient {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 8080;
    
    public static void main(String[] args) {
        try (Socket socket = new Socket(SERVER_ADDRESS, SERVER_PORT);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
             Scanner scanner = new Scanner(System.in)) {
            
            System.out.println("Connected to server");
            
            String userInput;
            while (true) {
                System.out.print("Enter message (or 'quit' to exit): ");
                userInput = scanner.nextLine();
                
                if ("quit".equalsIgnoreCase(userInput)) {
                    break;
                }
                
                out.println(userInput);
                String response = in.readLine();
                System.out.println("Server response: " + response);
            }
            
        } catch (IOException e) {
            System.err.println("Client error: " + e.getMessage());
        }
    }
}`
      },
      udp: {
        server: `import java.net.*;
import java.io.*;

public class UDPServer {
    private static final int PORT = 8080;
    private static final int BUFFER_SIZE = 1024;
    
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket(PORT)) {
            System.out.println("UDP Server listening on port " + PORT);
            
            byte[] buffer = new byte[BUFFER_SIZE];
            
            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);
                
                String message = new String(packet.getData(), 0, packet.getLength());
                System.out.println("Received: " + message);
                
                String response = "Echo: " + message;
                byte[] responseData = response.getBytes();
                
                DatagramPacket responsePacket = new DatagramPacket(
                    responseData, 
                    responseData.length, 
                    packet.getAddress(), 
                    packet.getPort()
                );
                
                socket.send(responsePacket);
            }
            
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
        }
    }
}`,
        client: `import java.net.*;
import java.io.*;
import java.util.Scanner;

public class UDPClient {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 8080;
    private static final int BUFFER_SIZE = 1024;
    
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket();
             Scanner scanner = new Scanner(System.in)) {
            
            InetAddress serverAddress = InetAddress.getByName(SERVER_ADDRESS);
            
            while (true) {
                System.out.print("Enter message (or 'quit' to exit): ");
                String message = scanner.nextLine();
                
                if ("quit".equalsIgnoreCase(message)) {
                    break;
                }
                
                byte[] data = message.getBytes();
                DatagramPacket packet = new DatagramPacket(
                    data, 
                    data.length, 
                    serverAddress, 
                    SERVER_PORT
                );
                
                socket.send(packet);
                
                byte[] buffer = new byte[BUFFER_SIZE];
                DatagramPacket responsePacket = new DatagramPacket(buffer, buffer.length);
                socket.receive(responsePacket);
                
                String response = new String(responsePacket.getData(), 0, responsePacket.getLength());
                System.out.println("Server response: " + response);
            }
            
        } catch (IOException e) {
            System.err.println("Client error: " + e.getMessage());
        }
    }
}`
      }
    }
  };

  const socketFunctions = [
    {
      name: "socket()",
      description: "Create a new socket",
      parameters: ["domain (AF_INET, AF_INET6)", "type (SOCK_STREAM, SOCK_DGRAM)", "protocol"],
      usage: "Creates endpoint for communication"
    },
    {
      name: "bind()",
      description: "Bind socket to address",
      parameters: ["socket descriptor", "address structure", "address length"],
      usage: "Associates socket with local address and port"
    },
    {
      name: "listen()",
      description: "Listen for connections",
      parameters: ["socket descriptor", "backlog queue size"],
      usage: "Marks socket as passive, ready to accept connections"
    },
    {
      name: "accept()",
      description: "Accept incoming connection",
      parameters: ["socket descriptor", "client address", "address length"],
      usage: "Blocks until client connects, returns new socket"
    },
    {
      name: "connect()",
      description: "Connect to remote socket",
      parameters: ["socket descriptor", "server address", "address length"],
      usage: "Establishes connection to server"
    },
    {
      name: "send()/recv()",
      description: "Send/receive data",
      parameters: ["socket descriptor", "buffer", "length", "flags"],
      usage: "Transfer data over established connection"
    }
  ];

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const simulateConnection = () => {
    if (connectionStatus === "disconnected") {
      setConnectionStatus("connecting");
      setTimeout(() => {
        setConnectionStatus("connected");
        setChatLog(prev => [...prev, `${selectedSocketType.toUpperCase()} connection established on port ${serverPort}`]);
      }, 1000);
    } else {
      setConnectionStatus("disconnected");
      setChatLog(prev => [...prev, "Connection closed"]);
    }
  };

  const sendMessage = () => {
    if (connectionStatus === "connected" && clientMessage.trim()) {
      setChatLog(prev => [...prev, `Client: ${clientMessage}`]);
      setTimeout(() => {
        setChatLog(prev => [...prev, `Server: Echo - ${clientMessage}`]);
      }, 500);
      setClientMessage("");
    }
  };

  const getCurrentCode = (type: 'server' | 'client') => {
    // @ts-ignore
    return codeExamples[selectedLanguage]?.[selectedSocketType]?.[type] || "Code not available";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2" size={20} />
            Back to Transport Layer
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Socket Programming
          </h1>
          <p className="text-xl text-gray-600">
            Learn network programming with sockets, client-server communication, and protocol implementation.
          </p>
        </div>

        {/* Socket Concepts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Socket Programming Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socketConcepts.map((concept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{concept.name}</h3>
                <p className="text-gray-600 mb-3">{concept.description}</p>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">Types:</h4>
                    <ul className="text-sm text-gray-600">
                      {concept.types.map((type, i) => (
                        <li key={i} className="mb-1">• {type}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-1">Key Characteristics:</h4>
                    <ul className="text-sm text-gray-600">
                      {concept.characteristics.map((char, i) => (
                        <li key={i} className="mb-1">• {char}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Socket Functions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Socket API Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socketFunctions.map((func, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Code className="mr-2 text-blue-600" size={18} />
                  <h3 className="font-semibold text-gray-800">{func.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{func.description}</p>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm mb-1">Parameters:</h4>
                    <ul className="text-xs text-gray-600">
                      {func.parameters.map((param, i) => (
                        <li key={i} className="mb-1">• {param}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 text-sm mb-1">Usage:</h4>
                    <p className="text-xs text-gray-600">{func.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Simulator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Socket Communication Simulator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Socket Type:</label>
                  <select
                    value={selectedSocketType}
                    onChange={(e) => setSelectedSocketType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Server Port:</label>
                  <input
                    type="number"
                    value={serverPort}
                    onChange={(e) => setServerPort(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={simulateConnection}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    connectionStatus === "connected"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {connectionStatus === "connected" ? "Disconnect" : "Connect"}
                </button>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-500" :
                    connectionStatus === "connecting" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}></div>
                  <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
                </div>
              </div>

              {connectionStatus === "connected" && (
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Enter message to send"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!clientMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Communication Log</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {chatLog.length === 0 ? (
                  <p className="text-gray-500 text-sm">No communication yet</p>
                ) : (
                  chatLog.map((message, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-mono text-gray-700">{message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Code Examples</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Protocol:</label>
              <select
                value={selectedSocketType}
                onChange={(e) => setSelectedSocketType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {socketTypes.map((type) => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Server Code</h3>
                <button
                  onClick={() => copyToClipboard(getCurrentCode('server'), 'server')}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedCode === 'server' ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{getCurrentCode('server')}</code>
              </pre>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Client Code</h3>
                <button
                  onClick={() => copyToClipboard(getCurrentCode('client'), 'client')}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedCode === 'client' ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{getCurrentCode('client')}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
