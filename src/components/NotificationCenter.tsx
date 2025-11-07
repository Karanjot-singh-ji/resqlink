import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock, Filter } from 'lucide-react';
import { Alert, User } from '../types';

interface NotificationCenterProps {
  user: User;
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationCenter({ user, alerts, onMarkAsRead, onMarkAllAsRead }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newNotifications, setNewNotifications] = useState<string[]>([]);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.acknowledged;
    return alert.type === filter;
  });

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const latestAlert = alerts[0];
      if (latestAlert && !newNotifications.includes(latestAlert.id)) {
        setNewNotifications(prev => [latestAlert.id, ...prev.slice(0, 4)]);
        
        // Auto-remove from new notifications after 5 seconds
        setTimeout(() => {
          setNewNotifications(prev => prev.filter(id => id !== latestAlert.id));
        }, 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [alerts, newNotifications]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center animate-pulse">
            {unreadAlerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {['all', 'unread', 'emergency', 'info'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      filter === filterType
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
              
              {unreadAlerts.length > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  const isNew = newNotifications.includes(alert.id);
                  
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !alert.acknowledged ? 'bg-blue-50' : ''
                      } ${isNew ? 'animate-pulse border-l-4 border-blue-500' : ''}`}
                      onClick={() => onMarkAsRead(alert.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {alert.title}
                            </h4>
                            {!alert.acknowledged && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            {isNew && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}