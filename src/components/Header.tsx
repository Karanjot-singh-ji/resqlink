import React from 'react';
import { Heart, Bell, Users, Building, DollarSign, Shield, Menu, Search, MessageCircle, BarChart3, CheckSquare } from 'lucide-react';
import { User } from '../types';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  user: User;
  activeAlerts: number;
  onNavigate: (section: string) => void;
  activeSection: string;
  onRoleSwitch: (role: User['role']) => void;
  alerts: any[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

export default function Header({ user, activeAlerts, onNavigate, activeSection, onRoleSwitch, alerts, onMarkAsRead, onMarkAllAsRead }: HeaderProps) {
  const getRoleConfig = (role: User['role']) => {
    switch (role) {
      case 'ngo':
        return {
          color: 'bg-blue-600',
          icon: Building,
          label: 'NGO Dashboard',
          navItems: [
            { id: 'dashboard', label: 'Overview', icon: Shield },
            { id: 'crises', label: 'Active Crises', icon: Heart },
            { id: 'resources', label: 'Resources', icon: Users },
            { id: 'volunteers', label: 'Volunteers', icon: Users },
            { id: 'reports', label: 'Reports', icon: Bell },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'communications', label: 'Communications', icon: MessageCircle },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ]
        };
      case 'volunteer':
        return {
          color: 'bg-green-600',
          icon: Users,
          label: 'Volunteer Portal',
          navItems: [
            { id: 'dashboard', label: 'My Dashboard', icon: Shield },
            { id: 'opportunities', label: 'Opportunities', icon: Heart },
            { id: 'my-activities', label: 'My Activities', icon: Users },
            { id: 'training', label: 'Training', icon: Bell },
            { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
            { id: 'communications', label: 'Communications', icon: MessageCircle }
          ]
        };
      case 'donor':
        return {
          color: 'bg-purple-600',
          icon: DollarSign,
          label: 'Donor Portal',
          navItems: [
            { id: 'dashboard', label: 'Overview', icon: Shield },
            { id: 'donate', label: 'Donate Now', icon: Heart },
            { id: 'my-donations', label: 'My Donations', icon: DollarSign },
            { id: 'impact', label: 'Impact Reports', icon: Bell },
            { id: 'communications', label: 'Communications', icon: MessageCircle },
            { id: 'analytics', label: 'My Impact', icon: BarChart3 }
          ]
        };
      case 'government':
        return {
          color: 'bg-red-600',
          icon: Shield,
          label: 'Government Portal',
          navItems: [
            { id: 'dashboard', label: 'Command Center', icon: Shield },
            { id: 'coordination', label: 'Coordination', icon: Users },
            { id: 'resources', label: 'Resource Allocation', icon: Building },
            { id: 'analytics', label: 'Analytics', icon: Bell },
            { id: 'tasks', label: 'Task Management', icon: CheckSquare },
            { id: 'communications', label: 'Communications', icon: MessageCircle },
            { id: 'reports', label: 'Reports', icon: BarChart3 }
          ]
        };
    }
  };

  const config = getRoleConfig(user.role);
  const RoleIcon = config.icon;

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-blue-600 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                ResQLink
              </h1>
              <p className="text-sm text-gray-600">Connecting aid. Restoring hope.</p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {(['ngo', 'volunteer', 'donor', 'government'] as const).map((role) => {
              const roleConfig = getRoleConfig(role);
              const RoleIconComponent = roleConfig.icon;
              return (
                <button
                  key={role}
                  onClick={() => onRoleSwitch(role)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    user.role === role
                      ? `${roleConfig.color} text-white shadow-md`
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <RoleIconComponent className="h-4 w-4" />
                  <span className="capitalize">{role}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {config.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? `${config.color} text-white shadow-md`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info and Alerts */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            <NotificationCenter
              user={user}
              alerts={alerts}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
            />

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-600 flex items-center">
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center text-white font-semibold`}>
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}