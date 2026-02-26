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
import { Search, Plus, AlertTriangle, TrendingUp, Package } from 'lucide-react';

export function StoreStock() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stock data
  const stockItems = [
    {
      id: 'PRD-001',
      name: 'Moringa Powder',
      category: 'Powder',
      quantity: 5,
      unit: 'kg',
      minStock: 10,
      maxStock: 50,
      price: 450,
      lastRestocked: '2026-02-10',
      status: 'Low Stock',
    },
    {
      id: 'PRD-002',
      name: 'Ashwagandha Capsules',
      category: 'Capsules',
      quantity: 12,
      unit: 'bottles',
      minStock: 15,
      maxStock: 100,
      price: 890,
      lastRestocked: '2026-02-08',
      status: 'Low Stock',
    },
    {
      id: 'PRD-003',
      name: 'Turmeric Extract',
      category: 'Extract',
      quantity: 8,
      unit: 'kg',
      minStock: 10,
      maxStock: 40,
      price: 680,
      lastRestocked: '2026-02-12',
      status: 'Low Stock',
    },
    {
      id: 'PRD-004',
      name: 'Triphala Powder',
      category: 'Powder',
      quantity: 35,
      unit: 'kg',
      minStock: 10,
      maxStock: 50,
      price: 320,
      lastRestocked: '2026-02-14',
      status: 'In Stock',
    },
    {
      id: 'PRD-005',
      name: 'Giloy Capsules',
      category: 'Capsules',
      quantity: 78,
      unit: 'bottles',
      minStock: 15,
      maxStock: 100,
      price: 650,
      lastRestocked: '2026-02-15',
      status: 'In Stock',
    },
    {
      id: 'PRD-006',
      name: 'Amla Juice',
      category: 'Juice',
      quantity: 0,
      unit: 'liters',
      minStock: 20,
      maxStock: 100,
      price: 280,
      lastRestocked: '2026-01-28',
      status: 'Out of Stock',
    },
    {
      id: 'PRD-007',
      name: 'Neem Capsules',
      category: 'Capsules',
      quantity: 45,
      unit: 'bottles',
      minStock: 15,
      maxStock: 80,
      price: 580,
      lastRestocked: '2026-02-16',
      status: 'In Stock',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredItems = stockItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter((item) => item.status === 'Low Stock').length;
  const outOfStockItems = stockItems.filter((item) => item.status === 'Out of Stock').length;
  const totalValue = stockItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Stock
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage inventory for your store
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-3xl font-bold mt-2">{totalItems}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-3xl font-bold mt-2 text-amber-600">{lowStockItems}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-3xl font-bold mt-2 text-red-600">{outOfStockItems}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock Value</p>
              <p className="text-3xl font-bold mt-2">₹{totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Product ID, Name, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stock Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min/Max Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className={item.status === 'Out of Stock' ? 'bg-red-50/50' : ''}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        item.status === 'Out of Stock' ? 'text-red-600' :
                        item.status === 'Low Stock' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {item.minStock} / {item.maxStock} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">₹{item.price}</TableCell>
                    <TableCell>{item.lastRestocked}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No stock items found
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
