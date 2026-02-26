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
import { Search, UserPlus, Eye, Phone, Mail } from 'lucide-react';

export function StoreCustomers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customers data
  const customers = [
    {
      id: 'CUST-001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      totalOrders: 12,
      totalSpent: 28500,
      lastOrder: '2026-02-16',
      status: 'Active',
    },
    {
      id: 'CUST-002',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      email: 'priya.sharma@email.com',
      totalOrders: 8,
      totalSpent: 15600,
      lastOrder: '2026-02-16',
      status: 'Active',
    },
    {
      id: 'CUST-003',
      name: 'Amit Patel',
      phone: '+91 98765 43212',
      email: 'amit.patel@email.com',
      totalOrders: 15,
      totalSpent: 42000,
      lastOrder: '2026-02-15',
      status: 'Active',
    },
    {
      id: 'CUST-004',
      name: 'Neha Singh',
      phone: '+91 98765 43213',
      email: 'neha.singh@email.com',
      totalOrders: 5,
      totalSpent: 9800,
      lastOrder: '2026-02-15',
      status: 'Active',
    },
    {
      id: 'CUST-005',
      name: 'Vikram Reddy',
      phone: '+91 98765 43214',
      email: 'vikram.reddy@email.com',
      totalOrders: 20,
      totalSpent: 56700,
      lastOrder: '2026-02-14',
      status: 'VIP',
    },
    {
      id: 'CUST-006',
      name: 'Anjali Desai',
      phone: '+91 98765 43215',
      email: 'anjali.desai@email.com',
      totalOrders: 3,
      totalSpent: 4500,
      lastOrder: '2026-02-10',
      status: 'Active',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.id.toLowerCase().includes(query) ||
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Customers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customers from your store
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-3xl font-bold mt-2">{customers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">VIP Customers</p>
          <p className="text-3xl font-bold mt-2">
            {customers.filter((c) => c.status === 'VIP').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">
            ₹{customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-3xl font-bold mt-2">
            ₹{Math.round(
              customers.reduce((acc, c) => acc + c.totalSpent, 0) /
                customers.reduce((acc, c) => acc + c.totalOrders, 0)
            ).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, Name, Phone, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell className="font-semibold">₹{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No customers found
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
