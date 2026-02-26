export interface Product {
  id: string;
  name: string;
  sku: string;
  type: 'Physical' | 'Digital Course' | 'Event' | 'Program';
  price: number;
  dp: number; // Distributor Price (73% of price)
  pp: number; // Pickup Price (73% of price, same as DP)
  rp: number; // Reward Points
  stock: number; // Global stock (for compatibility)
  storeStock?: { [storeId: string]: number }; // Store-specific stock
  category: string;
  image?: string;
  description?: string;
  programProducts?: string[]; // For Program type - array of product IDs
}

export interface Program {
  id: string;
  name: string;
  description: string;
  discount: number;
  isActive: boolean;
}

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Omega-3 Fish Oil Capsules',
    sku: 'OMEGA-001',
    type: 'Physical',
    price: 1299,
    dp: 1100,
    pp: 1100,
    rp: 150,
    stock: 150,
    storeStock: { 'S001': 50, 'S002': 60, 'S003': 40 },
    category: 'Supplements',
    description: '60 capsules - Premium quality fish oil'
  },
  {
    id: 'prod_002',
    name: 'Multivitamin Complex',
    sku: 'MULTI-002',
    type: 'Physical',
    price: 899,
    dp: 750,
    pp: 750,
    rp: 100,
    stock: 200,
    storeStock: { 'S001': 80, 'S002': 70, 'S003': 50 },
    category: 'Supplements',
    description: '30 tablets - Daily essentials'
  },
  {
    id: 'prod_003',
    name: 'Protein Powder - Chocolate',
    sku: 'PROT-003',
    type: 'Physical',
    price: 2499,
    dp: 2100,
    pp: 2100,
    rp: 200,
    stock: 80,
    storeStock: { 'S001': 30, 'S002': 35, 'S003': 15 },
    category: 'Nutrition',
    description: '1kg - Whey protein isolate'
  },
  {
    id: 'prod_004',
    name: 'Green Tea Extract',
    sku: 'GTEA-004',
    type: 'Physical',
    price: 599,
    dp: 500,
    pp: 500,
    rp: 75,
    stock: 120,
    storeStock: { 'S001': 45, 'S002': 50, 'S003': 25 },
    category: 'Supplements',
    description: '60 capsules - Natural antioxidants'
  },
  {
    id: 'prod_005',
    name: 'Vitamin D3 Tablets',
    sku: 'VITD-005',
    type: 'Physical',
    price: 449,
    dp: 380,
    pp: 380,
    rp: 50,
    stock: 250,
    storeStock: { 'S001': 100, 'S002': 90, 'S003': 60 },
    category: 'Vitamins',
    description: '30 tablets - 2000 IU'
  },
  {
    id: 'prod_006',
    name: 'Ashwagandha Capsules',
    sku: 'ASHW-006',
    type: 'Physical',
    price: 799,
    dp: 670,
    pp: 670,
    rp: 90,
    stock: 100,
    storeStock: { 'S001': 40, 'S002': 35, 'S003': 25 },
    category: 'Ayurvedic',
    description: '60 capsules - Stress relief'
  },
  {
    id: 'prod_007',
    name: 'Calcium + Magnesium',
    sku: 'CALC-007',
    type: 'Physical',
    price: 699,
    dp: 590,
    pp: 590,
    rp: 80,
    stock: 180,
    storeStock: { 'S001': 70, 'S002': 65, 'S003': 45 },
    category: 'Minerals',
    description: '90 tablets - Bone health'
  },
  {
    id: 'prod_008',
    name: 'Turmeric Curcumin',
    sku: 'TURC-008',
    type: 'Physical',
    price: 849,
    dp: 720,
    pp: 720,
    rp: 95,
    stock: 90,
    storeStock: { 'S001': 35, 'S002': 30, 'S003': 25 },
    category: 'Ayurvedic',
    description: '60 capsules - Anti-inflammatory'
  },
  {
    id: 'prod_009',
    name: 'Apple Cider Vinegar',
    sku: 'ACDV-009',
    type: 'Physical',
    price: 549,
    dp: 460,
    pp: 460,
    rp: 65,
    stock: 75,
    storeStock: { 'S001': 30, 'S002': 25, 'S003': 20 },
    category: 'Wellness',
    description: '500ml - Organic'
  },
  {
    id: 'prod_010',
    name: 'Collagen Peptides',
    sku: 'COLL-010',
    type: 'Physical',
    price: 1899,
    dp: 1600,
    pp: 1600,
    rp: 180,
    stock: 60,
    storeStock: { 'S001': 25, 'S002': 20, 'S003': 15 },
    category: 'Beauty',
    description: '300g - Skin & hair health'
  },
  {
    id: 'prod_011',
    name: 'Pre-Workout Energy Drink',
    sku: 'PWO-011',
    type: 'Physical',
    price: 1599,
    dp: 1350,
    pp: 1350,
    rp: 160,
    stock: 70,
    storeStock: { 'S001': 30, 'S002': 25, 'S003': 15 },
    category: 'Nutrition',
    description: '500g - Cherry flavor'
  },
  {
    id: 'prod_012',
    name: 'Joint Support Formula',
    sku: 'JONT-012',
    type: 'Physical',
    price: 1299,
    dp: 1100,
    pp: 1100,
    rp: 130,
    stock: 85,
    storeStock: { 'S001': 35, 'S002': 30, 'S003': 20 },
    category: 'Supplements',
    description: '60 capsules - Glucosamine + MSM'
  },
  {
    id: 'prod_013',
    name: 'Probiotic Complex',
    sku: 'PROB-013',
    type: 'Physical',
    price: 899,
    dp: 750,
    pp: 750,
    rp: 90,
    stock: 140,
    storeStock: { 'S001': 55, 'S002': 50, 'S003': 35 },
    category: 'Supplements',
    description: '30 capsules - Gut health'
  },
  {
    id: 'prod_014',
    name: 'Biotin Hair Gummies',
    sku: 'BIOT-014',
    type: 'Physical',
    price: 699,
    dp: 590,
    pp: 590,
    rp: 70,
    stock: 110,
    storeStock: { 'S001': 45, 'S002': 40, 'S003': 25 },
    category: 'Beauty',
    description: '60 gummies - Hair growth'
  },
  {
    id: 'prod_015',
    name: 'Spirulina Tablets',
    sku: 'SPIR-015',
    type: 'Physical',
    price: 799,
    dp: 670,
    pp: 670,
    rp: 80,
    stock: 95,
    storeStock: { 'S001': 40, 'S002': 35, 'S003': 20 },
    category: 'Superfoods',
    description: '120 tablets - Organic'
  },
  {
    id: 'prod_016',
    name: 'Melatonin Sleep Support',
    sku: 'MELA-016',
    type: 'Physical',
    price: 549,
    dp: 460,
    pp: 460,
    rp: 55,
    stock: 130,
    storeStock: { 'S001': 50, 'S002': 45, 'S003': 35 },
    category: 'Wellness',
    description: '60 tablets - 5mg'
  },
  {
    id: 'prod_017',
    name: 'Creatine Monohydrate',
    sku: 'CREA-017',
    type: 'Physical',
    price: 999,
    dp: 840,
    pp: 840,
    rp: 100,
    stock: 75,
    storeStock: { 'S001': 30, 'S002': 28, 'S003': 17 },
    category: 'Nutrition',
    description: '250g - Unflavored'
  },
  {
    id: 'prod_018',
    name: 'Aloe Vera Juice',
    sku: 'ALOE-018',
    type: 'Physical',
    price: 399,
    dp: 340,
    pp: 340,
    rp: 40,
    stock: 160,
    storeStock: { 'S001': 65, 'S002': 55, 'S003': 40 },
    category: 'Wellness',
    description: '1L - Pure aloe vera'
  },
  {
    id: 'prod_019',
    name: 'BCAA Powder',
    sku: 'BCAA-019',
    type: 'Physical',
    price: 1799,
    dp: 1520,
    pp: 1520,
    rp: 180,
    stock: 65,
    storeStock: { 'S001': 28, 'S002': 22, 'S003': 15 },
    category: 'Nutrition',
    description: '300g - Watermelon flavor'
  },
  {
    id: 'prod_020',
    name: 'Ginkgo Biloba Extract',
    sku: 'GINK-020',
    type: 'Physical',
    price: 649,
    dp: 550,
    pp: 550,
    rp: 65,
    stock: 100,
    storeStock: { 'S001': 40, 'S002': 35, 'S003': 25 },
    category: 'Supplements',
    description: '60 capsules - Brain health'
  },
];

export const mockPrograms: Program[] = [
  {
    id: 'prog_001',
    name: 'Standard Program',
    description: 'Regular pricing with standard benefits',
    discount: 0,
    isActive: true,
  },
  {
    id: 'prog_002',
    name: 'Silver Program',
    description: '5% discount on all products',
    discount: 5,
    isActive: true,
  },
  {
    id: 'prog_003',
    name: 'Gold Program',
    description: '10% discount on all products',
    discount: 10,
    isActive: true,
  },
  {
    id: 'prog_004',
    name: 'Platinum Program',
    description: '15% discount on all products',
    discount: 15,
    isActive: true,
  },
  {
    id: 'prog_005',
    name: 'Corporate Wellness',
    description: '20% discount for corporate bulk orders',
    discount: 20,
    isActive: true,
  },
];

export const mockDigitalCourses: Product[] = [
  {
    id: 'course_001',
    name: 'Nutrition Mastery Course',
    sku: 'CRS-NUT-001',
    type: 'Digital Course',
    price: 4999,
    dp: 3649, // 73% of price
    pp: 3649, // 73% of price
    rp: 2049, // 41% of price
    stock: 999, // Digital products have unlimited stock
    category: 'Digital Course',
    description: '12-week comprehensive nutrition certification program'
  },
  {
    id: 'course_002',
    name: 'Ayurveda Wellness Training',
    sku: 'CRS-AYU-002',
    type: 'Digital Course',
    price: 3499,
    dp: 2554,
    pp: 2554,
    rp: 1434,
    stock: 999,
    category: 'Digital Course',
    description: '8-week Ayurveda fundamentals and practice'
  },
  {
    id: 'course_003',
    name: 'Weight Loss Coaching Certificate',
    sku: 'CRS-WL-003',
    type: 'Digital Course',
    price: 5999,
    dp: 4379,
    pp: 4379,
    rp: 2459,
    stock: 999,
    category: 'Digital Course',
    description: 'Professional weight loss coaching certification'
  },
];

export const mockEvents: Product[] = [
  {
    id: 'event_001',
    name: 'Health & Wellness Summit 2026',
    sku: 'EVT-HWS-001',
    type: 'Event',
    price: 2999,
    dp: 2189,
    pp: 2189,
    rp: 1229,
    stock: 100, // Limited seats
    category: 'Event',
    description: '2-day summit with industry experts - Mumbai'
  },
  {
    id: 'event_002',
    name: 'Nutrition Workshop - Delhi',
    sku: 'EVT-NUT-002',
    type: 'Event',
    price: 1499,
    dp: 1094,
    pp: 1094,
    rp: 614,
    stock: 50,
    category: 'Event',
    description: 'Full-day hands-on nutrition workshop'
  },
  {
    id: 'event_003',
    name: 'Yoga & Ayurveda Retreat',
    sku: 'EVT-YAR-003',
    type: 'Event',
    price: 8999,
    dp: 6569,
    pp: 6569,
    rp: 3689,
    stock: 30,
    category: 'Event',
    description: '3-day wellness retreat in Rishikesh'
  },
];

export const mockProgramsCombos: Product[] = [
  {
    id: 'combo_001',
    name: 'Weight Loss Starter Pack',
    sku: 'CMB-WLS-001',
    type: 'Program',
    price: 4999,
    dp: 3649,
    pp: 3649,
    rp: 2049,
    stock: 50,
    storeStock: { 'S001': 30, 'S002': 20, 'S003': 15 },
    category: 'Program',
    description: 'Complete starter package for weight loss journey',
    programProducts: ['prod_001', 'prod_004', 'prod_009']
  },
  {
    id: 'combo_002',
    name: 'Complete Wellness Bundle',
    sku: 'CMB-CWB-002',
    type: 'Program',
    price: 7999,
    dp: 5839,
    pp: 5839,
    rp: 3279,
    stock: 40,
    storeStock: { 'S001': 25, 'S002': 15, 'S003': 10 },
    category: 'Program',
    description: 'Ultimate wellness package with premium supplements',
    programProducts: ['prod_001', 'prod_002', 'prod_003', 'prod_006', 'prod_010']
  },
  {
    id: 'combo_003',
    name: 'Immunity Booster Combo',
    sku: 'CMB-IMB-003',
    type: 'Program',
    price: 2999,
    dp: 2189,
    pp: 2189,
    rp: 1229,
    stock: 60,
    storeStock: { 'S001': 35, 'S002': 25, 'S003': 20 },
    category: 'Program',
    description: 'Essential supplements for strong immunity',
    programProducts: ['prod_002', 'prod_004', 'prod_005', 'prod_008']
  },
];