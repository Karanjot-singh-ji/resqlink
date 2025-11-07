import React from 'react';
import { DollarSign, Heart, TrendingUp, Users, Target, Award, PieChart, BarChart3 } from 'lucide-react';
import { Crisis, Donation, User } from '../../types';

interface DonorDashboardProps {
  user: User;
  crises: Crisis[];
  donations: Donation[];
}

export default function DonorDashboard({ user, crises, donations }: DonorDashboardProps) {
  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeDonations = donations.filter(d => d.status === 'confirmed');
  const impactfulCrises = crises.filter(c => donations.some(d => d.crisisId === c.id));
  const peopleHelped = impactfulCrises.reduce((sum, c) => sum + c.affectedPopulation, 0);

  const stats = [
    {
      title: 'Total Donated',
      value: `$${(totalDonated / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+$2.5K this month'
    },
    {
      title: 'Active Donations',
      value: activeDonations.length,
      icon: Heart,
      color: 'bg-red-500',
      change: '3 pending delivery'
    },
    {
      title: 'People Helped',
      value: (peopleHelped / 1000).toFixed(1) + 'K',
      icon: Users,
      color: 'bg-blue-500',
      change: 'Estimated impact'
    },
    {
      title: 'Impact Score',
      value: Math.floor(totalDonated / 100 + activeDonations.length * 10),
      icon: Award,
      color: 'bg-purple-500',
      change: 'Top 5% donor'
    }
  ];

  const urgentCrises = crises.filter(c => c.severity === 'critical' && c.status === 'active').slice(0, 3);

  const donationsByType = donations.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + (d.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Thank you, {user.name}!</h2>
            <p className="text-purple-100">Your generosity is changing lives around the world</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${(totalDonated / 1000).toFixed(1)}K</div>
            <div className="text-sm text-purple-100">Total Impact</div>
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
        {/* Urgent Crisis Appeals */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-red-500" />
            Urgent Crisis Appeals
          </h3>
          <div className="space-y-4">
            {urgentCrises.map((crisis) => (
              <div key={crisis.id} className="border border-red-200 rounded-lg p-4 bg-red-50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{crisis.title}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                    Critical
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{crisis.description.substring(0, 120)}...</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium">${(crisis.totalFunding / 1000).toFixed(0)}K / ${(crisis.fundingGoal / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((crisis.totalFunding / crisis.fundingGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Donate Now
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Recent Donations */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-500" />
            My Recent Donations
          </h3>
          <div className="space-y-4">
            {donations.slice(0, 4).map((donation) => {
              const crisis = crises.find(c => c.id === donation.crisisId);
              return (
                <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{crisis?.title || 'Crisis Relief'}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      donation.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      donation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      {donation.type === 'monetary' ? `$${donation.amount?.toLocaleString()}` : 'Goods donated'}
                    </div>
                    <div className="text-gray-500">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Impact: Helped {Math.floor((donation.amount || 0) / 50)} people
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Donation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-500" />
            Donation Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(donationsByType).map(([type, amount]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    type === 'monetary' ? 'bg-green-500' :
                    type === 'goods' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">{type}</span>
                </div>
                <span className="text-gray-600">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
            Impact Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Lives Impacted</div>
                <div className="text-sm text-gray-600">Direct beneficiaries</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{(peopleHelped / 1000).toFixed(1)}K</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Crises Supported</div>
                <div className="text-sm text-gray-600">Active contributions</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{impactfulCrises.length}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Donor Rank</div>
                <div className="text-sm text-gray-600">Among all donors</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">Top 5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Donate */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Donate</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['$25', '$50', '$100', '$250'].map((amount) => (
            <button key={amount} className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all text-center">
              <div className="text-2xl font-bold">{amount}</div>
              <div className="text-sm opacity-90">One-time</div>
            </button>
          ))}
        </div>
        <button className="w-full mt-4 bg-white text-green-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
          Custom Amount
        </button>
      </div>
    </div>
  );
}