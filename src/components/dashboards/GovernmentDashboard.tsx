import React from 'react';
import { Shield, Users, Building, TrendingUp, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Crisis, ResourceNeed, NGO, User } from '../../types';

interface GovernmentDashboardProps {
  user: User;
  crises: Crisis[];
  resources: ResourceNeed[];
  ngos: NGO[];
}

export default function GovernmentDashboard({ user, crises, resources, ngos }: GovernmentDashboardProps) {
  const activeCrises = crises.filter(c => c.status === 'active');
  const criticalCrises = crises.filter(c => c.severity === 'critical');
  const totalAffected = crises.reduce((sum, c) => sum + c.affectedPopulation, 0);
  const totalFunding = crises.reduce((sum, c) => sum + c.totalFunding, 0);
  const activeNGOs = ngos.filter(n => n.activeCrises.length > 0);

  const stats = [
    {
      title: 'Active Crises',
      value: activeCrises.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: criticalCrises.length + ' critical'
    },
    {
      title: 'People Affected',
      value: (totalAffected / 1000).toFixed(1) + 'K',
      icon: Users,
      color: 'bg-orange-500',
      change: '+2.3K this week'
    },
    {
      title: 'Active NGOs',
      value: activeNGOs.length,
      icon: Building,
      color: 'bg-blue-500',
      change: '12 newly registered'
    },
    {
      title: 'Total Funding',
      value: `$${(totalFunding / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+15% this quarter'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const resourcesByType = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-blue-700 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Government Command Center</h2>
            <p className="text-red-100">Coordinating national disaster response and relief efforts</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{activeCrises.length}</div>
            <div className="text-sm text-red-100">Active Situations</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-blue-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Situations */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Critical Situations Requiring Attention
          </h3>
          <div className="space-y-4">
            {criticalCrises.slice(0, 4).map((crisis) => (
              <div key={crisis.id} className="border border-red-200 rounded-lg p-4 bg-red-50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{crisis.title}</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(crisis.severity)}`} />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(crisis.status)}`}>
                      {crisis.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {crisis.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {crisis.affectedPopulation.toLocaleString()} affected
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">NGOs Deployed: </span>
                    <span className="font-medium">{crisis.assignedNGOs.length}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                      Escalate
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                      Coordinate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation Overview */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Resource Allocation Overview
          </h3>
          <div className="space-y-4">
            {Object.entries(resourcesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">
                      {type === 'food' ? '🍞' :
                       type === 'water' ? '💧' :
                       type === 'shelter' ? '🏠' :
                       type === 'medical' ? '🏥' :
                       type === 'transport' ? '🚛' : '📦'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{type}</div>
                    <div className="text-sm text-gray-600">{count} active requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">requests</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NGO Performance and Coordination */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-500" />
          NGO Coordination & Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeNGOs.slice(0, 6).map((ngo) => (
            <div key={ngo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{ngo.name}</h4>
                <div className="flex items-center space-x-1">
                  {ngo.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className="text-sm text-gray-600">★ {ngo.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 capitalize">{ngo.type} • {ngo.location}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Active Crises: <span className="font-medium">{ngo.activeCrises.length}</span>
                </div>
                <div className="text-gray-600">
                  Projects: <span className="font-medium">{ngo.totalProjects}</span>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700 transition-colors">
                  Contact
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-xs hover:bg-gray-200 transition-colors">
                  Reports
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Command Center Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Command Center Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <AlertTriangle className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Declare Emergency</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Deploy Resources</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <Building className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Coordinate NGOs</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <TrendingUp className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}