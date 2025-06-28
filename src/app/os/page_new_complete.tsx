"use client";

import Link from "next/link";

export default function OperatingSystemsPage() {
  const topics = [
    {
      title: "Process Management",
      description: "CPU Scheduling algorithms and process synchronization",
      categories: [
        {
          name: "CPU Scheduling",
          href: "/os/cpu-scheduling",
          description: "FCFS, SJF, SRTF, Priority, Round Robin scheduling"
        },
        {
          name: "Process Synchronization", 
          href: "/os/synchronization",
          description: "Producer-Consumer, Readers-Writers, Dining Philosophers"
        },
        {
          name: "Deadlock Handling",
          href: "/os/deadlock",
          description: "Deadlock detection, prevention, and recovery algorithms"
        }
      ]
    },
    {
      title: "Memory Management",
      description: "Virtual memory and page replacement strategies",
      categories: [
        {
          name: "Page Replacement",
          href: "/os/page-replacement",
          description: "FIFO, LRU, LFU, Optimal page replacement algorithms"
        },
        {
          name: "Memory Allocation",
          href: "/os/memory-allocation",
          description: "First Fit, Best Fit, Worst Fit allocation strategies"
        },
        {
          name: "Virtual Memory",
          href: "/os/virtual-memory",
          description: "Paging, segmentation, and address translation"
        }
      ]
    },
    {
      title: "Storage Management",
      description: "Disk scheduling and file system algorithms",
      categories: [
        {
          name: "Disk Scheduling",
          href: "/os/disk-scheduling",
          description: "FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK algorithms"
        },
        {
          name: "File Allocation",
          href: "/os/file-allocation",
          description: "Contiguous, linked, and indexed allocation methods"
        },
        {
          name: "Directory Management",
          href: "/os/directory",
          description: "Single-level, two-level, tree-structured directories"
        }
      ]
    },
    {
      title: "I/O Management",
      description: "Input/Output scheduling and device management",
      categories: [
        {
          name: "I/O Scheduling",
          href: "/os/io-scheduling",
          description: "FCFS, SSTF, SCAN I/O request scheduling"
        },
        {
          name: "Buffer Management",
          href: "/os/buffer-management",
          description: "Single, double, and circular buffering strategies"
        }
      ]
    },
    {
      title: "Security & Protection",
      description: "Access control and security mechanisms",
      categories: [
        {
          name: "Access Control",
          href: "/os/access-control",
          description: "Access control matrix, capability lists, ACLs"
        },
        {
          name: "Authentication",
          href: "/os/authentication",
          description: "Password systems, biometric authentication"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Operating Systems Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive simulators for OS algorithms including process scheduling, memory management, 
            disk scheduling, and system synchronization. Learn through step-by-step execution and visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
                <p className="text-blue-100 text-sm mt-1">{topic.description}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {topic.categories.map((category, catIndex) => (
                    <Link
                      key={catIndex}
                      href={category.href}
                      className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                        <div className="text-blue-400 group-hover:text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Operating Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Core Components:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Process and Thread Management</li>
                <li>• Memory Management and Virtual Memory</li>
                <li>• File System and Storage Management</li>
                <li>• I/O and Device Management</li>
                <li>• Security and Protection Mechanisms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Applications:</h3>
              <ul className="space-y-1 text-sm">
                <li>• System Performance Optimization</li>
                <li>• Resource Allocation and Scheduling</li>
                <li>• Concurrent Programming</li>
                <li>• System Security and Access Control</li>
                <li>• Embedded Systems Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
