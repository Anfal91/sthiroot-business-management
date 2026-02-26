import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Lock, Calendar, FileText, DollarSign, TrendingUp } from 'lucide-react';

export function Accounting() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Accounting Module
        </h1>
        <p className="text-muted-foreground mt-1">Advanced financial management and reporting</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="shadow-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white border-0">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Lock className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-bold mb-3">Coming Soon</h2>
          <p className="text-xl text-white/90 mb-6">
            Advanced accounting features are under development
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            We're building a comprehensive accounting module with automated reports, tax calculations, 
            financial statements, and more. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg opacity-50 pointer-events-none">
          <CardHeader className="pb-3">
            <Calendar className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-lg">Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monthly, quarterly, and annual financial reports with detailed breakdowns
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg opacity-50 pointer-events-none">
          <CardHeader className="pb-3">
            <FileText className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle className="text-lg">Invoice Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create, track, and manage invoices for all your stores and partners
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg opacity-50 pointer-events-none">
          <CardHeader className="pb-3">
            <DollarSign className="h-8 w-8 text-emerald-500 mb-2" />
            <CardTitle className="text-lg">Tax Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automated tax calculations and GST reports for compliance
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg opacity-50 pointer-events-none">
          <CardHeader className="pb-3">
            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle className="text-lg">P&L Statements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Profit and loss statements with real-time data and insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="shadow-lg border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-emerald-900">Expected Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Comprehensive financial dashboard with real-time analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Automated ledger entries and journal management</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Bank reconciliation and payment tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Multi-currency support for international operations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Expense tracking and budget management</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Customizable financial reports and exports</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
