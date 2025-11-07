export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ngo' | 'volunteer' | 'donor' | 'government';
  organization?: string;
  location: string;
  avatar?: string;
  verified: boolean;
}

export interface Crisis {
  id: string;
  title: string;
  type: 'earthquake' | 'flood' | 'hurricane' | 'wildfire' | 'drought' | 'pandemic' | 'conflict' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'monitoring' | 'resolved';
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  affectedPopulation: number;
  startDate: string;
  estimatedDuration?: string;
  requiredResources: ResourceNeed[];
  assignedNGOs: string[];
  totalFunding: number;
  fundingGoal: number;
}

export interface ResourceNeed {
  id: string;
  crisisId: string;
  type: 'food' | 'water' | 'shelter' | 'medical' | 'clothing' | 'transport' | 'equipment' | 'personnel';
  item: string;
  quantity: number;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'needed' | 'partially-fulfilled' | 'fulfilled';
  requestedBy: string;
  deadline?: string;
  description?: string;
  fulfilled: number;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  crisisId: string;
  type: 'monetary' | 'goods' | 'services';
  amount?: number;
  currency?: string;
  items?: { name: string; quantity: number; unit: string }[];
  status: 'pledged' | 'confirmed' | 'delivered';
  timestamp: string;
  anonymous: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  crisisId: string;
  ngoId: string;
  ngoName: string;
  type: 'field-work' | 'logistics' | 'medical' | 'technical' | 'administrative' | 'transport';
  location: string;
  requiredSkills: string[];
  timeCommitment: string;
  startDate: string;
  endDate?: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  description: string;
  requirements: string[];
}

export interface NGO {
  id: string;
  name: string;
  type: 'relief' | 'medical' | 'education' | 'development' | 'environmental' | 'advocacy';
  location: string;
  description: string;
  specializations: string[];
  verified: boolean;
  rating: number;
  totalProjects: number;
  activeCrises: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'update' | 'request' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetRoles?: ('ngo' | 'volunteer' | 'donor' | 'government')[];
  crisisId?: string;
  timestamp: string;
  acknowledged: boolean;
  expiresAt?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'situation' | 'progress' | 'financial' | 'impact';
  crisisId: string;
  authorId: string;
  authorName: string;
  content: string;
  attachments?: string[];
  timestamp: string;
  visibility: 'public' | 'stakeholders' | 'government';
}