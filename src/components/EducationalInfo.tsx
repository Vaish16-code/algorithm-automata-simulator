'use client';

import { BookOpen, Award, Clock, Users, Lightbulb, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EducationalInfoProps {
  topic: string;
  description: string;
  theory: {
    definition: string;
    keyPoints: string[];
    applications: string[];
  };
  mumbaiUniversity: {
    syllabus: string[];
    marks: string;
    commonQuestions: string[];
    examTips: string[];
  };
  algorithm: {
    steps: string[];
    complexity: {
      time: string;
      space: string;
    };
  };
}

export default function EducationalInfo({ topic, description, theory, mumbaiUniversity, algorithm }: EducationalInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">{topic}</h2>
        </div>
        <p className="text-blue-100">{description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Theory Section */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Theory & Concepts
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Definition:</h4>
            <p className="text-blue-800 text-sm leading-relaxed">{theory.definition}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Key Points:</h4>
              <ul className="space-y-1">
                {theory.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Applications:</h4>
              <ul className="space-y-1">
                {theory.applications.map((app, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mumbai University Section */}
        <div className="border-t pt-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
            <Award className="h-5 w-5 mr-2 text-purple-500" />
            Mumbai University Guidelines
          </h3>
          
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-semibold text-purple-900">Exam Weightage</span>
              </div>
              <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {mumbaiUniversity.marks} Marks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-500" />
                Syllabus Coverage:
              </h4>
              <ul className="space-y-1 mb-4">
                {mumbaiUniversity.syllabus.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                Common Questions:
              </h4>
              <ul className="space-y-1 mb-4">
                {mumbaiUniversity.commonQuestions.map((question, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded border-l-2 border-orange-300">
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1 text-green-500" />
              Exam Tips:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mumbaiUniversity.examTips.map((tip, index) => (
                <div key={index} className="flex items-start text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Section */}
        <div className="border-t pt-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
            <FileText className="h-5 w-5 mr-2 text-indigo-500" />
            Algorithm Details
          </h3>
          
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-800">{algorithm.complexity.time}</div>
                <div className="text-sm text-indigo-600">Time Complexity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-800">{algorithm.complexity.space}</div>
                <div className="text-sm text-indigo-600">Space Complexity</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Algorithm Steps:</h4>
            <ol className="space-y-2">
              {algorithm.steps.map((step, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
