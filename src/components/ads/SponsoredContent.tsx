"use client";

import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface SponsoredContentProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  sponsor: string;
  type: 'course' | 'book' | 'tool' | 'service';
}

const SponsoredContent: React.FC<SponsoredContentProps> = ({
  title,
  description,
  ctaText,
  ctaUrl,
  imageUrl,
  sponsor,
  type
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = () => {
    switch (type) {
      case 'course': return 'from-blue-500 to-purple-500';
      case 'book': return 'from-green-500 to-teal-500';
      case 'tool': return 'from-orange-500 to-red-500';
      case 'service': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'course': return '📚';
      case 'book': return '📖';
      case 'tool': return '🛠️';
      case 'service': return '⚡';
      default: return '💡';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`relative bg-gradient-to-r ${getTypeColor()} rounded-2xl p-6 text-white transition-all duration-300 ${
        isHovered ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sponsored Label */}
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <Info className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">Sponsored</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="bg-white/20 backdrop-blur-sm rounded-full p-1 hover:bg-white/30 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-start space-x-4">
        {/* Content Section */}
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">{getTypeIcon()}</span>
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-white/80 text-sm">by {sponsor}</p>
            </div>
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed mb-4">
            {description}
          </p>
          
          <div className="flex items-center space-x-3">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {ctaText}
            </a>
            <div className="text-white/60 text-xs">
              Sponsored Content
            </div>
          </div>
        </div>

        {/* Image Section */}
        {imageUrl && (
          <div className="hidden md:block">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-24 h-24 object-cover rounded-lg border-2 border-white/20"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Pre-configured sponsored content for different topics
export const SPONSORED_CONTENT = {
  algorithms: {
    title: "Master Coding Interviews",
    description: "Learn the exact algorithms that Google, Amazon, and Microsoft ask in interviews. 1000+ practice problems with detailed solutions.",
    ctaText: "Start Learning →",
    ctaUrl: "https://leetcode.com/premium/",
    sponsor: "LeetCode",
    type: "course" as const
  },
  
  networking: {
    title: "Network Security Fundamentals",
    description: "Complete guide to cybersecurity and network protection. Perfect for CS students and professionals.",
    ctaText: "Get Course →",
    ctaUrl: "https://www.udemy.com/course/network-security/",
    sponsor: "Udemy",
    type: "course" as const
  },
  
  dataStructures: {
    title: "Cracking the Coding Interview",
    description: "The #1 bestselling programming interview book. 189 programming questions with solutions.",
    ctaText: "Buy Now →",
    ctaUrl: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
    sponsor: "Amazon",
    type: "book" as const
  },
  
  operatingSystems: {
    title: "System Design Interview Prep",
    description: "Master system design concepts for senior engineer interviews. Scale from 1 to 1 million users.",
    ctaText: "Learn More →",
    ctaUrl: "https://www.educative.io/courses/system-design-interview",
    sponsor: "Educative",
    type: "course" as const
  }
};

export default SponsoredContent;
