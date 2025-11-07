import React from 'react';
import { AlertTriangle, Users, MapPin, Clock, TrendingUp, Activity } from 'lucide-react';
import { Incident, EmergencyContact, Alert } from '../types';

interface DashboardProps {
  incidents: Incident[];
  contacts: EmergencyContact[];
  alerts: Alert[];
}

export default function Dashboard({ incidents, contacts, alerts }: DashboardProps) {
  const activeIncidents = incidents.filter(i => i.status === 'active');
  const criticalIncidents = incidents.filter(i => i.priority === 'critical');
  const availablePersonnel = contacts.filter(c => c.status === 'available');
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const stats = [
    {
      title: 'Active Incidents',
      value: activeIncidents.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '+12%'
    },
    {
      title: 'Available Personnel',
      value: availablePersonnel.length,
      icon: Users,
      color: 'bg-green-500',
      trend: '-5%'
    },
    {
      title: 'Critical Alerts',
      value: unacknowledgedAlerts.filter(a => a.type === 'critical').length,
      icon: Activity,
      color: 'bg-amber-500',
      trend: '+8%'
    },
    {
      title: 'Response Time',
      value: '4.2m',
      icon: Clock,
      color: 'bg-blue-500',
      trend: '-15%'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Operations Dashboard</h2>
        <p className="text-gray-600">Real-time overview of emergency response activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">{stat.trend}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Critical Incidents</h3>
          <div className="space-y-4">
            {criticalIncidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{incident.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-600">{incident.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(incident.priority)}`}>
                  {incident.priority}
                </span>
              </div>
            ))}
            {criticalIncidents.length === 0 && (
              <p className="text-gray-500 text-center py-8">No critical incidents at this time</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel Status</h3>
          <div className="space-y-4">
            {contacts.slice(0, 5).map((contact) => (
              <div key={contact.id} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  contact.status === 'available' ? 'bg-green-500' :
                  contact.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-600">{contact.role} • {contact.department}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  contact.status === 'available' ? 'bg-green-100 text-green-800' :
                  contact.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Response Map</h3>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive emergency response map</p>
            <p className="text-sm text-gray-500 mt-1">Real-time incident locations and personnel tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}