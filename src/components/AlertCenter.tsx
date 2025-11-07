import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, CheckCircle, Plus, Clock } from 'lucide-react';
import { Alert } from '../types';

interface AlertCenterProps {
  alerts: Alert[];
  onAddAlert: (alert: Omit<Alert, 'id'>) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

export default function AlertCenter({ alerts, onAddAlert, onAcknowledgeAlert }: AlertCenterProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Alert['type'],
    targetRoles: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      ...formData,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      targetRoles: formData.targetRoles ? formData.targetRoles.split(',').map(role => role.trim()) : undefined
    });
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetRoles: ''
    });
    setShowForm(false);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.type === filter;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'critical': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'border-red-500 bg-red-50';
      case 'critical': return 'border-red-400 bg-red-50';
      case 'warning': return 'border-amber-400 bg-amber-50';
      case 'info': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getAlertIconColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-red-600';
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-amber-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Center</h2>
          <p className="text-gray-600">Emergency alerts and notifications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Alert</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'unacknowledged', 'emergency', 'critical', 'warning', 'info'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unacknowledged' && (
                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alerts.filter(a => !a.acknowledged).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className={`h-6 w-6 mt-1 ${getAlertIconColor(alert.type)}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(alert.type)}`}>
                          {alert.type}
                        </span>
                        {alert.acknowledged && (
                          <span className="flex items-center space-x-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Acknowledged</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(alert.timestamp).toLocaleDateString()} at{' '}
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {alert.targetRoles && alert.targetRoles.length > 0 && (
                          <div>
                            <span className="text-gray-500">Target:</span> {alert.targetRoles.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="ml-4 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No alerts match your current filter</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Emergency Alert</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Alert['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Roles (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fire Chief, EMT, Police Officer (comma separated)"
                  value={formData.targetRoles}
                  onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Leave blank to send to all personnel
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}