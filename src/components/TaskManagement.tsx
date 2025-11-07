import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertTriangle, User, Calendar, Filter, Search } from 'lucide-react';
import { User as UserType } from '../types';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  crisisId?: string;
  crisisName?: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

interface TaskManagementProps {
  user: UserType;
}

export default function TaskManagement({ user }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Coordinate medical supply distribution',
      description: 'Organize the distribution of medical supplies to affected areas in Turkey',
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: 'user1',
      assignedToName: 'Sarah Johnson',
      dueDate: '2024-02-15',
      crisisId: '1',
      crisisName: 'Turkey-Syria Earthquake Relief',
      tags: ['medical', 'logistics', 'urgent'],
      createdAt: '2024-02-10T08:00:00Z'
    },
    {
      id: '2',
      title: 'Recruit volunteer translators',
      description: 'Find volunteers who can translate between Turkish, Arabic, and English',
      priority: 'high',
      status: 'todo',
      assignedTo: 'user2',
      assignedToName: 'Mike Chen',
      dueDate: '2024-02-18',
      crisisId: '1',
      crisisName: 'Turkey-Syria Earthquake Relief',
      tags: ['volunteers', 'translation'],
      createdAt: '2024-02-11T10:30:00Z'
    },
    {
      id: '3',
      title: 'Update donor impact report',
      description: 'Compile and update the quarterly impact report for major donors',
      priority: 'medium',
      status: 'review',
      assignedTo: 'user3',
      assignedToName: 'Emma Rodriguez',
      dueDate: '2024-02-20',
      tags: ['reporting', 'donors'],
      createdAt: '2024-02-09T14:15:00Z'
    },
    {
      id: '4',
      title: 'Set up emergency shelter',
      description: 'Coordinate with local authorities to establish temporary shelters',
      priority: 'urgent',
      status: 'completed',
      assignedTo: 'user1',
      assignedToName: 'Sarah Johnson',
      dueDate: '2024-02-12',
      crisisId: '1',
      crisisName: 'Turkey-Syria Earthquake Relief',
      tags: ['shelter', 'coordination'],
      createdAt: '2024-02-08T09:00:00Z',
      completedAt: '2024-02-12T16:30:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    assignedToName: '',
    dueDate: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      status: 'todo',
      tags: formData.tags.split(',').map(tag => tag.trim()),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      assignedToName: '',
      dueDate: '',
      tags: ''
    });
    setShowForm(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'my-tasks') return matchesSearch && task.assignedTo === user.id;
    if (filter === 'overdue') {
      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
      return matchesSearch && isOverdue;
    }
    return matchesSearch && (task.status === filter || task.priority === filter);
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'status':
        const statusOrder = { todo: 0, 'in-progress': 1, review: 2, completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
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
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return Clock;
      case 'in-progress': return AlertTriangle;
      case 'review': return User;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
          <p className="text-gray-600">Organize and track relief operation tasks</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tasks', value: taskStats.total, color: 'bg-gray-500' },
          { label: 'To Do', value: taskStats.todo, color: 'bg-blue-500' },
          { label: 'In Progress', value: taskStats.inProgress, color: 'bg-yellow-500' },
          { label: 'Completed', value: taskStats.completed, color: 'bg-green-500' },
          { label: 'Overdue', value: taskStats.overdue, color: 'bg-red-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="my-tasks">My Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'status')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {sortedTasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
            
            return (
              <div key={task.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{task.assignedToName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      {task.crisisName && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{task.crisisName}</span>
                        </div>
                      )}
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <StatusIcon className="h-5 w-5 text-gray-500" />
                    {task.status !== 'completed' && (
                      <div className="flex space-x-1">
                        {task.status === 'todo' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'review')}
                              className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {task.status === 'review' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks match your current filter</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (ID)</label>
                  <input
                    type="text"
                    required
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Name)</label>
                  <input
                    type="text"
                    required
                    value={formData.assignedToName}
                    onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., medical, urgent, logistics"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Task
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