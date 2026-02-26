import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function StoreTransactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock transactions data
  const transactions = [
    {
      id: 'TXN-001',
      date: '2026-02-16',
      time: '10:30 AM',
      type: 'Sale',
      orderId: 'ORD-001',
      customer: 'Rajesh Kumar',
      amount: 2450,
      paymentMethod: 'UPI',
      status: 'Completed',
    },
    {
      id: 'TXN-002',
      date: '2026-02-16',
      time: '11:45 AM',
      type: 'Sale',
      orderId: 'ORD-002',
      customer: 'Priya Sharma',
      amount: 1890,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 'TXN-003',
      date: '2026-02-15',
      time: '03:20 PM',
      type: 'Sale',
      orderId: 'ORD-003',
      customer: 'Amit Patel',
      amount: 3200,
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 'TXN-004',
      date: '2026-02-15',
      time: '05:15 PM',
      type: 'Refund',
      orderId: 'ORD-010',
      customer: 'Neha Singh',
      amount: -580,
      paymentMethod: 'UPI',
      status: 'Completed',
    },
    {
      id: 'TXN-005',
      date: '2026-02-14',
      time: '09:30 AM',
      type: 'Sale',
      orderId: 'ORD-005',
      customer: 'Vikram Reddy',
      amount: 4200,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 'TXN-006',
      date: '2026-02-14',
      time: '02:15 PM',
      type: 'Expense',
      orderId: '-',
      customer: 'Stock Purchase',
      amount: -15000,
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 'TXN-007',
      date: '2026-02-13',
      time: '11:00 AM',
      type: 'Sale',
      orderId: 'ORD-008',
      customer: 'Anjali Desai',
      amount: 1450,
      paymentMethod: 'UPI',
      status: 'Completed',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sale':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Refund':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Expense':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalRevenue = transactions
    .filter((t) => t.type === 'Sale')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalRefunds = Math.abs(
    transactions.filter((t) => t.type === 'Refund').reduce((acc, t) => acc + t.amount, 0)
  );
  const totalExpenses = Math.abs(
    transactions.filter((t) => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0)
  );
  const netBalance = totalRevenue - totalRefunds - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all financial transactions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-2 text-emerald-600">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Refunds</p>
              <p className="text-2xl font-bold mt-2 text-amber-600">
                ₹{totalRefunds.toLocaleString()}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold mt-2 text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className="text-2xl font-bold mt-2">₹{netBalance.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Transaction ID, Order ID, or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sale">Sales</SelectItem>
              <SelectItem value="Refund">Refunds</SelectItem>
              <SelectItem value="Expense">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer/Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>
                      <div>
                        <p>{txn.date}</p>
                        <p className="text-sm text-muted-foreground">{txn.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(txn.type)}>
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{txn.orderId}</TableCell>
                    <TableCell>{txn.customer}</TableCell>
                    <TableCell>{txn.paymentMethod}</TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
