import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'owner' | 'store-owner' | 'store-admin' | 'accountant' | 'employee' | 'manager' | 'courier-manager' | 'stock-manager' | 'customer-care' | 'dietitian' | 'agent' | 'partner' | 'kyc-reviewer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - in production, this would call an API
    // For demo, map emails to roles
    const roleMap: Record<string, { role: UserRole; name: string }> = {
      'owner@sthiroot.com': { role: 'owner', name: 'Business Owner' },
      'store@sthiroot.com': { role: 'store-owner', name: 'Store Owner' },
      'mumbai@sthiroot.com': { role: 'store-owner', name: 'Mumbai Main Store' },
      'delhi@sthiroot.com': { role: 'store-owner', name: 'Delhi Branch' },
      'admin@sthiroot.com': { role: 'store-admin', name: 'Store Admin' },
      'accountant@sthiroot.com': { role: 'accountant', name: 'Accountant Admin' },
      'employee@sthiroot.com': { role: 'employee', name: 'Employee' },
      'amit@sthiroot.com': { role: 'employee', name: 'Amit Patel' },
      'sneha@sthiroot.com': { role: 'employee', name: 'Sneha Reddy' },
      'partner@sthiroot.com': { role: 'partner', name: 'Partner' },
      'rajesh@sthiroot.com': { role: 'partner', name: 'Rajesh Kumar' },
      'priya@sthiroot.com': { role: 'partner', name: 'Priya Sharma' },
      'agent@sthiroot.com': { role: 'agent', name: 'Agent' },
      'kyc@sthiroot.com': { role: 'kyc-reviewer', name: 'KYC Reviewer' },
    };

    const userInfo = roleMap[email];
    
    if (!userInfo) {
      alert('Invalid credentials');
      return;
    }
    
    setUser({
      id: '1',
      name: userInfo.name,
      email,
      role: userInfo.role,
      storeId: userInfo.role !== 'owner' ? 'S001' : undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}