import React from 'react';
import { Users, Heart, Clock, MapPin, Star, Award, Calendar, TrendingUp } from 'lucide-react';
import { VolunteerOpportunity, User } from '../../types';

interface VolunteerDashboardProps {
  user: User;
  opportunities: VolunteerOpportunity[];
  myActivities: any[];
}

export default function VolunteerDashboard({ user, opportunities, myActivities }: VolunteerDashboardProps) {
  const availableOpportunities = opportunities.filter(o => o.volunteersRegistered < o.volunteersNeeded);
  const myActiveActivities = myActivities.filter(a => a.status === 'active');
  const totalHours = myActivities.reduce((sum, a) => sum + (a.hoursContributed || 0), 0);
  const impactScore = Math.floor(totalHours * 2.5 + myActiveActivities.length * 10);

  const stats = [
    {
      title: 'Available Opportunities',
      value: availableOpportunities.length,
      icon: Heart,
      color: 'bg-red-500',
      change: '+5 new today'
    },
    {
      title: 'My Active Projects',
      value: myActiveActivities.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '2 ending soon'
    },
    {
      title: 'Hours Contributed',
      value: totalHours,
      icon: Clock,
      color: 'bg-green-500',
      change: '+8 this week'
    },
    {
      title: 'Impact Score',
      value: impactScore,
      icon: Star,
      color: 'bg-purple-500',
      change: '+25 this month'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'field-work': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      case 'logistics': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'administrative': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'field-work': return '🏗️';
      case 'medical': return '🏥';
      case 'logistics': return '📦';
      case 'technical': return '💻';
      case 'administrative': return '📋';
      default: return '🤝';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-green-100">Ready to make a difference today?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{impactScore}</div>
            <div className="text-sm text-green-100">Impact Score</div>
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
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Opportunities */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            New Opportunities
          </h3>
          <div className="space-y-4">
            {availableOpportunities.slice(0, 4).map((opportunity) => (
              <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(opportunity.type)}</span>
                    <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(opportunity.type)}`}>
                    {opportunity.type.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{opportunity.description.substring(0, 120)}...</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {opportunity.timeCommitment}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-medium">
                      {opportunity.volunteersNeeded - opportunity.volunteersRegistered} spots left
                    </span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Active Activities */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            My Active Projects
          </h3>
          <div className="space-y-4">
            {myActiveActivities.slice(0, 4).map((activity, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{activity.organization}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {activity.nextSession}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.hoursContributed}h contributed
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Log Hours
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            My Skills & Certifications
          </h3>
          <div className="space-y-3">
            {['First Aid Certified', 'Disaster Response', 'Community Outreach', 'Data Entry', 'Translation (Spanish)'].map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{skill}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
            Add New Skill
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Impact This Month
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Hours Volunteered</div>
                <div className="text-sm text-gray-600">32 hours this month</div>
              </div>
              <div className="text-2xl font-bold text-green-600">32</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">People Helped</div>
                <div className="text-sm text-gray-600">Estimated impact</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">156</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Projects Completed</div>
                <div className="text-sm text-gray-600">This quarter</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}