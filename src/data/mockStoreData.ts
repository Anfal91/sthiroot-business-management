import { PaymentMethod } from './mockPaymentMethods';

export interface Store {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: 'Active' | 'Inactive';
  serviceCharge: number; // Fixed service charge per order
  deliveryCharge: number; // Fixed delivery charge per order
  paymentMethods: PaymentMethod[];
}

export const mockStoresWithCharges: Store[] = [
  {
    id: 'MAIN_OFFICE',
    name: 'Main Office',
    location: 'Head Office, Ahmedabad',
    phone: '+91 98765 00000',
    status: 'Active',
    serviceCharge: 0,
    deliveryCharge: 0,
    paymentMethods: [
      {
        id: 'PM-MAIN-001',
        type: 'upi',
        details: {
          upiId: 'sthiroot.main@paytm',
        },
      },
      {
        id: 'PM-MAIN-002',
        type: 'bank',
        details: {
          accountName: 'Sthiroot Main Office',
          accountNumber: '0000111122',
          ifscCode: 'HDFC0000001',
          bankName: 'HDFC Bank',
          branch: 'Ahmedabad, Gujarat',
        },
      },
    ],
  },
  {
    id: 'S001',
    name: 'Sthiroot Health Store - Delhi',
    location: 'Delhi',
    phone: '+91 98765 11001',
    status: 'Active',
    serviceCharge: 50,
    deliveryCharge: 100,
    paymentMethods: [
      {
        id: 'PM-001',
        type: 'upi',
        details: {
          upiId: 'sthiroot.delhi@paytm',
        },
      },
      {
        id: 'PM-002',
        type: 'bank',
        details: {
          accountName: 'Sthiroot Health Store Delhi',
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          branch: 'Green Park, New Delhi',
        },
      },
    ],
  },
  {
    id: 'S002',
    name: 'Sthiroot Health Store - Mumbai',
    location: 'Mumbai',
    phone: '+91 98765 22002',
    status: 'Active',
    serviceCharge: 60,
    deliveryCharge: 120,
    paymentMethods: [
      {
        id: 'PM-003',
        type: 'upi',
        details: {
          upiId: 'sthiroot.mumbai@paytm',
        },
      },
      {
        id: 'PM-004',
        type: 'qr',
        details: {
          qrImage: 'https://via.placeholder.com/200x200?text=QR+Code',
        },
      },
      {
        id: 'PM-005',
        type: 'bank',
        details: {
          accountName: 'Sthiroot Health Store Mumbai',
          accountNumber: '9876543210',
          ifscCode: 'ICIC0001234',
          bankName: 'ICICI Bank',
          branch: 'Andheri, Mumbai',
        },
      },
    ],
  },
  {
    id: 'S003',
    name: 'Sthiroot Health Store - Bangalore',
    location: 'Bangalore',
    phone: '+91 98765 33003',
    status: 'Active',
    serviceCharge: 55,
    deliveryCharge: 110,
    paymentMethods: [
      {
        id: 'PM-006',
        type: 'upi',
        details: {
          upiId: 'sthiroot.bangalore@paytm',
        },
      },
      {
        id: 'PM-007',
        type: 'bank',
        details: {
          accountName: 'Sthiroot Health Store Bangalore',
          accountNumber: '5555666677',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          branch: 'Koramangala, Bangalore',
        },
      },
    ],
  },
  {
    id: 'S004',
    name: 'Sthiroot Health Store - Chennai',
    location: 'Chennai',
    phone: '+91 98765 44004',
    status: 'Inactive',
    serviceCharge: 50,
    deliveryCharge: 100,
    paymentMethods: [
      {
        id: 'PM-008',
        type: 'upi',
        details: {
          upiId: 'sthiroot.chennai@paytm',
        },
      },
    ],
  },
];