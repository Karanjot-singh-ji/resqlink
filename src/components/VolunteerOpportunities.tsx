import React, { useState } from 'react';
import { Plus, Users, MapPin, Clock, Star, Calendar, Filter } from 'lucide-react';
import { VolunteerOpportunity, User, Crisis } from '../types';

interface VolunteerOpportunitiesProps {
  user: User;
  opportunities: VolunteerOpportunity[];
  crises: Crisis[];
  onAddOpportunity: (opportunity: Omit<VolunteerOpportunity, 'id'>) => void;
  onApplyToOpportunity: (opportunityId: string) => void;
}

export default function VolunteerOpportunities({ user, opportunities, crises, onAddOpportunity, onApplyToOpportunity }: VolunteerOpportunitiesProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    crisisId: '',
    type: 'field-work' as VolunteerOpportunity['type'],
    location: '',
    requiredSkills: '',
    timeCommitment: '',
    startDate: '',
    endDate: '',
    volunteersNeeded: 1,
    description: '',
    requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOpportunity({
      ...formData,
      ngoId: user.id,
      ngoName: user.organization || user.name,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
      requirements: formData.requirements.split(',').map(s => s.trim()),
      volunteersRegistered: 0
    });
    setFormData({
      title: '',
      crisisId: '',
      type: 'field-work',
      location: '',
      requiredSkills: '',
      timeCommitment: '',
      startDate: '',
      endDate: '',
      volunteersNeeded: 1,
      description: '',
      requirements: ''
    });
    setShowForm(false);
  };

  const handleApply = (opportunityId: string) => {
    onApplyToOpportunity(opportunityId);
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (filter === 'all') return true;
    if (filter === 'available') return opportunity.volunteersRegistered < opportunity.volunteersNeeded;
    if (filter === 'urgent') return opportunity.volunteersRegistered < opportunity.volunteersNeeded * 0.5;
    return opportunity.type === filter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'field-work': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      case 'logistics': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'administrative': return 'bg-yellow-100 text-yellow-800';
      case 'transport': return 'bg-indigo-100 text-indigo-800';
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
      case 'transport': return '🚛';
      default: return '🤝';
    }
  };

  const getUrgencyLevel = (opportunity: VolunteerOpportunity) => {
    const fillPercentage = (opportunity.volunteersRegistered / opportunity.volunteersNeeded) * 100;
    if (fillPercentage < 25) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (fillPercentage < 50) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (fillPercentage < 75) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h2>
          <p className="text-gray-600">Find meaningful ways to contribute to crisis relief efforts</p>
        </div>
        {user.role === 'ngo' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Post Opportunity</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          {['all', 'available', 'urgent', 'field-work', 'medical', 'logistics', 'technical'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => {
            const crisis = crises.find(c => c.id === opportunity.crisisId);
            const urgency = getUrgencyLevel(opportunity);
            const spotsLeft = opportunity.volunteersNeeded - opportunity.volunteersRegistered;
            const fillPercentage = (opportunity.volunteersRegistered / opportunity.volunteersNeeded) * 100;

            return (
              <div key={opportunity.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(opportunity.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                      <p className="text-sm text-gray-600">{opportunity.ngoName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type.replace('-', ' ')}
                    </span>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${urgency.bg} ${urgency.color}`}>
                      {urgency.level} Need
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>

                {crisis && (
                  <div className="bg-red-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium text-red-800">Crisis: {crisis.title}</div>
                    <div className="text-xs text-red-600">{crisis.location}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.timeCommitment}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(opportunity.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{spotsLeft} spots left</span>
                  </div>
                </div>

                {/* Skills Required */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Skills Required:</div>
                  <div className="flex flex-wrap gap-1">
                    {opportunity.requiredSkills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {opportunity.requiredSkills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{opportunity.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Volunteers</span>
                    <span className="font-medium">{opportunity.volunteersRegistered}/{opportunity.volunteersNeeded}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        fillPercentage >= 100 ? 'bg-green-500' :
                        fillPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  {user.role === 'volunteer' && spotsLeft > 0 && (
                    <button
                      onClick={() => handleApply(opportunity.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No volunteer opportunities match your current filter</p>
          </div>
        )}
      </div>

      {/* Opportunity Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Volunteer Opportunity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crisis</label>
                  <select
                    required
                    value={formData.crisisId}
                    onChange={(e) => setFormData({ ...formData, crisisId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a crisis</option>
                    {crises.filter(c => c.status === 'active').map(crisis => (
                      <option key={crisis.id} value={crisis.id}>{crisis.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as VolunteerOpportunity['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="field-work">Field Work</option>
                    <option value="logistics">Logistics</option>
                    <option value="medical">Medical</option>
                    <option value="technical">Technical</option>
                    <option value="administrative">Administrative</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Commitment</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2-4 weeks, 20 hours/week"
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers Needed</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.volunteersNeeded}
                    onChange={(e) => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., First Aid, Construction, Language Skills"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Valid passport, Physical fitness, Background check"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Post Opportunity
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

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedOpportunity.title}</h3>
                <p className="text-gray-600">{selectedOpportunity.ngoName}</p>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Opportunity Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{selectedOpportunity.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedOpportunity.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Commitment:</span>
                      <span className="font-medium">{selectedOpportunity.timeCommitment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(selectedOpportunity.startDate).toLocaleDateString()}</span>
                    </div>
                    {selectedOpportunity.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{new Date(selectedOpportunity.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.requiredSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedOpportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Volunteer Status</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Registered</span>
                      <span className="font-medium">
                        {selectedOpportunity.volunteersRegistered}/{selectedOpportunity.volunteersNeeded}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((selectedOpportunity.volunteersRegistered / selectedOpportunity.volunteersNeeded) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-sm text-green-700">
                      {selectedOpportunity.volunteersNeeded - selectedOpportunity.volunteersRegistered} spots remaining
                    </div>
                  </div>
                </div>

                {user.role === 'volunteer' && selectedOpportunity.volunteersRegistered < selectedOpportunity.volunteersNeeded && (
                  <button
                    onClick={() => {
                      handleApply(selectedOpportunity.id);
                      setSelectedOpportunity(null);
                    }}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Apply for This Opportunity
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">{selectedOpportunity.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}