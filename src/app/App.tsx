import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

// Auth components
import { Login } from './components/auth/Login';
import { ForgotPassword } from './components/auth/ForgotPassword';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Owner components
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { Stores } from './components/owner/Stores';
import { Products } from './components/owner/Products';
import { PartnerHierarchy } from './components/owner/PartnerHierarchy';
import { Commissions } from './components/owner/Commissions';
import { Accounting } from './components/owner/Accounting';
import { Offers } from './components/owner/Offers';
import { PaymentMethods } from './components/owner/PaymentMethods';
import { KYCVerification } from './components/owner/KYCVerification';

// Shared components used by Owner
import { StoreOrders as Orders } from './components/store/StoreOrders';
import { StoreCustomers as Customers } from './components/store/StoreCustomers';
import { StoreStock as Stock } from './components/store/StoreStock';
import { StoreEmployees as Employees } from './components/store/StoreEmployees';
import { StoreCreateOrder as Tokens } from './components/store/StoreCreateOrder';

// Store Owner components
import { StoreDashboard } from './components/store/StoreDashboard';
import { StoreOrders } from './components/store/StoreOrders';
import { StorePurchaseOrders } from './components/store/StorePurchaseOrders';
import { StoreCustomers } from './components/store/StoreCustomers';
import { StoreStock } from './components/store/StoreStock';
import { StoreEmployees } from './components/store/StoreEmployees';
import { StoreCommissions } from './components/store/StoreCommissions';
import { StoreOffers } from './components/store/StoreOffers';
import { StoreSettings } from './components/store/StoreSettings';
import { StoreCreateOrder } from './components/store/StoreCreateOrder';
import { MyOffers as StoreOwnerMyOffers } from './components/storeowner/MyOffers';

// Partner components
import { PartnerDashboard } from './pages/partner/Dashboard';
import { CreateOrder as PartnerCreateOrder } from './pages/partner/CreateOrder';
import { PartnerOrders } from './pages/partner/Orders';
import { PartnerPoints } from './pages/partner/Points';
import { PartnerNetwork } from './pages/partner/Network';
import { PartnerSponsored } from './pages/partner/Sponsored';
import { MyOffers as PartnerMyOffers } from './components/partner/MyOffers';
import { PartnerWallet } from './pages/partner/Wallet';
import { PartnerSettings } from './components/partner/PartnerSettings';

// Employee components
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { EmployeeWallet } from './components/employee/EmployeeWallet';
import { EmployeeCreateOrder } from './pages/employee/CreateOrder';
import { EmployeeSettings } from './components/employee/EmployeeSettings';

// Accountant components
import { AccountantWallet } from './components/accountant/AccountantWallet';
import { AccountantReports } from './components/accountant/AccountantReports';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OwnerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Stores />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Stock />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerHierarchy />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Employees isBusinessOwner={true} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/commissions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Commissions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tokens"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Tokens />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Accounting />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Offers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-methods"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PaymentMethods />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected KYC Reviewer Routes */}
          <Route
            path="/kyc-reviewer/verification"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <KYCVerification />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Store Owner Routes */}
          <Route
            path="/store/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/orders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreOrders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/purchase-orders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StorePurchaseOrders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/customers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreCustomers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/stock"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreStock />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/employees"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreEmployees />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/commissions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreCommissions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/offers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreOffers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/create-order"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreCreateOrder />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/my-offers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StoreOwnerMyOffers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Partner Routes */}
          <Route
            path="/partner/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/create-order"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerCreateOrder />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/orders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerOrders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/points"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerPoints />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/network"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerNetwork />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/sponsored"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerSponsored />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/my-offers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerMyOffers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/create-order"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeCreateOrder />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/orders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/points"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerPoints />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/my-offers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerMyOffers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EmployeeSettings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Accountant Routes */}
          <Route
            path="/accountant/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AccountantReports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AccountantWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all routes - redirect to appropriate dashboard */}
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}