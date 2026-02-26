export interface PaymentMethod {
  id: string;
  type: 'upi' | 'qr' | 'bank';
  name: string; // Display name for the payment method
  isActive: boolean;
  createdAt: string;
  details: {
    upiId?: string;
    qrImage?: string;
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
  };
}

// Mock payment methods data
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-001',
    type: 'upi',
    name: 'Sthiroot Official UPI',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    details: {
      upiId: 'sthiroot@paytm'
    }
  },
  {
    id: 'pm-002',
    type: 'qr',
    name: 'Main QR Code',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    details: {
      qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=sthiroot@paytm%26pn=Sthiroot'
    }
  },
  {
    id: 'pm-003',
    type: 'bank',
    name: 'HDFC Business Account',
    isActive: true,
    createdAt: '2024-01-15T11:00:00Z',
    details: {
      accountName: 'STHIROOT HEALTH PRODUCTS PVT LTD',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Mumbai Main Branch'
    }
  },
  {
    id: 'pm-004',
    type: 'bank',
    name: 'ICICI Backup Account',
    isActive: false,
    createdAt: '2024-02-01T09:00:00Z',
    details: {
      accountName: 'STHIROOT HEALTH PRODUCTS PVT LTD',
      accountNumber: '001234567890',
      ifscCode: 'ICIC0001234',
      bankName: 'ICICI Bank',
      branch: 'Andheri West'
    }
  }
];

// Helper functions
export function getActivePaymentMethods(): PaymentMethod[] {
  return mockPaymentMethods.filter(pm => pm.isActive);
}

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return mockPaymentMethods.find(pm => pm.id === id);
}

export function getPaymentMethodsByType(type: 'upi' | 'qr' | 'bank'): PaymentMethod[] {
  return mockPaymentMethods.filter(pm => pm.type === type);
}
