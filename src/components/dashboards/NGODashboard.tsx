import React from 'react';
import { Building, Users, Heart, TrendingUp, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Crisis, ResourceNeed, VolunteerOpportunity, User } from '../../types';

interface NGODashboardProps {
  user: User;
  crises: Crisis[];
  resources: ResourceNeed[];
  volunteers: VolunteerOpportunity[];
}

export default function NGODashboard({ user, crises, resources, volunteers }: NGODashboardProps) {
  const activeCrises = crises.filter(c => c.status === 'active');
  const urgentResources = resources.filter(r => r.priority === 'urgent' && r.status === 'needed');
  const totalVolunteers = volunteers.reduce((sum, v) => sum + v.volunteersRegistered, 0);
  const totalFunding = crises.reduce((sum, c) => sum + c.totalFunding, 0);

  const stats = [
    {
      title: 'Active Crises',
      value: activeCrises.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '+2 this week'
    },
    {
      title: 'Urgent Resources',
      value: urgentResources.length,
      icon: Heart,
      color: 'bg-orange-500',
      change: '-5 resolved'
    },
    {
      title: 'Active Volunteers',
      value: totalVolunteers,
      icon: Users,
      color: 'bg-green-500',
      change: '+12 this month'
    },
    {
      title: 'Total Funding',
      value: `$${(totalFunding / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+15% this quarter'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NGO Operations Center</h2>
        <p className="text-gray-600">Coordinate relief efforts and manage resources effectively</p>
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
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Crises */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Active Crisis Situations
          </h3>
          <div className="space-y-4">
            {activeCrises.slice(0, 4).map((crisis) => (
              <div key={crisis.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{crisis.title}</h4>
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(crisis.severity)}`} />
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
                    <span className="text-gray-600">Funding: </span>
                    <span className="font-medium">${(crisis.totalFunding / 1000).toFixed(0)}K / ${(crisis.fundingGoal / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((crisis.totalFunding / crisis.fundingGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Resource Needs */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Urgent Resource Needs
          </h3>
          <div className="space-y-4">
            {urgentResources.slice(0, 5).map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{resource.item}</h4>
                  <p className="text-sm text-gray-600">
                    {resource.quantity - resource.fulfilled} {resource.unit} needed
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(resource.priority)}`}>
                    {resource.priority}
                  </span>
                  {resource.deadline && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(resource.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteer Activities */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-500" />
          Volunteer Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.slice(0, 6).map((opportunity) => (
            <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{opportunity.description.substring(0, 100)}...</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {opportunity.location}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">
                    {opportunity.volunteersRegistered}/{opportunity.volunteersNeeded}
                  </span>
                  <Users className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(opportunity.volunteersRegistered / opportunity.volunteersNeeded) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <AlertTriangle className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Report Crisis</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <Heart className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Request Resources</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Post Opportunity</span>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all">
            <CheckCircle className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Update Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}