"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Folder, File, GitBranch, Users, Home, FolderPlus } from "lucide-react";

export default function DirectoryManagementPage() {
  const [directoryType, setDirectoryType] = useState("single");
  const [directoryStructure, setDirectoryStructure] = useState({
    single: {
      name: "root",
      files: ["file1.txt", "file2.txt", "file3.txt", "program.exe", "data.dat"]
    },
    twoLevel: {
      users: [
        { name: "user1", files: ["doc1.txt", "program1.exe"] },
        { name: "user2", files: ["doc2.txt", "program2.exe"] },
        { name: "user3", files: ["doc3.txt", "image.jpg"] }
      ]
    },
    tree: {
      name: "root",
      type: "directory",
      children: [
        {
          name: "home",
          type: "directory",
          children: [
            {
              name: "user1",
              type: "directory",
              children: [
                { name: "documents", type: "directory", children: [
                  { name: "file1.txt", type: "file" },
                  { name: "file2.txt", type: "file" }
                ]},
                { name: "downloads", type: "directory", children: [
                  { name: "image.jpg", type: "file" }
                ]}
              ]
            }
          ]
        },
        {
          name: "usr",
          type: "directory",
          children: [
            { name: "bin", type: "directory", children: [
              { name: "ls", type: "file" },
              { name: "cat", type: "file" }
            ]},
            { name: "lib", type: "directory", children: [
              { name: "libc.so", type: "file" }
            ]}
          ]
        },
        { name: "boot.img", type: "file" },
        { name: "config.sys", type: "file" }
      ]
    }
  });

  const renderTreeStructure = (node: any, level = 0) => {
    const indent = "  ".repeat(level);
    if (node.type === "file") {
      return (
        <div key={node.name} className="flex items-center space-x-2 py-1">
          <span className="text-gray-400">{indent}</span>
          <File className="h-4 w-4 text-blue-500" />
          <span className="text-gray-700">{node.name}</span>
        </div>
      );
    }
    
    return (
      <div key={node.name} className="py-1">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">{indent}</span>
          <Folder className="h-4 w-4 text-yellow-500" />
          <span className="font-medium text-gray-800">{node.name}/</span>
        </div>
        {node.children && node.children.map((child: any) => renderTreeStructure(child, level + 1))}
      </div>
    );
  };

  const directoryTypes = [
    {
      id: "single",
      name: "Single-Level Directory",
      description: "All files are in one directory",
      advantages: ["Simple to implement", "Easy to understand"],
      disadvantages: ["Name conflicts", "No organization", "Not scalable"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "twoLevel",
      name: "Two-Level Directory",
      description: "Separate directory for each user",
      advantages: ["Eliminates name conflicts", "Better organization", "User isolation"],
      disadvantages: ["Limited structure", "No subdirectories", "No file sharing"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "tree",
      name: "Tree-Structured Directory",
      description: "Hierarchical directory structure",
      advantages: ["Flexible organization", "Efficient searching", "Supports subdirectories"],
      disadvantages: ["More complex", "Path name overhead", "Potential cycles"],
      color: "from-green-500 to-emerald-500"
    }
  ];

  const pathOperations = [
    {
      operation: "Absolute Path",
      example: "/home/user1/documents/file1.txt",
      description: "Full path from root directory"
    },
    {
      operation: "Relative Path",
      example: "../documents/file1.txt",
      description: "Path relative to current directory"
    },
    {
      operation: "Path Resolution",
      example: "cd /home/user1 && ls documents/",
      description: "Navigate and list directory contents"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/os" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Operating Systems
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Folder className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Directory Management</h1>
              <p className="text-green-100 text-lg">Directory structures and file organization systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-green-100">Directory types, path resolution, file organization</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-green-100">File systems, operating systems, database indexing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-green-100">Directory design, path operations, file organization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Directory Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Directory Structure Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {directoryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setDirectoryType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  directoryType === type.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Directory Visualization */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {directoryTypes.find(t => t.id === directoryType)?.name} Structure
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visualization */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium text-gray-700 mb-3">Directory Structure</h4>
                <div className="font-mono text-sm bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
                  {directoryType === "single" && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Folder className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">root/</span>
                      </div>
                      {directoryStructure.single.files.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 ml-6">
                          <File className="h-4 w-4 text-blue-500" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {directoryType === "twoLevel" && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Folder className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">root/</span>
                      </div>
                      {directoryStructure.twoLevel.users.map((user, index) => (
                        <div key={index} className="ml-4 mb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{user.name}/</span>
                          </div>
                          {user.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center space-x-2 ml-8">
                              <File className="h-4 w-4 text-blue-500" />
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {directoryType === "tree" && renderTreeStructure(directoryStructure.tree)}
                </div>
              </div>

              {/* Analysis */}
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Advantages</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {directoryTypes.find(t => t.id === directoryType)?.advantages.map((advantage, index) => (
                      <li key={index}>• {advantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Disadvantages</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {directoryTypes.find(t => t.id === directoryType)?.disadvantages.map((disadvantage, index) => (
                      <li key={index}>• {disadvantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Path Operations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Path Operations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathOperations.map((op, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{op.operation}</h3>
                <div className="bg-blue-100 rounded p-2 mb-2">
                  <code className="text-sm text-blue-900">{op.example}</code>
                </div>
                <p className="text-sm text-blue-700">{op.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Directory Implementation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Directory Implementation Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-3">Linear List</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Simple implementation using linked list</li>
                <li>• Sequential search for files</li>
                <li>• O(n) time complexity for operations</li>
                <li>• Easy to implement but slow for large directories</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-3">Hash Table</h3>
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• Uses hash function for file names</li>
                <li>• Fast access with O(1) average case</li>
                <li>• Handles collisions with chaining</li>
                <li>• Better performance for large directories</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Exam Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Understand the trade-offs between different directory structures</li>
              <li>• Practice drawing directory trees and path resolution</li>
              <li>• Compare implementation methods and their complexities</li>
              <li>• Know how to design directory structures for specific requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
