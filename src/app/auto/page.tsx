"use client";

import Link from "next/link";
import { Cpu, BookOpen, Play, Users, Clock, Star, CheckCircle2, Globe, Award } from "lucide-react";

export default function AutomataTheoryPage() {
  const topics = [
    {
      title: "Finite Automata",
      description: "Master DFA and NFA concepts with step-by-step simulations",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500",
      difficulty: "Beginner",
      examWeight: "High",
      categories: [
        {
          name: "DFA Simulator",
          href: "/auto/finite-automata/dfa",
          description: "Deterministic Finite Automaton with transition tables",
          examTips: "Focus on state transitions and acceptance conditions"
        },
        {
          name: "NFA Simulator", 
          href: "/auto/finite-automata/nfa",
          description: "Non-deterministic Finite Automaton simulation",
          examTips: "Understand ε-transitions and multiple paths"
        },
        {
          name: "Pumping Lemma",
          href: "/auto/regular-languages/pumping-lemma",
          description: "Prove a language is not regular",
          examTips: "Practice identifying non-regular languages"
        }
      ],
      applications: [
        "Lexical Analysis in Compilers",
        "Text Pattern Matching",
        "Network Protocol Design"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["State Diagrams", "Transition Tables", "Language Recognition"],
        questions: "Design DFA/NFA for given languages, Convert NFA to DFA"
      }
    },
    {
      title: "Regular Expressions",
      description: "Pattern matching and language generation using regex",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "Regex Matcher",
          href: "/auto/regular-expressions/matcher",
          description: "Test strings against regular expressions",
          examTips: "Practice converting between regex and FA"
        }
      ],
      applications: [
        "String Validation",
        "Search Algorithms",
        "Data Parsing"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["Regex Operations", "FA to Regex Conversion", "Pumping Lemma"],
        questions: "Write regex for languages, Convert FA to regex"
      }
    },
    {
      title: "Context-Free Grammars",
      description: "Parse languages beyond regular expressions",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      difficulty: "Advanced",
      examWeight: "High",
      categories: [
        {
          name: "CFG Parser",
          href: "/auto/context-free-grammar/parser",
          description: "Parse strings using context-free grammars",
          examTips: "Master derivation steps and parse trees"
        },
        {
          name: "Chomsky Hierarchy",
          href: "/auto/language-theory/chomsky-hierarchy",
          description: "The 4 types of grammars and languages",
          examTips: "Know the relationships between grammar types"
        },
        {
          name: "CFL Properties",
          href: "/auto/context-free-languages/properties",
          description: "Pumping lemma and closure properties of CFLs",
          examTips: "Practice applying the pumping lemma to CFLs"
        }
      ],
      applications: [
        "Programming Language Syntax",
        "Compiler Parser Design",
        "XML/JSON Processing"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Derivations", "Parse Trees", "Ambiguity"],
        questions: "Design CFG, Show derivations, Remove ambiguity"
      }
    },
    {
      title: "Turing Machines",
      description: "Universal computation model and decidability",
      icon: Award,
      color: "from-orange-500 to-red-500",
      difficulty: "Expert",
      examWeight: "Medium",
      categories: [
        {
          name: "TM Simulator",
          href: "/auto/turing-machines/simulator",
          description: "Simulate Turing machine execution",
          examTips: "Focus on tape movements and halting conditions"
        },
        {
          name: "Undecidability",
          href: "/auto/computability/undecidability",
          description: "Undecidable problems and reduction techniques",
          examTips: "Understand the halting problem proof"
        },
        {
          name: "Post Correspondence",
          href: "/auto/computability/post-correspondence",
          description: "Post Correspondence Problem (PCP)",
          examTips: "Practice solving PCP instances"
        }
      ],
      applications: [
        "Theoretical Computation Models",
        "Algorithm Complexity Analysis",
        "Undecidability Proofs"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["TM Design", "Decidability", "Halting Problem"],
        questions: "Design TM for operations, Prove decidability"
      }
    },
    {
      title: "Pushdown Automata",
      description: "Computational model for context-free languages",
      icon: Globe,
      color: "from-indigo-500 to-blue-500",
      difficulty: "Advanced",
      examWeight: "High",
      categories: [
        {
          name: "PDA Simulator",
          href: "/auto/pushdown-automata/simulator",
          description: "Simulate pushdown automaton execution",
          examTips: "Understand stack operations and acceptance conditions"
        },
        {
          name: "PDA to CFG",
          href: "/auto/pushdown-automata/pda-to-cfg",
          description: "Convert PDA to context-free grammar",
          examTips: "Focus on the systematic conversion steps"
        }
      ],
      applications: [
        "Parsing Context-Free Languages",
        "Expression Evaluation",
        "Nested Structure Validation"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["PDA Design", "Stack Operations", "Acceptance Criteria"],
        questions: "Design PDA for CFLs, Convert CFG to PDA"
      }
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getExamWeightColor = (weight: string) => {
    switch(weight) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300 text-sm font-medium mb-6">
              <Cpu className="h-4 w-4 mr-2" />
              Theory of Computation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Automata Theory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Simulator
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master finite automata, regular expressions, context-free grammars, and Turing machines 
              with interactive simulations designed for Mumbai University examinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm">Exam-Focused Content</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Mumbai University Syllabus</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Step-by-Step Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${topic.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <topic.icon className="h-8 w-8" />
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamWeightColor(topic.examWeight)}`}>
                      {topic.examWeight} Weight
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{topic.title}</h2>
                <p className="text-white/90">{topic.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Categories */}
                <div className="space-y-3 mb-6">
                  {topic.categories.map((category, catIndex) => (
                    <Link
                      key={catIndex}
                      href={category.href}
                      className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group/item"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 group-hover/item:text-blue-700">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            💡 {category.examTips}
                          </p>
                        </div>
                        <Play className="h-5 w-5 text-blue-400 group-hover/item:text-blue-600 ml-4" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Exam Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-purple-600" />
                    Mumbai University Exam Info
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Expected Marks:</span>
                      <span className="text-purple-700 ml-1">{topic.examInfo.marks}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Key Topics:</span>
                      <div className="text-gray-600 text-xs mt-1">
                        {topic.examInfo.topics.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-gray-700 text-sm">Common Questions:</span>
                    <p className="text-gray-600 text-xs mt-1">{topic.examInfo.questions}</p>
                  </div>
                </div>

                {/* Applications */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Real-World Applications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {topic.applications.map((app, appIndex) => (
                      <span key={appIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore Button */}
                <Link
                  href={topic.categories[0].href}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${topic.color} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-200 group`}
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mumbai University Focus Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Mumbai University Focused</h2>
            <p className="text-purple-100 mb-6 max-w-3xl mx-auto">
              All simulations include detailed step-by-step solutions formatted for Mumbai University 
              examination answers, with proper mathematical notation and required explanations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Exam Format</h3>
                <p className="text-sm text-purple-100">Solutions formatted for university answer sheets</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Time Efficient</h3>
                <p className="text-sm text-purple-100">Quick understanding for exam preparation</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Syllabus Aligned</h3>
                <p className="text-sm text-purple-100">Covers complete MU curriculum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Automata Theory Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-blue-800">Regular Languages</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Finite Automata</li>
                <li>• Regular Expressions</li>
                <li>• Regular Grammars</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-purple-800">Context-Free</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pushdown Automata</li>
                <li>• Context-Free Grammars</li>
                <li>• Parse Trees</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-green-800">Recursive</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Turing Machines</li>
                <li>• Decidable Problems</li>
                <li>• Church-Turing Thesis</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-orange-800">Applications</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Compiler Design</li>
                <li>• Text Processing</li>
                <li>• Protocol Verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
