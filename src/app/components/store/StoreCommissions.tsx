import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

export function StoreCommissions() {
  // Mock commission data
  const commissions = [
    {
      id: 'COM-001',
      partnerId: 'PTR-1001',
      partnerName: 'Rajesh Kumar',
      orderId: 'ORD-001',
      orderAmount: 2450,
      commissionRate: 10,
      commissionAmount: 245,
      date: '2026-02-16',
      status: 'Paid',
    },
    {
      id: 'COM-002',
      partnerId: 'PTR-1002',
      partnerName: 'Priya Sharma',
      orderId: 'ORD-002',
      orderAmount: 1890,
      commissionRate: 10,
      commissionAmount: 189,
      date: '2026-02-16',
      status: 'Paid',
    },
    {
      id: 'COM-003',
      partnerId: 'PTR-1003',
      partnerName: 'Amit Patel',
      orderId: 'ORD-003',
      orderAmount: 3200,
      commissionRate: 12,
      commissionAmount: 384,
      date: '2026-02-15',
      status: 'Pending',
    },
    {
      id: 'COM-004',
      partnerId: 'PTR-1001',
      partnerName: 'Rajesh Kumar',
      orderId: 'ORD-005',
      orderAmount: 4200,
      commissionRate: 10,
      commissionAmount: 420,
      date: '2026-02-14',
      status: 'Paid',
    },
    {
      id: 'COM-005',
      partnerId: 'PTR-1004',
      partnerName: 'Vikram Reddy',
      orderId: 'ORD-008',
      orderAmount: 1450,
      commissionRate: 10,
      commissionAmount: 145,
      date: '2026-02-13',
      status: 'Paid',
    },
  ];

  const totalCommissionPaid = commissions
    .filter((c) => c.status === 'Paid')
    .reduce((acc, c) => acc + c.commissionAmount, 0);
  const totalCommissionPending = commissions
    .filter((c) => c.status === 'Pending')
    .reduce((acc, c) => acc + c.commissionAmount, 0);
  const totalPartners = new Set(commissions.map((c) => c.partnerId)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Store Commissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Track commissions paid to partners
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold mt-2 text-emerald-600">
                ₹{totalCommissionPaid.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-2 text-amber-600">
                ₹{totalCommissionPending.toLocaleString()}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Partners</p>
              <p className="text-2xl font-bold mt-2">{totalPartners}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Commission History</h2>
          <Button variant="outline">Process Pending</Button>
        </div>

        {/* Commissions Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Commission ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">{commission.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{commission.partnerName}</p>
                      <p className="text-sm text-muted-foreground">{commission.partnerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{commission.orderId}</TableCell>
                  <TableCell>₹{commission.orderAmount}</TableCell>
                  <TableCell>{commission.commissionRate}%</TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    ₹{commission.commissionAmount}
                  </TableCell>
                  <TableCell>{commission.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        commission.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {commission.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
