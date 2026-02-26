export type OfferFor = 'partner' | 'employee' | 'store';
export type OfferOn = 'matching_rp' | 'total_orders' | 'level' | 'days_since_joining';
export type RewardType = 'cash' | 'points' | 'discount' | 'travel';
export type OfferStatus = 'active' | 'disabled' | 'expired';
export type ProgressStatus = 'in_progress' | 'completed' | 'expired' | 'not_started';

export interface Offer {
  id: string;
  name: string;
  description: string;
  offerFor: OfferFor;
  offerOn: OfferOn;
  targetValue: number;
  reward: {
    type: RewardType;
    value: number;
    description: string;
  };
  validity: {
    startDate: string;
    endDate: string;
  };
  initialCount: boolean; // Only applicable for matching_rp and total_orders
  status: OfferStatus;
  createdAt: string;
  createdBy: string;
}

export interface OfferProgress {
  id: string;
  offerId: string;
  userId: string; // partner_id, employee_id, or store_id
  userName: string;
  userType: OfferFor;
  currentValue: number;
  targetValue: number;
  progress: number; // percentage (0-100)
  status: ProgressStatus;
  startedAt: string;
  completedAt?: string;
  baselineValue?: number; // For initial count tracking - value at offer start
}

// Mock Offers Data
export const mockOffers: Offer[] = [
  // Active Partner Offers
  {
    id: 'OFF-001',
    name: 'Platinum Partner Milestone',
    description: 'Achieve 10,000 matching RP to earn ₹5,000 cash bonus',
    offerFor: 'partner',
    offerOn: 'matching_rp',
    targetValue: 10000,
    reward: {
      type: 'cash',
      value: 5000,
      description: '₹5,000 cash bonus',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: true, // Don't count past matching RP
    status: 'active',
    createdAt: '2023-12-15',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-002',
    name: 'New Partner Welcome Bonus',
    description: 'Complete 5 orders within 30 days of joining',
    offerFor: 'partner',
    offerOn: 'total_orders',
    targetValue: 5,
    reward: {
      type: 'points',
      value: 500,
      description: '500 bonus RP',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: true, // Start counting from offer creation
    status: 'active',
    createdAt: '2023-12-20',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-003',
    name: 'Diamond Level Achievement',
    description: 'Reach level 5 in partner hierarchy',
    offerFor: 'partner',
    offerOn: 'level',
    targetValue: 5,
    reward: {
      type: 'cash',
      value: 10000,
      description: '₹10,000 achievement bonus',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: false, // Not applicable for level
    status: 'active',
    createdAt: '2023-12-10',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-004',
    name: '90-Day Loyalty Reward',
    description: 'Complete 90 days with the company',
    offerFor: 'partner',
    offerOn: 'days_since_joining',
    targetValue: 90,
    reward: {
      type: 'points',
      value: 1000,
      description: '1,000 loyalty RP',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: false, // Not applicable for days
    status: 'active',
    createdAt: '2023-12-01',
    createdBy: 'Business Owner',
  },

  // Active Employee Offers
  {
    id: 'OFF-005',
    name: 'Employee Sales Champion',
    description: 'Process 50 orders in a month',
    offerFor: 'employee',
    offerOn: 'total_orders',
    targetValue: 50,
    reward: {
      type: 'cash',
      value: 3000,
      description: '₹3,000 performance bonus',
    },
    validity: {
      startDate: '2024-02-01',
      endDate: '2024-02-29',
    },
    initialCount: true,
    status: 'active',
    createdAt: '2024-01-25',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-006',
    name: 'Employee Retention Bonus',
    description: 'Complete 180 days of service',
    offerFor: 'employee',
    offerOn: 'days_since_joining',
    targetValue: 180,
    reward: {
      type: 'cash',
      value: 5000,
      description: '₹5,000 retention bonus',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: false,
    status: 'active',
    createdAt: '2024-01-01',
    createdBy: 'Business Owner',
  },

  // Active Store Offers
  {
    id: 'OFF-007',
    name: 'Store Performance Bonus',
    description: 'Complete 200 orders in Q1 2024',
    offerFor: 'store',
    offerOn: 'total_orders',
    targetValue: 200,
    reward: {
      type: 'cash',
      value: 15000,
      description: '₹15,000 quarterly bonus',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    initialCount: true,
    status: 'active',
    createdAt: '2023-12-28',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-008',
    name: 'Store Operational Excellence',
    description: 'Maintain operations for 365 days',
    offerFor: 'store',
    offerOn: 'days_since_joining',
    targetValue: 365,
    reward: {
      type: 'discount',
      value: 10,
      description: '10% discount on wholesale purchases for next quarter',
    },
    validity: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    initialCount: false,
    status: 'active',
    createdAt: '2023-12-15',
    createdBy: 'Business Owner',
  },

  // Disabled/Past Offers
  {
    id: 'OFF-009',
    name: 'Diwali Special - Partner',
    description: 'Festival special - 5000 matching RP',
    offerFor: 'partner',
    offerOn: 'matching_rp',
    targetValue: 5000,
    reward: {
      type: 'cash',
      value: 2500,
      description: '₹2,500 festival bonus',
    },
    validity: {
      startDate: '2023-10-01',
      endDate: '2023-11-30',
    },
    initialCount: true,
    status: 'expired',
    createdAt: '2023-09-25',
    createdBy: 'Business Owner',
  },
  {
    id: 'OFF-010',
    name: 'Black Friday Store Promo',
    description: 'Complete 100 orders during Black Friday week',
    offerFor: 'store',
    offerOn: 'total_orders',
    targetValue: 100,
    reward: {
      type: 'discount',
      value: 15,
      description: '15% discount on next month inventory',
    },
    validity: {
      startDate: '2023-11-20',
      endDate: '2023-11-26',
    },
    initialCount: true,
    status: 'expired',
    createdAt: '2023-11-10',
    createdBy: 'Business Owner',
  },
];

// Mock Offer Progress Data
export const mockOfferProgress: OfferProgress[] = [
  // Partner Progress - Amit Kumar (0502241234)
  {
    id: 'PROG-001',
    offerId: 'OFF-001',
    userId: '0502241234',
    userName: 'Amit Kumar',
    userType: 'partner',
    currentValue: 6500,
    targetValue: 10000,
    progress: 65,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 4500, // Had 4500 matching RP when offer started
  },
  {
    id: 'PROG-002',
    offerId: 'OFF-002',
    userId: '0502241234',
    userName: 'Amit Kumar',
    userType: 'partner',
    currentValue: 5,
    targetValue: 5,
    progress: 100,
    status: 'completed',
    startedAt: '2024-01-01',
    completedAt: '2024-01-25',
    baselineValue: 12, // Had 12 orders when offer started, but only counted new ones
  },
  {
    id: 'PROG-003',
    offerId: 'OFF-003',
    userId: '0502241234',
    userName: 'Amit Kumar',
    userType: 'partner',
    currentValue: 2,
    targetValue: 5,
    progress: 40,
    status: 'in_progress',
    startedAt: '2024-01-01',
  },
  {
    id: 'PROG-004',
    offerId: 'OFF-004',
    userId: '0502241234',
    userName: 'Amit Kumar',
    userType: 'partner',
    currentValue: 378,
    targetValue: 90,
    progress: 100,
    status: 'completed',
    startedAt: '2024-01-01',
    completedAt: '2024-02-10',
  },

  // Partner Progress - Deepak Singh
  {
    id: 'PROG-005',
    offerId: 'OFF-001',
    userId: '2002241456',
    userName: 'Deepak Singh',
    userType: 'partner',
    currentValue: 3200,
    targetValue: 10000,
    progress: 32,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 1800,
  },
  {
    id: 'PROG-006',
    offerId: 'OFF-002',
    userId: '2002241456',
    userName: 'Deepak Singh',
    userType: 'partner',
    currentValue: 3,
    targetValue: 5,
    progress: 60,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 8,
  },

  // Partner Progress - Sunita Patel
  {
    id: 'PROG-007',
    offerId: 'OFF-001',
    userId: '2202241789',
    userName: 'Sunita Patel',
    userType: 'partner',
    currentValue: 8900,
    targetValue: 10000,
    progress: 89,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 3500,
  },
  {
    id: 'PROG-008',
    offerId: 'OFF-003',
    userId: '2202241789',
    userName: 'Sunita Patel',
    userType: 'partner',
    currentValue: 4,
    targetValue: 5,
    progress: 80,
    status: 'in_progress',
    startedAt: '2024-01-01',
  },

  // Employee Progress
  {
    id: 'PROG-009',
    offerId: 'OFF-005',
    userId: 'EMP-001',
    userName: 'Rajesh Kumar',
    userType: 'employee',
    currentValue: 42,
    targetValue: 50,
    progress: 84,
    status: 'in_progress',
    startedAt: '2024-02-01',
    baselineValue: 120,
  },
  {
    id: 'PROG-010',
    offerId: 'OFF-005',
    userId: 'EMP-002',
    userName: 'Priya Sharma',
    userType: 'employee',
    currentValue: 51,
    targetValue: 50,
    progress: 100,
    status: 'completed',
    startedAt: '2024-02-01',
    completedAt: '2024-02-15',
    baselineValue: 95,
  },
  {
    id: 'PROG-011',
    offerId: 'OFF-006',
    userId: 'EMP-001',
    userName: 'Rajesh Kumar',
    userType: 'employee',
    currentValue: 145,
    targetValue: 180,
    progress: 81,
    status: 'in_progress',
    startedAt: '2024-01-01',
  },

  // Store Progress
  {
    id: 'PROG-012',
    offerId: 'OFF-007',
    userId: 'S001',
    userName: 'Sthiroot Health Store - Delhi',
    userType: 'store',
    currentValue: 156,
    targetValue: 200,
    progress: 78,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 450,
  },
  {
    id: 'PROG-013',
    offerId: 'OFF-007',
    userId: 'S002',
    userName: 'Sthiroot Health Store - Mumbai',
    userType: 'store',
    currentValue: 189,
    targetValue: 200,
    progress: 95,
    status: 'in_progress',
    startedAt: '2024-01-01',
    baselineValue: 380,
  },
  {
    id: 'PROG-014',
    offerId: 'OFF-007',
    userId: 'S003',
    userName: 'Sthiroot Health Store - Bangalore',
    userType: 'store',
    currentValue: 203,
    targetValue: 200,
    progress: 100,
    status: 'completed',
    startedAt: '2024-01-01',
    completedAt: '2024-02-08',
    baselineValue: 290,
  },
  {
    id: 'PROG-015',
    offerId: 'OFF-008',
    userId: 'S001',
    userName: 'Sthiroot Health Store - Delhi',
    userType: 'store',
    currentValue: 412,
    targetValue: 365,
    progress: 100,
    status: 'completed',
    startedAt: '2024-01-01',
    completedAt: '2024-01-18',
  },

  // Past Offer Progress
  {
    id: 'PROG-016',
    offerId: 'OFF-009',
    userId: '0502241234',
    userName: 'Amit Kumar',
    userType: 'partner',
    currentValue: 5200,
    targetValue: 5000,
    progress: 100,
    status: 'completed',
    startedAt: '2023-10-01',
    completedAt: '2023-11-15',
    baselineValue: 2000,
  },
  {
    id: 'PROG-017',
    offerId: 'OFF-010',
    userId: 'S002',
    userName: 'Sthiroot Health Store - Mumbai',
    userType: 'store',
    currentValue: 87,
    targetValue: 100,
    progress: 87,
    status: 'expired',
    startedAt: '2023-11-20',
    baselineValue: 1250,
  },
];

// Helper functions for offer management
export function getActiveOffers(offerFor?: OfferFor): Offer[] {
  const now = new Date();
  return mockOffers.filter(offer => {
    const isActive = offer.status === 'active';
    const isValid = new Date(offer.validity.endDate) >= now;
    const matchesType = !offerFor || offer.offerFor === offerFor;
    return isActive && isValid && matchesType;
  });
}

export function getExpiredOffers(offerFor?: OfferFor): Offer[] {
  const now = new Date();
  return mockOffers.filter(offer => {
    const isExpired = offer.status === 'expired' || new Date(offer.validity.endDate) < now;
    const matchesType = !offerFor || offer.offerFor === offerFor;
    return isExpired && matchesType;
  });
}

export function getOfferProgress(offerId: string): OfferProgress[] {
  return mockOfferProgress.filter(progress => progress.offerId === offerId);
}

export function getUserOfferProgress(userId: string): OfferProgress[] {
  return mockOfferProgress.filter(progress => progress.userId === userId);
}

export function getOfferById(offerId: string): Offer | undefined {
  return mockOffers.find(offer => offer.id === offerId);
}

export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}