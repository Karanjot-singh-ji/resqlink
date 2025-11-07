import React, { useState } from 'react';
import { Plus, AlertTriangle, MapPin, Users, TrendingUp, Clock, DollarSign, Target } from 'lucide-react';
import { Crisis, User } from '../types';

interface CrisisManagementProps {
  user: User;
  crises: Crisis[];
  onAddCrisis: (crisis: Omit<Crisis, 'id'>) => void;
  onUpdateCrisis: (id: string, updates: Partial<Crisis>) => void;
}

export default function CrisisManagement({ user, crises, onAddCrisis, onUpdateCrisis }: CrisisManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    type: 'earthquake' as Crisis['type'],
    severity: 'medium' as Crisis['severity'],
    location: '',
    description: '',
    affectedPopulation: 0,
    fundingGoal: 0,
    estimatedDuration: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCrisis({
      ...formData,
      status: 'active',
      startDate: new Date().toISOString(),
      requiredResources: [],
      assignedNGOs: [],
      totalFunding: 0,
      coordinates: { lat: 0, lng: 0 }
    });
    setFormData({
      title: '',
      type: 'earthquake',
      severity: 'medium',
      location: '',
      description: '',
      affectedPopulation: 0,
      fundingGoal: 0,
      estimatedDuration: ''
    });
    setShowForm(false);
  };

  const handleStatusUpdate = (crisisId: string, newStatus: Crisis['status']) => {
    onUpdateCrisis(crisisId, { status: newStatus });
  };

  const filteredCrises = crises.filter(crisis => {
    if (filter === 'all') return true;
    if (filter === 'active') return crisis.status === 'active';
    if (filter === 'critical') return crisis.severity === 'critical';
    return crisis.type === filter;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crisis Management</h2>
          <p className="text-gray-600">Monitor and coordinate crisis response efforts</p>
        </div>
        {(user.role === 'ngo' || user.role === 'government') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Report Crisis</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'critical', 'earthquake', 'flood', 'hurricane', 'conflict'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Crisis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCrises.map((crisis) => (
            <div key={crisis.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getSeverityColor(crisis.severity)}`} />
                  <h3 className="text-lg font-semibold text-gray-900">{crisis.title}</h3>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(crisis.status)}`}>
                  {crisis.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{crisis.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{crisis.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{crisis.affectedPopulation.toLocaleString()} affected</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{crisis.estimatedDuration || 'Unknown duration'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{crisis.assignedNGOs.length} NGOs assigned</span>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-medium">
                    ${(crisis.totalFunding / 1000).toFixed(0)}K / ${(crisis.fundingGoal / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((crisis.totalFunding / crisis.fundingGoal) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((crisis.totalFunding / crisis.fundingGoal) * 100).toFixed(1)}% funded
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCrisis(crisis)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Details
                </button>
                {(user.role === 'government' || user.role === 'ngo') && (
                  <div className="flex space-x-1">
                    {crisis.status === 'active' && (
                      <button
                        onClick={() => handleStatusUpdate(crisis.id, 'monitoring')}
                        className="bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Monitor
                      </button>
                    )}
                    {crisis.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(crisis.id, 'resolved')}
                        className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCrises.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No crises match your current filter</p>
          </div>
        )}
      </div>

      {/* Crisis Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report New Crisis</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crisis Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crisis Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Crisis['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="drought">Drought</option>
                    <option value="pandemic">Pandemic</option>
                    <option value="conflict">Conflict</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as Crisis['severity'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affected Population</label>
                  <input
                    type="number"
                    required
                    value={formData.affectedPopulation}
                    onChange={(e) => setFormData({ ...formData, affectedPopulation: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({ ...formData, fundingGoal: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 3-6 months"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Report Crisis
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

      {/* Crisis Details Modal */}
      {selectedCrisis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCrisis.title}</h3>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedCrisis.status)}`}>
                    {selectedCrisis.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedCrisis.severity)}`} />
                    <span className="text-sm font-medium capitalize">{selectedCrisis.severity} Severity</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrisis(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Crisis Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedCrisis.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{selectedCrisis.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(selectedCrisis.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedCrisis.estimatedDuration || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Impact</h4>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {selectedCrisis.affectedPopulation.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-700">People Affected</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Funding Status</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        ${(selectedCrisis.totalFunding / 1000).toFixed(0)}K / ${(selectedCrisis.fundingGoal / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((selectedCrisis.totalFunding / selectedCrisis.fundingGoal) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-sm text-blue-700">
                      {((selectedCrisis.totalFunding / selectedCrisis.fundingGoal) * 100).toFixed(1)}% of goal reached
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Response Team</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {selectedCrisis.assignedNGOs.length}
                    </div>
                    <div className="text-sm text-green-700">NGOs Assigned</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">{selectedCrisis.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}