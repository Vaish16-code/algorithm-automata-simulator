"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Code, User, Shield, Layers, Activity } from "lucide-react";

export default function SystemCallsPage() {
  const [selectedCategory, setSelectedCategory] = useState("file");
  const [systemCallTrace, setSystemCallTrace] = useState<string[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  const systemCallCategories = [
    {
      id: "file",
      name: "File Operations",
      icon: "📁",
      description: "File and directory management system calls",
      calls: [
        { name: "open()", description: "Open a file or device", parameters: "pathname, flags, mode", returns: "file descriptor" },
        { name: "read()", description: "Read data from file descriptor", parameters: "fd, buffer, count", returns: "bytes read" },
        { name: "write()", description: "Write data to file descriptor", parameters: "fd, buffer, count", returns: "bytes written" },
        { name: "close()", description: "Close file descriptor", parameters: "fd", returns: "0 on success" },
        { name: "lseek()", description: "Change file position", parameters: "fd, offset, whence", returns: "new position" },
        { name: "stat()", description: "Get file information", parameters: "pathname, statbuf", returns: "0 on success" }
      ]
    },
    {
      id: "process",
      name: "Process Control",
      icon: "⚙️",
      description: "Process creation and management system calls",
      calls: [
        { name: "fork()", description: "Create child process", parameters: "void", returns: "child PID or 0" },
        { name: "exec()", description: "Execute new program", parameters: "pathname, argv, envp", returns: "doesn't return on success" },
        { name: "wait()", description: "Wait for child process", parameters: "status", returns: "child PID" },
        { name: "exit()", description: "Terminate process", parameters: "status", returns: "doesn't return" },
        { name: "getpid()", description: "Get process ID", parameters: "void", returns: "process ID" },
        { name: "kill()", description: "Send signal to process", parameters: "pid, signal", returns: "0 on success" }
      ]
    },
    {
      id: "memory",
      name: "Memory Management",
      icon: "🧠",
      description: "Memory allocation and management system calls",
      calls: [
        { name: "malloc()", description: "Allocate memory", parameters: "size", returns: "pointer to memory" },
        { name: "free()", description: "Free allocated memory", parameters: "ptr", returns: "void" },
        { name: "mmap()", description: "Memory map file or device", parameters: "addr, length, prot, flags, fd, offset", returns: "mapped address" },
        { name: "munmap()", description: "Unmap memory", parameters: "addr, length", returns: "0 on success" },
        { name: "brk()", description: "Change data segment size", parameters: "addr", returns: "0 on success" },
        { name: "sbrk()", description: "Increment data segment", parameters: "increment", returns: "previous break" }
      ]
    },
    {
      id: "communication",
      name: "Communication",
      icon: "💬",
      description: "Inter-process communication system calls",
      calls: [
        { name: "pipe()", description: "Create pipe", parameters: "pipefd[2]", returns: "0 on success" },
        { name: "msgget()", description: "Get message queue", parameters: "key, msgflg", returns: "queue ID" },
        { name: "msgsnd()", description: "Send message", parameters: "msqid, msgp, msgsz, msgflg", returns: "0 on success" },
        { name: "msgrcv()", description: "Receive message", parameters: "msqid, msgp, msgsz, msgtyp, msgflg", returns: "bytes received" },
        { name: "shmget()", description: "Get shared memory", parameters: "key, size, shmflg", returns: "segment ID" },
        { name: "shmat()", description: "Attach shared memory", parameters: "shmid, shmaddr, shmflg", returns: "attached address" }
      ]
    }
  ];

  const systemCallMechanism = [
    {
      step: 1,
      title: "User Mode Call",
      description: "Application calls system call wrapper function",
      detail: "Library function prepares arguments and issues software interrupt"
    },
    {
      step: 2,
      title: "Mode Switch",
      description: "CPU switches from user mode to kernel mode",
      detail: "Hardware saves user context and jumps to kernel handler"
    },
    {
      step: 3,
      title: "Kernel Handler",
      description: "Kernel identifies and executes system call",
      detail: "System call number used to index into dispatch table"
    },
    {
      step: 4,
      title: "Return to User",
      description: "Kernel completes operation and returns to user mode",
      detail: "Result returned to application, user context restored"
    }
  ];

  const traceSystemCall = (callName: string) => {
    setIsTracing(true);
    const trace = [
      `[${Date.now()}] User process calls ${callName}()`,
      `[${Date.now() + 1}] CPU switches to kernel mode`,
      `[${Date.now() + 2}] Kernel validates parameters`,
      `[${Date.now() + 3}] Kernel executes ${callName} operation`,
      `[${Date.now() + 4}] Operation completed successfully`,
      `[${Date.now() + 5}] CPU returns to user mode`
    ];
    
    // Simulate real-time tracing
    trace.forEach((entry, index) => {
      setTimeout(() => {
        setSystemCallTrace(prev => [...prev, entry]);
        if (index === trace.length - 1) {
          setIsTracing(false);
        }
      }, index * 500);
    });
  };

  const clearTrace = () => {
    setSystemCallTrace([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/os" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Operating Systems
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Terminal className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">System Calls & API</h1>
              <p className="text-blue-100 text-lg">Interface between user programs and operating system kernel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-blue-100">System call interface, kernel mode, user mode transitions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-blue-100">Operating system design, system programming, application development</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-blue-100">System call types, execution mechanism, parameter passing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* System Call Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Call Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {systemCallCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === category.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Category Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            {(() => {
              const category = systemCallCategories.find(c => c.id === selectedCategory);
              if (!category) return null;
              
              return (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {category.name} System Calls
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {category.calls.map((call, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-700">{call.name}</h4>
                          <button
                            onClick={() => traceSystemCall(call.name)}
                            disabled={isTracing}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Trace
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{call.description}</p>
                        <div className="text-xs space-y-1">
                          <div><span className="font-medium">Parameters:</span> {call.parameters}</div>
                          <div><span className="font-medium">Returns:</span> {call.returns}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* System Call Mechanism */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Call Execution Mechanism</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Execution Steps</h3>
              <div className="space-y-4">
                {systemCallMechanism.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <p className="text-xs text-indigo-600 mt-1">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* System Call Trace */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">System Call Trace</h3>
                <button
                  onClick={clearTrace}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {systemCallTrace.length === 0 ? (
                  <div className="text-gray-500">Click "Trace" on any system call to see execution trace...</div>
                ) : (
                  systemCallTrace.map((entry, index) => (
                    <div key={index} className="mb-1">
                      {entry}
                    </div>
                  ))
                )}
                {isTracing && (
                  <div className="text-yellow-400 animate-pulse">
                    Tracing system call execution...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Parameter Passing Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Parameter Passing Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Registers</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• <span className="font-medium">Method:</span> Pass parameters in CPU registers</li>
                <li>• <span className="font-medium">Advantage:</span> Fast access</li>
                <li>• <span className="font-medium">Limitation:</span> Limited number of registers</li>
                <li>• <span className="font-medium">Best for:</span> Few parameters</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Stack</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• <span className="font-medium">Method:</span> Push parameters onto stack</li>
                <li>• <span className="font-medium">Advantage:</span> Unlimited parameters</li>
                <li>• <span className="font-medium">Limitation:</span> Stack management overhead</li>
                <li>• <span className="font-medium">Best for:</span> Many parameters</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-3">Memory Block</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• <span className="font-medium">Method:</span> Store parameters in memory block</li>
                <li>• <span className="font-medium">Advantage:</span> Large data structures</li>
                <li>• <span className="font-medium">Limitation:</span> Memory management complexity</li>
                <li>• <span className="font-medium">Best for:</span> Complex data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Call vs Function Call */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Call vs Function Call</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Function Call</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">System Call</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Execution Mode</td>
                  <td className="border border-gray-300 px-4 py-2">User mode</td>
                  <td className="border border-gray-300 px-4 py-2">Kernel mode</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Context Switch</td>
                  <td className="border border-gray-300 px-4 py-2">No</td>
                  <td className="border border-gray-300 px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Overhead</td>
                  <td className="border border-gray-300 px-4 py-2">Low</td>
                  <td className="border border-gray-300 px-4 py-2">High</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Access to Resources</td>
                  <td className="border border-gray-300 px-4 py-2">Limited</td>
                  <td className="border border-gray-300 px-4 py-2">Full system access</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Error Handling</td>
                  <td className="border border-gray-300 px-4 py-2">Application-level</td>
                  <td className="border border-gray-300 px-4 py-2">Kernel-level validation</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Exam Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Understand the difference between user mode and kernel mode</li>
              <li>• Know the system call execution mechanism steps</li>
              <li>• Be familiar with different parameter passing methods</li>
              <li>• Practice identifying appropriate system calls for different operations</li>
              <li>• Understand the overhead and security implications of system calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
