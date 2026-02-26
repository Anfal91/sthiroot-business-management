import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Store,
  Package,
  DollarSign,
  Network,
  UserCog,
  BarChart3,
  Menu,
  LogOut,
  ChevronDown,
  Coins,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Tag,
  Wallet,
  Award,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Gift,
  CreditCard,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { mockWallets } from '../../data/walletMockData';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ownerNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Store, label: 'Stores', path: '/stores' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Package, label: 'Stock', path: '/stock' },
    { icon: Network, label: 'Partners', path: '/partners' },
    { icon: UserCog, label: 'Employees', path: '/employees' },
    { icon: Coins, label: 'Commissions', path: '/commissions' },
    { icon: Coins, label: 'Tokens', path: '/tokens' },
    { icon: BarChart3, label: 'Accounting', path: '/accounting' },
    { icon: Tag, label: 'Offers', path: '/offers' },
    { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods' },
  ];

  const partnerNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/partner/dashboard' },
    { icon: Plus, label: 'Create Order', path: '/partner/create-order' },
    { icon: Coins, label: 'Points History', path: '/partner/points' },
    { icon: Network, label: 'My Network', path: '/partner/network' },
    { icon: Users, label: 'Sponsored Partners', path: '/partner/sponsored' },
    { icon: Tag, label: 'My Offers', path: '/partner/my-offers' },
  ];

  const storeOwnerNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/store/dashboard' },
    { icon: Wallet, label: 'My Wallet', path: '/store/wallet' },
    { icon: Plus, label: 'Create Order', path: '/store/create-order' },
    { icon: ShoppingCart, label: 'Orders', path: '/store/orders' },
    { icon: Users, label: 'Customers', path: '/store/customers' },
    { icon: Package, label: 'Stock', path: '/store/stock' },
    { icon: UserCog, label: 'Employees', path: '/store/employees' },
    { icon: Coins, label: 'Commissions', path: '/store/commissions' },
    { icon: Tag, label: 'Offers', path: '/store/offers' },
    { icon: Gift, label: 'My Offers', path: '/store/my-offers' },
    { icon: Settings, label: 'Settings', path: '/store/settings' },
  ];

  const employeeNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
    { icon: Wallet, label: 'My Wallet', path: '/employee/wallet' },
    { icon: Plus, label: 'Create Order', path: '/employee/create-order' },
    { icon: ShoppingCart, label: 'Orders', path: '/employee/orders' },
    { icon: Award, label: 'Points History', path: '/employee/points' },
    { icon: Tag, label: 'My Offers', path: '/employee/my-offers' },
  ];

  const accountantNavItems = [
    { icon: Wallet, label: 'Wallet Management', path: '/accountant/wallet', key: 'wallet-main' },
    { icon: ArrowUpCircle, label: 'Top-Up Requests', path: '/accountant/wallet', key: 'wallet-topup' },
    { icon: ArrowDownCircle, label: 'Withdraw Requests', path: '/accountant/wallet', key: 'wallet-withdraw' },
    { icon: AlertTriangle, label: 'Reported Issues', path: '/accountant/wallet', key: 'wallet-issues' },
    { icon: BarChart3, label: 'Reports', path: '/accountant/reports', key: 'reports' },
  ];

  const navItems = 
    user?.role === 'owner' ? ownerNavItems : 
    user?.role === 'store-owner' ? storeOwnerNavItems : 
    user?.role === 'employee' ? employeeNavItems :
    user?.role === 'accountant' ? accountantNavItems :
    partnerNavItems;

  // Get wallet balance for roles that have wallets
  const getUserWallet = () => {
    if (!user) return null;
    // Map user role to wallet userType
    const walletUserType = 
      user.role === 'partner' ? 'Partner' :
      user.role === 'employee' ? 'Employee' :
      user.role === 'store-owner' ? 'Store' :
      null;
    
    if (!walletUserType) return null;
    
    // Find wallet by userId (simplified - in real app would use actual user ID)
    return mockWallets.find(w => w.userType === walletUserType);
  };

  const wallet = getUserWallet();
  const hasWallet = ['partner', 'employee', 'store-owner'].includes(user?.role || '');

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={`p-6 border-b border-emerald-100 ${collapsed ? 'p-3' : ''}`}>
        {!collapsed ? (
          <img 
            src="https://res.cloudinary.com/dptsgpxod/image/upload/v1771497022/sthiroot_logo_radjgv.png" 
            alt="Sthiroot" 
            className="h-12 object-contain"
          />
        ) : (
          <div className="h-10 flex items-center justify-center">
            <img 
              src="https://res.cloudinary.com/dptsgpxod/image/upload/v1771497165/short-icon_bqxtrz.png" 
              alt="Sthiroot" 
              className="h-10 w-10 object-contain"
            />
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={'key' in item ? item.key : item.path}
            variant="ghost"
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} hover:bg-emerald-50 hover:text-emerald-700`}
            onClick={() => {
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`h-5 w-5 ${!collapsed ? 'mr-3' : ''}`} />
            {!collapsed && item.label}
          </Button>
        ))}
      </nav>
    </div>
  );

  const getPortalTitle = () => {
    if (user?.role === 'owner') return 'Owner Portal';
    if (user?.role === 'store-owner') return 'Store Portal';
    if (user?.role === 'employee') return 'Employee Portal';
    if (user?.role === 'accountant') return 'Accountant Portal';
    return 'Partner Portal';
  };

  const getWalletPath = () => {
    if (user?.role === 'partner') return '/partner/wallet';
    if (user?.role === 'employee') return '/employee/wallet';
    if (user?.role === 'store-owner') return '/store/wallet';
    return '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col border-r border-emerald-100 bg-white transition-all duration-300 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <NavContent collapsed={sidebarCollapsed} />
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-emerald-100 bg-white shadow-md flex items-center justify-center hover:bg-emerald-50 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-emerald-600" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu for the {getPortalTitle()}
                  </SheetDescription>
                  <NavContent />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {getPortalTitle()}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Wallet Balance - Only for Partner, Employee, Store */}
              {hasWallet && wallet && (
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-200 hover:bg-emerald-50 hidden sm:flex"
                  onClick={() => navigate(getWalletPath())}
                >
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground leading-none">Wallet</p>
                    <p className="font-semibold text-emerald-600">₹{wallet.balance.toLocaleString()}</p>
                  </div>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                      <span className="text-xs text-emerald-600 font-medium mt-1 capitalize">{user?.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  {hasWallet && wallet && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(getWalletPath())}>
                        <Wallet className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Wallet Balance</p>
                          <p className="font-semibold text-emerald-600">₹{wallet.balance.toLocaleString()}</p>
                        </div>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}