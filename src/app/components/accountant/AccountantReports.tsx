import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Wallet,
  Users
} from 'lucide-react';

export function AccountantReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Financial Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and download comprehensive financial reports
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
          <Download className="size-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Processed</p>
              <Wallet className="size-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">₹2,45,000</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Top-Ups</p>
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">₹1,85,000</p>
            <p className="text-xs text-muted-foreground mt-1">56 transactions</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Withdrawals</p>
              <TrendingUp className="size-5 text-amber-600 rotate-180" />
            </div>
            <p className="text-2xl font-bold text-amber-700">₹60,000</p>
            <p className="text-xs text-muted-foreground mt-1">12 transactions</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <Users className="size-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">248</p>
            <p className="text-xs text-muted-foreground mt-1">With wallets</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-emerald-600" />
              Transaction Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Daily Transaction Summary</p>
                <p className="text-sm text-muted-foreground">All transactions for today</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Last 7 days summary</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Monthly Report</p>
                <p className="text-sm text-muted-foreground">Current month detailed report</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Custom Date Range</p>
                <p className="text-sm text-muted-foreground">Select custom period</p>
              </div>
              <Button size="sm" variant="outline">
                <Calendar className="size-4 mr-2" />
                Select
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5 text-teal-600" />
              Wallet Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Top-Up Summary</p>
                <p className="text-sm text-muted-foreground">All approved top-ups</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Withdrawal Summary</p>
                <p className="text-sm text-muted-foreground">All processed withdrawals</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Wallet Balance Report</p>
                <p className="text-sm text-muted-foreground">All user balances</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Commission Report</p>
                <p className="text-sm text-muted-foreground">All commission payouts</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Activity Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-blue-600" />
              User Activity Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Active Users Report</p>
                <p className="text-sm text-muted-foreground">Users with transactions</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Partner Activity</p>
                <p className="text-sm text-muted-foreground">Partner-wise transactions</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Store Activity</p>
                <p className="text-sm text-muted-foreground">Store-wise transactions</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Employee Activity</p>
                <p className="text-sm text-muted-foreground">Employee-wise transactions</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-purple-600" />
              Audit Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Pending Requests</p>
                <p className="text-sm text-muted-foreground">All pending approvals</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Rejected Requests</p>
                <p className="text-sm text-muted-foreground">All rejected transactions</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Reported Issues</p>
                <p className="text-sm text-muted-foreground">All transaction disputes</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium">Audit Trail</p>
                <p className="text-sm text-muted-foreground">Complete transaction log</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
