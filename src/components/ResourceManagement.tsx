import React, { useState } from 'react';
import { Plus, Package, Clock, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { ResourceNeed, User, Crisis } from '../types';

interface ResourceManagementProps {
  user: User;
  resources: ResourceNeed[];
  crises: Crisis[];
  onAddResource: (resource: Omit<ResourceNeed, 'id'>) => void;
  onUpdateResource: (id: string, updates: Partial<ResourceNeed>) => void;
}

export default function ResourceManagement({ user, resources, crises, onAddResource, onUpdateResource }: ResourceManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    crisisId: '',
    type: 'food' as ResourceNeed['type'],
    item: '',
    quantity: 0,
    unit: '',
    priority: 'medium' as ResourceNeed['priority'],
    requestedBy: user.organization || user.name,
    deadline: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource({
      ...formData,
      status: 'needed',
      fulfilled: 0
    });
    setFormData({
      crisisId: '',
      type: 'food',
      item: '',
      quantity: 0,
      unit: '',
      priority: 'medium',
      requestedBy: user.organization || user.name,
      deadline: '',
      description: ''
    });
    setShowForm(false);
  };

  const handleFulfillment = (resourceId: string, amount: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      const newFulfilled = Math.min(resource.fulfilled + amount, resource.quantity);
      const newStatus = newFulfilled >= resource.quantity ? 'fulfilled' : 
                       newFulfilled > 0 ? 'partially-fulfilled' : 'needed';
      onUpdateResource(resourceId, { 
        fulfilled: newFulfilled,
        status: newStatus
      });
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesType = filter === 'all' || resource.type === filter;
    const matchesPriority = priorityFilter === 'all' || resource.priority === priorityFilter;
    const matchesStatus = filter === 'needed' ? resource.status === 'needed' :
                         filter === 'urgent' ? resource.priority === 'urgent' : true;
    return matchesType && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needed': return 'bg-red-100 text-red-800';
      case 'partially-fulfilled': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍞';
      case 'water': return '💧';
      case 'shelter': return '🏠';
      case 'medical': return '🏥';
      case 'clothing': return '👕';
      case 'transport': return '🚛';
      case 'equipment': return '🔧';
      case 'personnel': return '👥';
      default: return '📦';
    }
  };

  const resourceStats = {
    total: resources.length,
    urgent: resources.filter(r => r.priority === 'urgent' && r.status === 'needed').length,
    fulfilled: resources.filter(r => r.status === 'fulfilled').length,
    pending: resources.filter(r => r.status === 'needed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Track and coordinate resource allocation for crisis response</p>
        </div>
        {(user.role === 'ngo' || user.role === 'government') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Request Resource</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{resourceStats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Needs</p>
              <p className="text-2xl font-bold text-red-600">{resourceStats.urgent}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fulfilled</p>
              <p className="text-2xl font-bold text-green-600">{resourceStats.fulfilled}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{resourceStats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters and Resource List */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          {['all', 'urgent', 'needed', 'food', 'water', 'shelter', 'medical'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const crisis = crises.find(c => c.id === resource.crisisId);
            const fulfillmentPercentage = (resource.fulfilled / resource.quantity) * 100;
            
            return (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.item}</h3>
                      <p className="text-sm text-gray-600">
                        Requested by {resource.requestedBy} • {crisis?.title || 'Unknown Crisis'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(resource.priority)}`}>
                      {resource.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resource.status)}`}>
                      {resource.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {resource.description && (
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Quantity Needed</div>
                    <div className="font-semibold text-gray-900">
                      {resource.quantity.toLocaleString()} {resource.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Fulfilled</div>
                    <div className="font-semibold text-gray-900">
                      {resource.fulfilled.toLocaleString()} {resource.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className="font-semibold text-gray-900">
                      {(resource.quantity - resource.fulfilled).toLocaleString()} {resource.unit}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Fulfillment Progress</span>
                    <span className="font-medium">{fulfillmentPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        fulfillmentPercentage >= 100 ? 'bg-green-500' :
                        fulfillmentPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(fulfillmentPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {resource.deadline && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {new Date(resource.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {resource.status !== 'fulfilled' && (user.role === 'donor' || user.role === 'ngo') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFulfillment(resource.id, Math.min(100, resource.quantity - resource.fulfilled))}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Contribute
                      </button>
                      <button
                        onClick={() => handleFulfillment(resource.id, resource.quantity - resource.fulfilled)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Fulfill All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources match your current filter</p>
          </div>
        )}
      </div>

      {/* Resource Request Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Resource</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crisis</label>
                  <select
                    required
                    value={formData.crisisId}
                    onChange={(e) => setFormData({ ...formData, crisisId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a crisis</option>
                    {crises.filter(c => c.status === 'active').map(crisis => (
                      <option key={crisis.id} value={crisis.id}>{crisis.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceNeed['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="shelter">Shelter</option>
                    <option value="medical">Medical</option>
                    <option value="clothing">Clothing</option>
                    <option value="transport">Transport</option>
                    <option value="equipment">Equipment</option>
                    <option value="personnel">Personnel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as ResourceNeed['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Emergency Medical Supplies, Tents, Food Packages"
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., kits, units, meals, liters"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
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