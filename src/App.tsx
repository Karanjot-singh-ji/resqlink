import React, { useState } from 'react';
import Header from './components/Header';
import CrisisManagement from './components/CrisisManagement';
import ResourceManagement from './components/ResourceManagement';
import VolunteerOpportunities from './components/VolunteerOpportunities';
import DonationCenter from './components/DonationCenter';
import NGODashboard from './components/dashboards/NGODashboard';
import VolunteerDashboard from './components/dashboards/VolunteerDashboard';
import DonorDashboard from './components/dashboards/DonorDashboard';
import GovernmentDashboard from './components/dashboards/GovernmentDashboard';
import { User, Crisis, ResourceNeed, VolunteerOpportunity, NGO, Donation, Alert } from './types';

function App() {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Karanjot Singh',
    email: 'sarah@example.com',
    role: 'ngo',
    organization: 'Global Relief Foundation',
    location: 'New York, USA',
    verified: true
  });

  const [activeSection, setActiveSection] = useState('dashboard');

  // State management for all data
  const [crises, setCrises] = useState<Crisis[]>([
    {
      id: '1',
      title: 'Turkey-Syria Earthquake Relief',
      type: 'earthquake',
      severity: 'critical',
      status: 'active',
      location: 'Turkey & Northern Syria',
      coordinates: { lat: 37.0662, lng: 37.3833 },
      description: 'Massive 7.8 magnitude earthquake devastates southeastern Turkey and northern Syria, affecting millions.',
      affectedPopulation: 2500000,
      startDate: '2024-02-06T04:17:00Z',
      estimatedDuration: '6-12 months',
      requiredResources: [],
      assignedNGOs: ['ngo1', 'ngo2', 'ngo3'],
      totalFunding: 45000000,
      fundingGoal: 100000000
    },
    {
      id: '2',
      title: 'Pakistan Flood Emergency',
      type: 'flood',
      severity: 'high',
      status: 'active',
      location: 'Sindh & Balochistan, Pakistan',
      description: 'Unprecedented monsoon floods affect over 33 million people across Pakistan.',
      affectedPopulation: 33000000,
      startDate: '2024-01-15T00:00:00Z',
      requiredResources: [],
      assignedNGOs: ['ngo1', 'ngo4'],
      totalFunding: 25000000,
      fundingGoal: 80000000
    },
    {
      id: '3',
      title: 'Ukraine Humanitarian Crisis',
      type: 'conflict',
      severity: 'critical',
      status: 'active',
      location: 'Ukraine',
      description: 'Ongoing conflict creates massive displacement and humanitarian needs.',
      affectedPopulation: 18000000,
      startDate: '2022-02-24T00:00:00Z',
      requiredResources: [],
      assignedNGOs: ['ngo2', 'ngo3', 'ngo5'],
      totalFunding: 120000000,
      fundingGoal: 200000000
    }
  ]);

  const [resources, setResources] = useState<ResourceNeed[]>([
    {
      id: '1',
      crisisId: '1',
      type: 'medical',
      item: 'Emergency Medical Supplies',
      quantity: 5000,
      unit: 'kits',
      priority: 'urgent',
      status: 'needed',
      requestedBy: 'Turkish Red Crescent',
      deadline: '2024-02-15T00:00:00Z',
      fulfilled: 1200
    },
    {
      id: '2',
      crisisId: '1',
      type: 'shelter',
      item: 'Emergency Tents',
      quantity: 10000,
      unit: 'units',
      priority: 'urgent',
      status: 'partially-fulfilled',
      requestedBy: 'UNHCR',
      fulfilled: 3500
    },
    {
      id: '3',
      crisisId: '2',
      type: 'food',
      item: 'Ready-to-Eat Meals',
      quantity: 100000,
      unit: 'meals',
      priority: 'high',
      status: 'needed',
      requestedBy: 'World Food Programme',
      fulfilled: 25000
    }
  ]);

  const [volunteers, setVolunteers] = useState<VolunteerOpportunity[]>([
    {
      id: '1',
      title: 'Emergency Response Coordinator',
      crisisId: '1',
      ngoId: 'ngo1',
      ngoName: 'Global Relief Foundation',
      type: 'field-work',
      location: 'Gaziantep, Turkey',
      requiredSkills: ['Emergency Response', 'Logistics', 'Turkish Language'],
      timeCommitment: '2-4 weeks',
      startDate: '2024-02-10T00:00:00Z',
      volunteersNeeded: 5,
      volunteersRegistered: 2,
      description: 'Coordinate emergency response efforts in earthquake-affected areas.',
      requirements: ['Previous disaster response experience', 'Physical fitness', 'Valid passport']
    },
    {
      id: '2',
      title: 'Medical Volunteer',
      crisisId: '1',
      ngoId: 'ngo2',
      ngoName: 'Doctors Without Borders',
      type: 'medical',
      location: 'Aleppo, Syria',
      requiredSkills: ['Medical Training', 'Arabic Language'],
      timeCommitment: '4-6 weeks',
      startDate: '2024-02-08T00:00:00Z',
      volunteersNeeded: 10,
      volunteersRegistered: 7,
      description: 'Provide medical care to earthquake survivors in field hospitals.',
      requirements: ['Medical degree or nursing certification', 'Trauma experience preferred']
    }
  ]);

  const ngos: NGO[] = [
    {
      id: 'ngo1',
      name: 'Global Relief Foundation',
      type: 'relief',
      location: 'New York, USA',
      description: 'International humanitarian organization providing emergency relief worldwide.',
      specializations: ['Emergency Response', 'Disaster Relief', 'Food Security'],
      verified: true,
      rating: 4.8,
      totalProjects: 156,
      activeCrises: ['1', '2'],
      contactInfo: {
        email: 'contact@globalrelief.org',
        phone: '+1-555-0123',
        website: 'https://globalrelief.org'
      }
    },
    {
      id: 'ngo2',
      name: 'Doctors Without Borders',
      type: 'medical',
      location: 'Geneva, Switzerland',
      description: 'International medical humanitarian organization.',
      specializations: ['Emergency Medicine', 'Epidemic Response', 'Surgery'],
      verified: true,
      rating: 4.9,
      totalProjects: 89,
      activeCrises: ['1', '3'],
      contactInfo: {
        email: 'info@msf.org',
        phone: '+41-22-849-8400'
      }
    }
  ];

  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      donorId: 'donor1',
      donorName: 'Anonymous Donor',
      crisisId: '1',
      type: 'monetary',
      amount: 50000,
      currency: 'USD',
      status: 'confirmed',
      timestamp: '2024-02-07T10:30:00Z',
      anonymous: true
    },
    {
      id: '2',
      donorId: 'donor2',
      donorName: 'Tech for Good Foundation',
      crisisId: '1',
      type: 'goods',
      items: [
        { name: 'Satellite Phones', quantity: 100, unit: 'units' },
        { name: 'Solar Chargers', quantity: 500, unit: 'units' }
      ],
      status: 'delivered',
      timestamp: '2024-02-05T14:20:00Z',
      anonymous: false
    }
  ]);

  const myActivities = [
    {
      title: 'Earthquake Response Team',
      organization: 'Global Relief Foundation',
      status: 'active',
      nextSession: 'Feb 15, 2024',
      hoursContributed: 24
    },
    {
      title: 'Community Kitchen Volunteer',
      organization: 'Local Food Bank',
      status: 'active',
      nextSession: 'Feb 12, 2024',
      hoursContributed: 16
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Critical Resource Shortage',
      message: 'Urgent need for medical supplies in Turkey earthquake zone.',
      type: 'emergency',
      severity: 'critical',
      targetRoles: ['ngo', 'government'],
      crisisId: '1',
      timestamp: '2024-02-08T08:00:00Z',
      acknowledged: false
    }
  ];

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;

  // Handler functions
  const handleAddCrisis = (newCrisis: Omit<Crisis, 'id'>) => {
    const crisis: Crisis = {
      ...newCrisis,
      id: Date.now().toString()
    };
    setCrises(prev => [crisis, ...prev]);
  };

  const handleUpdateCrisis = (id: string, updates: Partial<Crisis>) => {
    setCrises(prev => prev.map(crisis => 
      crisis.id === id ? { ...crisis, ...updates } : crisis
    ));
  };

  const handleAddResource = (newResource: Omit<ResourceNeed, 'id'>) => {
    const resource: ResourceNeed = {
      ...newResource,
      id: Date.now().toString()
    };
    setResources(prev => [resource, ...prev]);
  };

  const handleUpdateResource = (id: string, updates: Partial<ResourceNeed>) => {
    setResources(prev => prev.map(resource => 
      resource.id === id ? { ...resource, ...updates } : resource
    ));
  };

  const handleAddVolunteerOpportunity = (newOpportunity: Omit<VolunteerOpportunity, 'id'>) => {
    const opportunity: VolunteerOpportunity = {
      ...newOpportunity,
      id: Date.now().toString()
    };
    setVolunteers(prev => [opportunity, ...prev]);
  };

  const handleApplyToOpportunity = (opportunityId: string) => {
    setVolunteers(prev => prev.map(opportunity => 
      opportunity.id === opportunityId 
        ? { ...opportunity, volunteersRegistered: opportunity.volunteersRegistered + 1 }
        : opportunity
    ));
  };

  const handleMakeDonation = (newDonation: Omit<Donation, 'id'>) => {
    const donation: Donation = {
      ...newDonation,
      id: Date.now().toString()
    };
    setDonations(prev => [donation, ...prev]);
    
    // Update crisis funding if monetary donation
    if (donation.type === 'monetary' && donation.amount) {
      setCrises(prev => prev.map(crisis => 
        crisis.id === donation.crisisId 
          ? { ...crisis, totalFunding: crisis.totalFunding + donation.amount! }
          : crisis
      ));
    }
  };

  const handleRoleSwitch = (newRole: User['role']) => {
    setUser(prev => ({ ...prev, role: newRole }));
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'crises':
        return (
          <CrisisManagement
            user={user}
            crises={crises}
            onAddCrisis={handleAddCrisis}
            onUpdateCrisis={handleUpdateCrisis}
          />
        );
      case 'resources':
        return (
          <ResourceManagement
            user={user}
            resources={resources}
            crises={crises}
            onAddResource={handleAddResource}
            onUpdateResource={handleUpdateResource}
          />
        );
      case 'volunteers':
      case 'opportunities':
        return (
          <VolunteerOpportunities
            user={user}
            opportunities={volunteers}
            crises={crises}
            onAddOpportunity={handleAddVolunteerOpportunity}
            onApplyToOpportunity={handleApplyToOpportunity}
          />
        );
      case 'donate':
      case 'my-donations':
        return (
          <DonationCenter
            user={user}
            crises={crises}
            donations={donations}
            onMakeDonation={handleMakeDonation}
          />
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'ngo':
        return <NGODashboard user={user} crises={crises} resources={resources} volunteers={volunteers} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} opportunities={volunteers} myActivities={myActivities} />;
      case 'donor':
        return <DonorDashboard user={user} crises={crises} donations={donations} />;
      case 'government':
        return <GovernmentDashboard user={user} crises={crises} resources={resources} ngos={ngos} />;
      default:
        return <NGODashboard user={user} crises={crises} resources={resources} volunteers={volunteers} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        activeAlerts={unacknowledgedAlerts}
        onNavigate={setActiveSection}
        activeSection={activeSection}
        onRoleSwitch={handleRoleSwitch}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;