"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, Eye, Users, TrendingUp, Calendar, Target } from 'lucide-react';

interface MonetizationStats {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalPageViews: number;
  activeUsers: number;
  ctr: number; // Click-through rate
  rpm: number; // Revenue per mille (1000 impressions)
}

const MonetizationDashboard: React.FC = () => {
  const [stats, setStats] = useState<MonetizationStats>({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    totalPageViews: 0,
    activeUsers: 0,
    ctr: 0,
    rpm: 0
  });

  // Simulated data - replace with real analytics integration
  useEffect(() => {
    // This would integrate with Google AdSense API and Google Analytics
    const mockStats: MonetizationStats = {
      dailyRevenue: 12.50,
      monthlyRevenue: 375.00,
      totalPageViews: 15000,
      activeUsers: 1250,
      ctr: 2.3,
      rpm: 1.85
    };
    setStats(mockStats);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any;
    title: string;
    value: string;
    change: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-3">
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Dashboard</h1>
          <p className="text-gray-600">Track your algorithm simulator monetization performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Daily Revenue"
            value={`₹${stats.dailyRevenue.toFixed(2)}`}
            change="+12.5%"
            color="#10B981"
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toFixed(2)}`}
            change="+23.1%"
            color="#3B82F6"
          />
          <StatCard
            icon={Eye}
            title="Page Views"
            value={stats.totalPageViews.toLocaleString()}
            change="+8.2%"
            color="#8B5CF6"
          />
          <StatCard
            icon={Users}
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            change="+15.3%"
            color="#F59E0B"
          />
          <StatCard
            icon={Target}
            title="Click Rate"
            value={`${stats.ctr}%`}
            change="+0.5%"
            color="#EF4444"
          />
          <StatCard
            icon={Calendar}
            title="RPM"
            value={`₹${stats.rpm.toFixed(2)}`}
            change="+4.2%"
            color="#06B6D4"
          />
        </div>

        {/* Revenue Optimization Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ad Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Ad Positions</h2>
            <div className="space-y-4">
              {[
                { position: 'Top Banner', revenue: '₹150.25', ctr: '3.2%' },
                { position: 'Sidebar', revenue: '₹89.50', ctr: '2.1%' },
                { position: 'In-content', revenue: '₹76.30', ctr: '2.8%' },
                { position: 'Bottom Banner', revenue: '₹58.95', ctr: '1.5%' }
              ].map((ad, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{ad.position}</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{ad.revenue}</div>
                    <div className="text-sm text-gray-600">CTR: {ad.ctr}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Optimization Tips</h2>
            <div className="space-y-3">
              {[
                { tip: "Add more ads to high-traffic algorithm pages", impact: "High" },
                { tip: "Implement lazy loading for better user experience", impact: "Medium" },
                { tip: "Test different ad sizes and positions", impact: "High" },
                { tip: "Create premium ad-free subscription tier", impact: "Very High" },
                { tip: "Partner with coding bootcamps for sponsored content", impact: "High" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm">{item.tip}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                    item.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AdSense Application Status */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">🎯 Google AdSense Application Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">📝 Application Steps</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Website Ready ✅</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span>Add Privacy Policy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span>Submit Application</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span>Wait for Approval</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">💰 Revenue Potential</h3>
              <div className="space-y-2 text-sm">
                <div>1K pageviews: <span className="font-bold">₹500-1,500/month</span></div>
                <div>5K pageviews: <span className="font-bold">₹2,500-7,500/month</span></div>
                <div>10K pageviews: <span className="font-bold">₹5,000-15,000/month</span></div>
                <div>50K pageviews: <span className="font-bold">₹25,000-75,000/month</span></div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">⏰ Timeline</h3>
              <div className="space-y-2 text-sm">
                <div>Application: <span className="font-bold">15 minutes</span></div>
                <div>Review: <span className="font-bold">1-2 days</span></div>
                <div>Approval: <span className="font-bold">3-7 days</span></div>
                <div>First Revenue: <span className="font-bold">Same day</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <a 
              href="https://www.google.com/adsense/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Apply for AdSense →
            </a>
            <a 
              href="/privacy" 
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Create Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Create Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationDashboard;
