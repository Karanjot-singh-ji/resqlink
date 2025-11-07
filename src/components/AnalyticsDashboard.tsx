import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Users, DollarSign, Target, Calendar } from 'lucide-react';
import { Crisis, Donation, VolunteerOpportunity, User } from '../types';

interface AnalyticsDashboardProps {
  user: User;
  crises: Crisis[];
  donations: Donation[];
  volunteers: VolunteerOpportunity[];
}

export default function AnalyticsDashboard({ user, crises, donations, volunteers }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeChart, setActiveChart] = useState<'funding' | 'volunteers' | 'impact'>('funding');

  // Calculate analytics data
  const totalFunding = crises.reduce((sum, c) => sum + c.totalFunding, 0);
  const totalGoal = crises.reduce((sum, c) => sum + c.fundingGoal, 0);
  const totalVolunteers = volunteers.reduce((sum, v) => sum + v.volunteersRegistered, 0);
  const totalAffected = crises.reduce((sum, c) => sum + c.affectedPopulation, 0);

  const fundingByType = crises.reduce((acc, crisis) => {
    acc[crisis.type] = (acc[crisis.type] || 0) + crisis.totalFunding;
    return acc;
  }, {} as Record<string, number>);

  const crisesBySeverity = crises.reduce((acc, crisis) => {
    acc[crisis.severity] = (acc[crisis.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      funding: Math.floor(Math.random() * 500000) + 100000,
      volunteers: Math.floor(Math.random() * 200) + 50,
      crises: Math.floor(Math.random() * 10) + 2
    };
  }).reverse();

  const kpiCards = [
    {
      title: 'Total Funding Raised',
      value: `$${(totalFunding / 1000000).toFixed(1)}M`,
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Volunteers',
      value: totalVolunteers.toLocaleString(),
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'People Helped',
      value: `${(totalAffected / 1000).toFixed(0)}K`,
      change: '+8.7%',
      trend: 'up',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Response Time',
      value: '2.4h',
      change: '-15.2%',
      trend: 'down',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'funding':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Monthly Funding Trends</h4>
            <div className="h-64 flex items-end space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(data.funding / 600000) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'volunteers':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Volunteer Engagement</h4>
            <div className="h-64 flex items-end space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                    style={{ height: `${(data.volunteers / 250) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'impact':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Crisis Response Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Funding by Crisis Type</h5>
                {Object.entries(fundingByType).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(amount / totalFunding) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">${(amount / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Crises by Severity</h5>
                {Object.entries(crisesBySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{severity}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            severity === 'critical' ? 'bg-red-500' :
                            severity === 'high' ? 'bg-orange-500' :
                            severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(count / crises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into relief operations</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span className="font-medium">{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm">{kpi.title}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
          <div className="flex space-x-2">
            {(['funding', 'volunteers', 'impact'] as const).map((chart) => (
              <button
                key={chart}
                onClick={() => setActiveChart(chart)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  activeChart === chart
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {chart}
              </button>
            ))}
          </div>
        </div>
        {renderChart()}
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-500" />
            Real-time Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'New donation received', amount: '$2,500', time: '2 min ago', type: 'donation' },
              { action: 'Volunteer registered', amount: 'Medical Team', time: '5 min ago', type: 'volunteer' },
              { action: 'Crisis status updated', amount: 'Turkey Earthquake', time: '8 min ago', type: 'crisis' },
              { action: 'Resource fulfilled', amount: 'Medical Supplies', time: '12 min ago', type: 'resource' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.amount}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-500" />
            Goal Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Funding Goal</span>
                <span className="font-medium">{((totalFunding / totalGoal) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalFunding / totalGoal) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${(totalFunding / 1000000).toFixed(1)}M of ${(totalGoal / 1000000).toFixed(1)}M raised
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Volunteer Recruitment</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full w-3/4 transition-all duration-500" />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {totalVolunteers} volunteers recruited
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}