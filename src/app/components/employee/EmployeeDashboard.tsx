import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, TrendingUp, Wallet, Award, ShoppingCart, Users } from 'lucide-react';
import { mockWallets, mockWalletTransactions } from '../../data/walletMockData';

// Mock employee data
const mockEmployeeData = {
  id: 'EMP-001',
  name: 'Amit Patel',
  code: 'EMP-001',
  role: 'Sales Executive',
  joinDate: '2025-01-20',
  totalOrders: 145,
  monthlyOrders: 28,
  totalRevenue: 725000,
  monthlyRevenue: 140000,
  totalRP: 297250, // Total RP from all orders
  monthlyRP: 57400, // Monthly RP
  customersReferred: 89,
};

export function EmployeeDashboard() {
  // Get employee's wallet
  const employeeWallet = mockWallets.find(w => w.userId === mockEmployeeData.id);
  
  // Get recent transactions
  const recentTransactions = mockWalletTransactions
    .filter(t => t.userId === mockEmployeeData.id)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Employee Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, {mockEmployeeData.name}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <Card className="shadow-lg border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              ₹{employeeWallet?.balance.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        {/* Monthly Orders */}
        <Card className="shadow-lg border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Monthly Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {mockEmployeeData.monthlyOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {mockEmployeeData.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="shadow-lg border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              ₹{(mockEmployeeData.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: ₹{(mockEmployeeData.totalRevenue / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>

        {/* Monthly RP */}
        <Card className="shadow-lg border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Monthly RP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {mockEmployeeData.monthlyRP.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {mockEmployeeData.totalRP.toLocaleString()} RP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Employee Code</p>
              <p className="font-semibold">{mockEmployeeData.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-semibold">{mockEmployeeData.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-semibold">
                {new Date(mockEmployeeData.joinDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customers Referred</p>
              <p className="font-semibold">{mockEmployeeData.customersReferred}</p>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Statistics */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              Wallet Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="font-semibold text-green-600">
                ₹{employeeWallet?.totalReceived.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="font-semibold text-orange-600">
                ₹{employeeWallet?.totalWithdraw.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹{employeeWallet?.balance.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Status</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {employeeWallet?.status || 'Active'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="font-semibold">
                ₹{(mockEmployeeData.totalRevenue / mockEmployeeData.totalOrders).toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Target</p>
              <p className="font-semibold">₹150,000</p>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full"
                  style={{ width: `${(mockEmployeeData.monthlyRevenue / 150000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((mockEmployeeData.monthlyRevenue / 150000) * 100).toFixed(1)}% achieved
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Performance Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Award
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            Recent Wallet Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.transactionDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{transaction.transactionNumber}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'Received' || transaction.type === 'TopUp' || transaction.type === 'Refund'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'Received' || transaction.type === 'TopUp' || transaction.type === 'Refund' ? '+' : '-'}
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Balance: ₹{transaction.balanceAfter.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
