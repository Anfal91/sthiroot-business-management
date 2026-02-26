import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Calendar, Download, Search, Wallet, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  payoutPeriod: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  paymentMethod: string;
  rpAmount: number;
  description: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2026-01-25',
    amount: 5600,
    payoutPeriod: 'December 2025',
    reference: 'PAY-DEC2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 2800,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN002',
    date: '2026-01-15',
    amount: 1200,
    payoutPeriod: 'January 2026 (Advance)',
    reference: 'PAY-JAN2026-ADV',
    status: 'completed',
    paymentMethod: 'UPI',
    rpAmount: 600,
    description: 'Advance commission payout',
  },
  {
    id: 'TXN003',
    date: '2025-12-28',
    amount: 8400,
    payoutPeriod: 'November 2025',
    reference: 'PAY-NOV2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 4200,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN004',
    date: '2025-11-25',
    amount: 6200,
    payoutPeriod: 'October 2025',
    reference: 'PAY-OCT2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 3100,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN005',
    date: '2025-10-28',
    amount: 7800,
    payoutPeriod: 'September 2025',
    reference: 'PAY-SEP2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 3900,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN006',
    date: '2026-01-30',
    amount: 2400,
    payoutPeriod: 'January 2026',
    reference: 'PAY-JAN2026-001',
    status: 'processing',
    paymentMethod: 'Bank Transfer',
    rpAmount: 1200,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN007',
    date: '2025-09-25',
    amount: 5400,
    payoutPeriod: 'August 2025',
    reference: 'PAY-AUG2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 2700,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN008',
    date: '2025-08-28',
    amount: 4800,
    payoutPeriod: 'July 2025',
    reference: 'PAY-JUL2025-001',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    rpAmount: 2400,
    description: 'Monthly commission payout',
  },
  {
    id: 'TXN009',
    date: '2025-07-25',
    amount: 3600,
    payoutPeriod: 'June 2025',
    reference: 'PAY-JUN2025-001',
    status: 'completed',
    paymentMethod: 'UPI',
    rpAmount: 1800,
    description: 'Monthly commission payout',
  },
];

function getStatusIcon(status: Transaction['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-4 text-green-600" />;
    case 'pending':
      return <Clock className="size-4 text-amber-600" />;
    case 'processing':
      return <AlertCircle className="size-4 text-blue-600" />;
    case 'failed':
      return <XCircle className="size-4 text-red-600" />;
  }
}

function getStatusColor(status: Transaction['status']) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'processing':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-300';
  }
}

interface TransactionHistoryProps {
  partnerId: string;
}

export function TransactionHistory({ partnerId }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Calculate summary statistics
  const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
  const totalReceived = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonthTransactions = completedTransactions.filter(t => {
    const txnDate = new Date(t.date);
    const now = new Date();
    return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
  });
  const monthlyReceived = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending' || t.status === 'processing')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastPayout = completedTransactions.length > 0 
    ? new Date(completedTransactions[0].date).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    : 'N/A';

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = 
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payoutPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const txnDate = new Date(txn.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'this-month':
          matchesDate = txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          matchesDate = txnDate.getMonth() === lastMonth.getMonth() && txnDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'last-3-months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
          matchesDate = txnDate >= threeMonthsAgo;
          break;
        case 'last-6-months':
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6);
          matchesDate = txnDate >= sixMonthsAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    toast.success('Transaction history exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Received</p>
              <Wallet className="size-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ₹{totalReceived.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">This Month</p>
              <TrendingUp className="size-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-teal-700">
              ₹{monthlyReceived.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">January 2026</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <Clock className="size-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-700">
              ₹{pendingAmount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Under processing</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Last Payout</p>
              <Calendar className="size-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {lastPayout}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="size-5 text-emerald-600" />
              Transaction History
            </span>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, period, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="text-xs">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Reference</th>
                    <th className="text-left p-3">Payout Period</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-right p-3">RP Amount</th>
                    <th className="text-right p-3">Amount (₹)</th>
                    <th className="text-left p-3">Payment Method</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3 text-sm">
                          {new Date(txn.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3">
                          <p className="text-sm font-mono font-medium">{txn.reference}</p>
                          <p className="text-xs text-muted-foreground">{txn.id}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm font-medium">{txn.payoutPeriod}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground">{txn.description}</p>
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-sm font-semibold text-purple-700">{txn.rpAmount.toLocaleString()} RP</p>
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-sm font-bold text-emerald-700">₹{txn.amount.toLocaleString()}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm">{txn.paymentMethod}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(txn.status)}`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(txn.status)}
                                {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No transactions found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Summary */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}</p>
              <p>
                Total Amount: <span className="font-bold text-emerald-700">
                  ₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
