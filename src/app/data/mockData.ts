// Mock data for Sthiroot Business Management System

export const mockStores = [
  { id: 'S001', name: 'Sthiroot Weight Loss - Delhi', domain: 'Weight Loss', status: 'Active', revenue: 245000, orders: 156 },
  { id: 'S002', name: 'Sthiroot Skin Care - Mumbai', domain: 'Skin Care', status: 'Active', revenue: 189000, orders: 132 },
  { id: 'S003', name: 'Sthiroot Sexual Care - Bangalore', domain: 'Sexual Care', status: 'Active', revenue: 167000, orders: 98 },
  { id: 'S004', name: 'Sthiroot Sleep Health - Chennai', domain: 'Sleep Health', status: 'Inactive', revenue: 89000, orders: 67 },
];

export const mockOrders = [
  { id: 'ORD-2026-001', customer: 'Rahul Sharma', store: 'S001', amount: 4500, status: 'Completed', date: '2026-01-10' },
  { id: 'ORD-2026-002', customer: 'Priya Patel', store: 'S002', amount: 3200, status: 'Processing', date: '2026-01-11' },
  { id: 'ORD-2026-003', customer: 'Amit Kumar', store: 'S001', amount: 6700, status: 'Completed', date: '2026-01-12' },
  { id: 'ORD-2026-004', customer: 'Sneha Reddy', store: 'S003', amount: 5400, status: 'Pending', date: '2026-01-12' },
];

export const mockPartners = [
  { id: 'P001', name: 'Rajesh Verma', sponsorId: 'ROOT', placementId: 'ROOT', rpPoints: 12500, monthlyRP: 3200, wallet: 45000, downlineCount: 24 },
  { id: 'P002', name: 'Kavita Singh', sponsorId: 'P001', placementId: 'P001-L', rpPoints: 8900, monthlyRP: 2100, wallet: 28000, downlineCount: 12 },
  { id: 'P003', name: 'Suresh Patel', sponsorId: 'P001', placementId: 'P001-R', rpPoints: 6700, monthlyRP: 1800, wallet: 21000, downlineCount: 8 },
];

export const mockEmployees = [
  { id: 'E001', name: 'Anjali Gupta', role: 'Accountant', store: 'S001', senior: null, level: 5, totalSales: 125000 },
  { id: 'E002', name: 'Vikram Mehta', role: 'Manager', store: 'S002', senior: null, level: 7, totalSales: 210000 },
  { id: 'E003', name: 'Pooja Iyer', role: 'Customer Care', store: 'S001', senior: 'E001', level: 3, totalSales: 67000 },
];

export const mockProducts = [
  { id: 'PRD-001', code: 'WL-100', name: 'Weight Loss Premium Pack', category: 'Weight Loss', mrp: 5000, cost: 1500, pc: 3250, dp: 3650, rp: 2050, stock: 145 },
  { id: 'PRD-002', code: 'SC-200', name: 'Skin Care Essentials', category: 'Skin Care', mrp: 3500, cost: 1050, pc: 2275, dp: 2555, rp: 1435, stock: 89 },
  { id: 'PRD-003', code: 'SXC-300', name: 'Sexual Care Complete', category: 'Sexual Care', mrp: 4200, cost: 1260, pc: 2730, dp: 3066, rp: 1722, stock: 56 },
];

export const mockTransactions = [
  { id: 'TXN-001', type: 'Sale', partner: 'P001', amount: 4500, date: '2026-01-10', status: 'Completed' },
  { id: 'TXN-002', type: 'Commission', partner: 'P002', amount: 1200, date: '2026-01-11', status: 'Completed' },
  { id: 'TXN-003', type: 'Withdrawal', partner: 'P001', amount: 5000, date: '2026-01-12', status: 'Pending' },
];

export const mockCustomers = [
  { id: 'C001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', orders: 12, totalSpent: 54000 },
  { id: 'C002', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', orders: 8, totalSpent: 32000 },
  { id: 'C003', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', orders: 15, totalSpent: 67000 },
];

// KPI Data for Owner Dashboard
export const mockKPIData = {
  totalRevenue: 2450000,
  revenueGrowth: 12.5,
  totalOrders: 1234,
  ordersGrowth: 8.3,
  totalCustomers: 5678,
  totalStores: 24,
  totalEmployees: 145,
  totalPartners: 892,
};

// Revenue trend data for charts
export const mockRevenueData = [
  { id: 1, month: 'Jul', revenue: 180000, orders: 890 },
  { id: 2, month: 'Aug', revenue: 195000, orders: 920 },
  { id: 3, month: 'Sep', revenue: 210000, orders: 1050 },
  { id: 4, month: 'Oct', revenue: 225000, orders: 1120 },
  { id: 5, month: 'Nov', revenue: 235000, orders: 1180 },
  { id: 6, month: 'Dec', revenue: 250000, orders: 1234 },
];

// Commission data
export const mockCommissions = [
  { id: 'COM-001', agent: 'Rajesh Verma', month: 'December 2025', rpPoints: 3200, commission: 12800, status: 'Pending' },
  { id: 'COM-002', agent: 'Kavita Singh', month: 'December 2025', rpPoints: 2100, commission: 8400, status: 'Pending' },
  { id: 'COM-003', agent: 'Suresh Patel', month: 'November 2025', rpPoints: 1800, commission: 7200, status: 'Finalized' },
];

// Partner Hierarchy Types and Data
export interface PartnerNode {
  id: string; // firstname_DAYMONTHYEAR_random3digits
  name: string;
  role: string; // Role/title like "Sales Executive", "Regional Manager", etc.
  type: 'store_owner' | 'partner' | 'employee';
  level: number; // Hierarchy level (L1, L2, L3, etc.)
  my_pid: string; // id_p (placement id)
  my_sid: string; // id_s (sponsor id)
  agent_pid: string | null; // Placement sponsor's ID
  agent_sid: string | null; // Sponsorship sponsor's ID
  selfRP: number;
  teamRPA: number; // Team rp from Leg A
  teamRPB: number; // Team rp from Leg B
  matchingRP: number; // min(teamRPA total selfRP, teamRPB total selfRP)
  totalRP: number; // selfRP + matchingRP
  legA: string | null; // ID of partner in Leg A
  legB: string | null; // ID of partner in Leg B
  legC: string | null; // ID of employee in Leg C (if store owner)
  legD: string | null; // ID of employee in Leg D (if store owner)
  parentId: string | null; // Parent's ID in hierarchy
  phone: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export interface RPHistoryRecord {
  partnerId: string;
  month: string; // e.g., "January 2026"
  year: number;
  selfRP: number;
  teamRPA: number;
  teamRPB: number;
  matchingRP: number;
  totalRP: number;
  payableAmount: number; // totalRP * RP_RATE
}

export const RP_RATE = 4; // 1 rp = 4 Rupees (configurable)

// Generate helper function for IDs
function generatePartnerId(firstName: string, day: number, month: number, year: number): string {
  const random3 = Math.floor(100 + Math.random() * 900);
  return `${firstName}_${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}_${random3}`;
}

// Mock Partner Hierarchy Data - Multiple Store Owners with their hierarchies
export const mockPartnerHierarchy: Record<string, PartnerNode> = {
  // ========== STORE OWNER 1: Rajesh Verma ==========
  'rajesh_15012024_456': {
    id: 'rajesh_15012024_456',
    name: 'Rajesh Verma',
    role: 'Store Owner - Delhi',
    type: 'store_owner',
    level: 1,
    my_pid: 'rajesh_15012024_456_p',
    my_sid: 'rajesh_15012024_456_s',
    agent_pid: null,
    agent_sid: null,
    selfRP: 2400,
    teamRPA: 8900,
    teamRPB: 7600,
    matchingRP: 7600,
    totalRP: 10000,
    legA: 'amit_05022024_234', // Partner Leg A
    legB: 'priya_08022024_567', // Partner Leg B
    legC: 'emp_anjali_10022024_111', // Employee Leg C
    legD: 'emp_vikram_12022024_222', // Employee Leg D
    parentId: null,
    phone: '+91 98765 43210',
    email: 'rajesh.verma@example.com',
    joinDate: '2024-01-15',
    status: 'Active',
  },
  
  // Partners under Rajesh (Leg A)
  'amit_05022024_234': {
    id: 'amit_05022024_234',
    name: 'Amit Kumar',
    role: 'Sales Executive',
    type: 'partner',
    level: 2,
    my_pid: 'amit_05022024_234_p',
    my_sid: 'amit_05022024_234_s',
    agent_pid: 'rajesh_15012024_456',
    agent_sid: 'rajesh_15012024_456',
    selfRP: 1800,
    teamRPA: 500,
    teamRPB: 500,
    matchingRP: 500,
    totalRP: 2300,
    legA: 'deepak_20022024_111',
    legB: 'sunita_22022024_222',
    legC: null,
    legD: null,
    parentId: 'rajesh_15012024_456',
    phone: '+91 98765 43213',
    email: 'amit.kumar@example.com',
    joinDate: '2024-02-05',
    status: 'Active',
  },
  
  // Partners under Rajesh (Leg B)
  'priya_08022024_567': {
    id: 'priya_08022024_567',
    name: 'Priya Sharma',
    role: 'Sales Executive',
    type: 'partner',
    level: 2,
    my_pid: 'priya_08022024_567_p',
    my_sid: 'priya_08022024_567_s',
    agent_pid: 'rajesh_15012024_456',
    agent_sid: 'rajesh_15012024_456',
    selfRP: 1900,
    teamRPA: 500,
    teamRPB: 500,
    matchingRP: 500,
    totalRP: 2400,
    legA: 'rohit_25022024_333',
    legB: 'meena_28022024_444',
    legC: null,
    legD: null,
    parentId: 'rajesh_15012024_456',
    phone: '+91 98765 43214',
    email: 'priya.sharma@example.com',
    joinDate: '2024-02-08',
    status: 'Active',
  },
  
  // Employees under Rajesh (Leg C)
  'emp_anjali_10022024_111': {
    id: 'emp_anjali_10022024_111',
    name: 'Anjali Nair',
    role: 'Accountant',
    type: 'employee',
    level: 2,
    my_pid: 'emp_anjali_10022024_111_p',
    my_sid: 'emp_anjali_10022024_111_s',
    agent_pid: 'rajesh_15012024_456',
    agent_sid: 'rajesh_15012024_456',
    selfRP: 800,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 800,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'rajesh_15012024_456',
    phone: '+91 98765 43225',
    email: 'anjali.nair@example.com',
    joinDate: '2024-02-10',
    status: 'Active',
  },
  
  // Employees under Rajesh (Leg D)
  'emp_vikram_12022024_222': {
    id: 'emp_vikram_12022024_222',
    name: 'Vikram Mehta',
    role: 'Manager',
    type: 'employee',
    level: 2,
    my_pid: 'emp_vikram_12022024_222_p',
    my_sid: 'emp_vikram_12022024_222_s',
    agent_pid: 'rajesh_15012024_456',
    agent_sid: 'rajesh_15012024_456',
    selfRP: 700,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 700,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'rajesh_15012024_456',
    phone: '+91 98765 43226',
    email: 'vikram.mehta@example.com',
    joinDate: '2024-02-12',
    status: 'Active',
  },
  
  // Sub-partners under Amit (Level 3)
  'deepak_20022024_111': {
    id: 'deepak_20022024_111',
    name: 'Deepak Joshi',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'deepak_20022024_111_p',
    my_sid: 'deepak_20022024_111_s',
    agent_pid: 'amit_05022024_234',
    agent_sid: 'amit_05022024_234',
    selfRP: 500,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 500,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'amit_05022024_234',
    phone: '+91 98765 43217',
    email: 'deepak.joshi@example.com',
    joinDate: '2024-02-20',
    status: 'Active',
  },
  
  'sunita_22022024_222': {
    id: 'sunita_22022024_222',
    name: 'Sunita Rao',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'sunita_22022024_222_p',
    my_sid: 'sunita_22022024_222_s',
    agent_pid: 'amit_05022024_234',
    agent_sid: 'amit_05022024_234',
    selfRP: 500,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 500,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'amit_05022024_234',
    phone: '+91 98765 43218',
    email: 'sunita.rao@example.com',
    joinDate: '2024-02-22',
    status: 'Active',
  },
  
  // Sub-partners under Priya (Level 3)
  'rohit_25022024_333': {
    id: 'rohit_25022024_333',
    name: 'Rohit Malhotra',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'rohit_25022024_333_p',
    my_sid: 'rohit_25022024_333_s',
    agent_pid: 'priya_08022024_567',
    agent_sid: 'priya_08022024_567',
    selfRP: 500,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 500,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'priya_08022024_567',
    phone: '+91 98765 43219',
    email: 'rohit.malhotra@example.com',
    joinDate: '2024-02-25',
    status: 'Active',
  },
  
  'meena_28022024_444': {
    id: 'meena_28022024_444',
    name: 'Meena Kapoor',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'meena_28022024_444_p',
    my_sid: 'meena_28022024_444_s',
    agent_pid: 'priya_08022024_567',
    agent_sid: 'priya_08022024_567',
    selfRP: 500,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 500,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'priya_08022024_567',
    phone: '+91 98765 43220',
    email: 'meena.kapoor@example.com',
    joinDate: '2024-02-28',
    status: 'Active',
  },
  
  // ========== STORE OWNER 2: Kavita Singh ==========
  'kavita_20012024_123': {
    id: 'kavita_20012024_123',
    name: 'Kavita Singh',
    role: 'Store Owner - Mumbai',
    type: 'store_owner',
    level: 1,
    my_pid: 'kavita_20012024_123_p',
    my_sid: 'kavita_20012024_123_s',
    agent_pid: null,
    agent_sid: null,
    selfRP: 3200,
    teamRPA: 2800,
    teamRPB: 2900,
    matchingRP: 2800,
    totalRP: 6000,
    legA: 'neha_15022024_345', // Partner Leg A
    legB: 'ravi_18022024_678', // Partner Leg B
    legC: 'emp_sanjay_20032024_333', // Employee Leg C
    legD: 'emp_reena_22032024_444', // Employee Leg D
    parentId: null,
    phone: '+91 98765 43211',
    email: 'kavita.singh@example.com',
    joinDate: '2024-01-20',
    status: 'Active',
  },
  
  // Partners under Kavita (Leg A)
  'neha_15022024_345': {
    id: 'neha_15022024_345',
    name: 'Neha Desai',
    role: 'Sales Executive',
    type: 'partner',
    level: 2,
    my_pid: 'neha_15022024_345_p',
    my_sid: 'neha_15022024_345_s',
    agent_pid: 'kavita_20012024_123',
    agent_sid: 'kavita_20012024_123',
    selfRP: 2100,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 2100,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'kavita_20012024_123',
    phone: '+91 98765 43215',
    email: 'neha.desai@example.com',
    joinDate: '2024-02-15',
    status: 'Active',
  },
  
  // Partners under Kavita (Leg B)
  'ravi_18022024_678': {
    id: 'ravi_18022024_678',
    name: 'Ravi Reddy',
    role: 'Regional Manager',
    type: 'partner',
    level: 2,
    my_pid: 'ravi_18022024_678_p',
    my_sid: 'ravi_18022024_678_s',
    agent_pid: 'kavita_20012024_123',
    agent_sid: 'kavita_20012024_123',
    selfRP: 1500,
    teamRPA: 400,
    teamRPB: 400,
    matchingRP: 400,
    totalRP: 1900,
    legA: 'sanjay_10032024_777',
    legB: 'pooja_08032024_666',
    legC: null,
    legD: null,
    parentId: 'kavita_20012024_123',
    phone: '+91 98765 43216',
    email: 'ravi.reddy@example.com',
    joinDate: '2024-02-18',
    status: 'Active',
  },
  
  // Employees under Kavita (Leg C)
  'emp_sanjay_20032024_333': {
    id: 'emp_sanjay_20032024_333',
    name: 'Sanjay Gupta',
    role: 'Accountant',
    type: 'employee',
    level: 2,
    my_pid: 'emp_sanjay_20032024_333_p',
    my_sid: 'emp_sanjay_20032024_333_s',
    agent_pid: 'kavita_20012024_123',
    agent_sid: 'kavita_20012024_123',
    selfRP: 650,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 650,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'kavita_20012024_123',
    phone: '+91 98765 43227',
    email: 'sanjay.g@example.com',
    joinDate: '2024-03-20',
    status: 'Active',
  },
  
  // Employees under Kavita (Leg D)
  'emp_reena_22032024_444': {
    id: 'emp_reena_22032024_444',
    name: 'Reena Shah',
    role: 'Manager',
    type: 'employee',
    level: 2,
    my_pid: 'emp_reena_22032024_444_p',
    my_sid: 'emp_reena_22032024_444_s',
    agent_pid: 'kavita_20012024_123',
    agent_sid: 'kavita_20012024_123',
    selfRP: 600,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 600,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'kavita_20012024_123',
    phone: '+91 98765 43228',
    email: 'reena.shah@example.com',
    joinDate: '2024-03-22',
    status: 'Active',
  },
  
  // Sub-partners under Ravi (Level 3)
  'sanjay_10032024_777': {
    id: 'sanjay_10032024_777',
    name: 'Ganesh Pillai',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'sanjay_10032024_777_p',
    my_sid: 'sanjay_10032024_777_s',
    agent_pid: 'ravi_18022024_678',
    agent_sid: 'ravi_18022024_678',
    selfRP: 400,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 400,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'ravi_18022024_678',
    phone: '+91 98765 43221',
    email: 'ganesh.pillai@example.com',
    joinDate: '2024-03-10',
    status: 'Active',
  },
  
  'pooja_08032024_666': {
    id: 'pooja_08032024_666',
    name: 'Pooja Iyer',
    role: 'Sales Executive',
    type: 'partner',
    level: 3,
    my_pid: 'pooja_08032024_666_p',
    my_sid: 'pooja_08032024_666_s',
    agent_pid: 'ravi_18022024_678',
    agent_sid: 'ravi_18022024_678',
    selfRP: 400,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 400,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'ravi_18022024_678',
    phone: '+91 98765 43222',
    email: 'pooja.iyer@example.com',
    joinDate: '2024-03-08',
    status: 'Active',
  },
  
  // ========== STORE OWNER 3: Suresh Patel ==========
  'suresh_22012024_789': {
    id: 'suresh_22012024_789',
    name: 'Suresh Patel',
    role: 'Store Owner - Bangalore',
    type: 'store_owner',
    level: 1,
    my_pid: 'suresh_22012024_789_p',
    my_sid: 'suresh_22012024_789_s',
    agent_pid: null,
    agent_sid: null,
    selfRP: 2100,
    teamRPA: 1200,
    teamRPB: 1100,
    matchingRP: 1100,
    totalRP: 3200,
    legA: 'arjun_10042024_555', // Partner Leg A
    legB: 'lakshmi_12042024_666', // Partner Leg B
    legC: null, // No employees yet
    legD: null,
    parentId: null,
    phone: '+91 98765 43212',
    email: 'suresh.patel@example.com',
    joinDate: '2024-01-22',
    status: 'Active',
  },
  
  // Partners under Suresh (Leg A)
  'arjun_10042024_555': {
    id: 'arjun_10042024_555',
    name: 'Arjun Nair',
    role: 'Sales Executive',
    type: 'partner',
    level: 2,
    my_pid: 'arjun_10042024_555_p',
    my_sid: 'arjun_10042024_555_s',
    agent_pid: 'suresh_22012024_789',
    agent_sid: 'suresh_22012024_789',
    selfRP: 1200,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 1200,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'suresh_22012024_789',
    phone: '+91 98765 43229',
    email: 'arjun.nair@example.com',
    joinDate: '2024-04-10',
    status: 'Active',
  },
  
  // Partners under Suresh (Leg B)
  'lakshmi_12042024_666': {
    id: 'lakshmi_12042024_666',
    name: 'Lakshmi Rao',
    role: 'Sales Executive',
    type: 'partner',
    level: 2,
    my_pid: 'lakshmi_12042024_666_p',
    my_sid: 'lakshmi_12042024_666_s',
    agent_pid: 'suresh_22012024_789',
    agent_sid: 'suresh_22012024_789',
    selfRP: 1100,
    teamRPA: 0,
    teamRPB: 0,
    matchingRP: 0,
    totalRP: 1100,
    legA: null,
    legB: null,
    legC: null,
    legD: null,
    parentId: 'suresh_22012024_789',
    phone: '+91 98765 43230',
    email: 'lakshmi.rao@example.com',
    joinDate: '2024-04-12',
    status: 'Active',
  },
};

// Store Owner IDs for root-level display
export const STORE_OWNER_IDS = ['rajesh_15012024_456', 'kavita_20012024_123', 'suresh_22012024_789'];

// rp History Data (last 6 months)
export const mockRPHistory: RPHistoryRecord[] = [
  // Rajesh Verma history
  { partnerId: 'rajesh_15012024_456', month: 'January', year: 2026, selfRP: 2400, teamRPA: 8900, teamRPB: 7600, matchingRP: 7600, totalRP: 10000, payableAmount: 40000 },
  { partnerId: 'rajesh_15012024_456', month: 'December', year: 2025, selfRP: 2200, teamRPA: 8500, teamRPB: 7200, matchingRP: 7200, totalRP: 9400, payableAmount: 37600 },
  { partnerId: 'rajesh_15012024_456', month: 'November', year: 2025, selfRP: 2100, teamRPA: 8000, teamRPB: 6800, matchingRP: 6800, totalRP: 8900, payableAmount: 35600 },
  { partnerId: 'rajesh_15012024_456', month: 'October', year: 2025, selfRP: 2000, teamRPA: 7500, teamRPB: 6500, matchingRP: 6500, totalRP: 8500, payableAmount: 34000 },
  
  // Kavita Singh history
  { partnerId: 'kavita_20012024_123', month: 'January', year: 2026, selfRP: 3200, teamRPA: 2800, teamRPB: 2900, matchingRP: 2800, totalRP: 6000, payableAmount: 24000 },
  { partnerId: 'kavita_20012024_123', month: 'December', year: 2025, selfRP: 3000, teamRPA: 2600, teamRPB: 2700, matchingRP: 2600, totalRP: 5600, payableAmount: 22400 },
  { partnerId: 'kavita_20012024_123', month: 'November', year: 2025, selfRP: 2900, teamRPA: 2500, teamRPB: 2600, matchingRP: 2500, totalRP: 5400, payableAmount: 21600 },
  
  // Suresh Patel history
  { partnerId: 'suresh_22012024_789', month: 'January', year: 2026, selfRP: 2100, teamRPA: 3200, teamRPB: 2300, matchingRP: 2300, totalRP: 4400, payableAmount: 17600 },
  { partnerId: 'suresh_22012024_789', month: 'December', year: 2025, selfRP: 2000, teamRPA: 3000, teamRPB: 2200, matchingRP: 2200, totalRP: 4200, payableAmount: 16800 },
  { partnerId: 'suresh_22012024_789', month: 'November', year: 2025, selfRP: 1900, teamRPA: 2900, teamRPB: 2100, matchingRP: 2100, totalRP: 4000, payableAmount: 16000 },
  
  // Add more partners...
  { partnerId: 'amit_05022024_234', month: 'January', year: 2026, selfRP: 1800, teamRPA: 500, teamRPB: 500, matchingRP: 500, totalRP: 2300, payableAmount: 9200 },
  { partnerId: 'priya_08022024_567', month: 'January', year: 2026, selfRP: 1900, teamRPA: 500, teamRPB: 500, matchingRP: 500, totalRP: 2400, payableAmount: 9600 },
  { partnerId: 'neha_15022024_345', month: 'January', year: 2026, selfRP: 2100, teamRPA: 550, teamRPB: 550, matchingRP: 550, totalRP: 2650, payableAmount: 10600 },
  { partnerId: 'ravi_18022024_678', month: 'January', year: 2026, selfRP: 1500, teamRPA: 400, teamRPB: 400, matchingRP: 400, totalRP: 1900, payableAmount: 7600 },
];

export const ROOT_PARTNER_ID = 'rajesh_15012024_456';

// ========== PRODUCT CATALOG DATA ==========

// Physical Products with comprehensive fields
export const mockPhysicalProducts = [
  { 
    id: 'PRD-001', 
    code: 'WL-100', 
    name: 'Weight Loss Premium Pack', 
    category: 'Wellness', 
    subCategory: 'Weight Loss',
    brandName: 'Meera Ayurveda',
    type: 'Product',
    status: 'Active',
    launchDate: '2025-06-15',
    mrp: 5000, 
    cost: 1500, 
    pc: 3250, 
    dp: 3650, 
    rp: 2050, 
    stock: 145,
    lowStockAlert: 20,
    ingredientsCount: 83,
    shelfLife: 24,
    minOrderQuantity: 1,
    taxPercent: 18,
  },
  { 
    id: 'PRD-002', 
    code: 'SC-200', 
    name: 'Skin Care Essentials', 
    category: 'Personal Care', 
    subCategory: 'Skin Care',
    brandName: 'Meera Ayurveda',
    type: 'Product',
    status: 'Active',
    launchDate: '2025-07-20',
    mrp: 3500, 
    cost: 1050, 
    pc: 2275, 
    dp: 2555, 
    rp: 1435, 
    stock: 89,
    lowStockAlert: 15,
    ingredientsCount: 52,
    shelfLife: 18,
    minOrderQuantity: 1,
    taxPercent: 18,
  },
  { 
    id: 'PRD-003', 
    code: 'SXC-300', 
    name: 'Sexual Care Complete', 
    category: 'Personal Care', 
    subCategory: 'Sexual Care',
    brandName: 'Meera Ayurveda',
    type: 'Product',
    status: 'Active',
    launchDate: '2025-08-10',
    mrp: 4200, 
    cost: 1260, 
    pc: 2730, 
    dp: 3066, 
    rp: 1722, 
    stock: 56,
    lowStockAlert: 10,
    ingredientsCount: 67,
    shelfLife: 24,
    minOrderQuantity: 1,
    taxPercent: 18,
  },
  { 
    id: 'PRD-004', 
    code: 'DC-400', 
    name: 'Diabetes Care Kit', 
    category: 'Wellness', 
    subCategory: 'Diabetes',
    brandName: 'Meera Ayurveda',
    type: 'Product',
    status: 'Active',
    launchDate: '2025-09-05',
    mrp: 6500, 
    cost: 1950, 
    pc: 4225, 
    dp: 4745, 
    rp: 2665, 
    stock: 120,
    lowStockAlert: 25,
    ingredientsCount: 95,
    shelfLife: 24,
    minOrderQuantity: 1,
    taxPercent: 12,
  },
  { 
    id: 'PRD-005', 
    code: 'IB-500', 
    name: 'Immunity Booster Pack', 
    category: 'Wellness', 
    subCategory: 'Immunity',
    brandName: 'Meera Ayurveda',
    type: 'Product',
    status: 'Active',
    launchDate: '2025-10-12',
    mrp: 2800, 
    cost: 840, 
    pc: 1820, 
    dp: 2044, 
    rp: 1148, 
    stock: 200,
    lowStockAlert: 30,
    ingredientsCount: 45,
    shelfLife: 24,
    minOrderQuantity: 1,
    taxPercent: 18,
  },
];

// Digital Courses
export const mockDigitalCourses = [
  { 
    id: 'CRS-001', 
    courseName: 'Healthy Living Masterclass', 
    description: 'A comprehensive 8-week course covering nutrition, exercise, and mental wellness. Learn from certified health experts and transform your lifestyle.',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop',
    createdDate: '2025-11-01',
  },
  { 
    id: 'CRS-002', 
    courseName: 'Weight Management Course', 
    description: 'Evidence-based strategies for sustainable weight loss. Includes meal planning, workout routines, and behavior modification techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1280&h=720&fit=crop',
    createdDate: '2025-11-15',
  },
  { 
    id: 'CRS-003', 
    courseName: 'Stress Management Workshop', 
    description: 'Master proven techniques to manage stress, anxiety, and burnout. Includes meditation, breathing exercises, and time management.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1280&h=720&fit=crop',
    createdDate: '2025-12-01',
  },
  { 
    id: 'CRS-004', 
    courseName: 'Nutrition Fundamentals', 
    description: 'Understanding macros, micros, and meal planning for optimal health. Perfect for beginners and health enthusiasts.',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1280&h=720&fit=crop',
    createdDate: '2025-12-20',
  },
  { 
    id: 'CRS-005', 
    courseName: 'Ayurvedic Lifestyle Program', 
    description: 'Ancient wisdom for modern living. Learn about doshas, daily routines, and natural healing methods.',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1280&h=720&fit=crop',
    createdDate: '2026-01-10',
  },
];

// Events
export const mockEvents = [
  { 
    id: 'EVT-001', 
    eventName: 'Health & Wellness Summit 2026', 
    location: 'Mumbai Convention Center, Mumbai', 
    date: '2026-05-15',
    description: 'Annual flagship event featuring top health experts, interactive workshops, and product demonstrations.',
  },
  { 
    id: 'EVT-002', 
    eventName: 'Ayurveda Workshop', 
    location: 'India Habitat Centre, New Delhi', 
    date: '2026-06-20',
    description: 'Hands-on workshop on traditional Ayurvedic practices and herbal medicine preparation.',
  },
  { 
    id: 'EVT-003', 
    eventName: 'Fitness Bootcamp', 
    location: 'Cubbon Park, Bangalore', 
    date: '2026-07-10',
    description: '3-day intensive fitness bootcamp with certified trainers, nutrition counseling, and wellness activities.',
  },
  { 
    id: 'EVT-004', 
    eventName: 'Diabetes Care Seminar', 
    location: 'Apollo Hospitals, Chennai', 
    date: '2026-08-05',
    description: 'Expert-led seminar on diabetes prevention, management, and lifestyle modifications.',
  },
];

// Programs (Product Combos)
export const mockPrograms = [
  { 
    id: 'PGM-001', 
    programName: 'Complete Wellness Package', 
    description: 'All-inclusive wellness program with products, courses, and event access',
    selectedProducts: ['PRD-001', 'PRD-004', 'PRD-005'], // 3 products
    selectedCourses: ['CRS-001', 'CRS-004'], // 2 courses
    selectedEvents: ['EVT-001'], // 1 event
    itemsCount: 6,
    combinedValue: 22000,
    programPrice: 18999,
    status: 'Active',
    createdDate: '2026-01-05',
  },
  { 
    id: 'PGM-002', 
    programName: 'Weight Loss Mastery', 
    description: 'Focused program for effective and sustainable weight management',
    selectedProducts: ['PRD-001'], // 1 product
    selectedCourses: ['CRS-002', 'CRS-004'], // 2 courses
    selectedEvents: ['EVT-003'], // 1 event
    itemsCount: 4,
    combinedValue: 12000,
    programPrice: 9999,
    status: 'Active',
    createdDate: '2026-01-10',
  },
  { 
    id: 'PGM-003', 
    programName: 'Diabetes Control Program', 
    description: 'Comprehensive diabetes care package with products and education',
    selectedProducts: ['PRD-004'], // 1 product
    selectedCourses: ['CRS-001', 'CRS-004'], // 2 courses
    selectedEvents: ['EVT-004'], // 1 event
    itemsCount: 4,
    combinedValue: 14500,
    programPrice: 11999,
    status: 'Active',
    createdDate: '2026-01-15',
  },
];