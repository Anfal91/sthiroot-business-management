import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Plus,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Separator } from '../ui/separator';

interface PurchaseOrder {
  id: string;
  supplierStore: string;
  supplierStoreId: string;
  products: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Rejected';
  orderDate: string;
  expectedDelivery: string;
  items: {
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  shippingAddress: string;
  notes?: string;
}

export function StorePurchaseOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock purchase orders data
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-2026-001',
      supplierStore: 'Main Store - Mumbai',
      supplierStoreId: 'STORE-001',
      products: 5,
      totalAmount: 45000,
      status: 'Delivered',
      orderDate: '2026-03-01',
      expectedDelivery: '2026-03-05',
      items: [
        {
          productName: 'Weight Loss Supplement',
          productCode: 'WL-100',
          quantity: 20,
          unitPrice: 1500,
          totalPrice: 30000,
        },
        {
          productName: 'Diabetes Care Capsules',
          productCode: 'DC-200',
          quantity: 15,
          unitPrice: 1000,
          totalPrice: 15000,
        },
      ],
      shippingAddress: '123 Store Street, Branch Area, City - 400001',
      notes: 'Urgent requirement for festival stock',
    },
    {
      id: 'PO-2026-002',
      supplierStore: 'Main Store - Mumbai',
      supplierStoreId: 'STORE-001',
      products: 3,
      totalAmount: 28500,
      status: 'Shipped',
      orderDate: '2026-03-05',
      expectedDelivery: '2026-03-09',
      items: [
        {
          productName: 'Heart Health Formula',
          productCode: 'HH-300',
          quantity: 10,
          unitPrice: 1800,
          totalPrice: 18000,
        },
        {
          productName: 'Thyroid Support',
          productCode: 'TS-400',
          quantity: 15,
          unitPrice: 700,
          totalPrice: 10500,
        },
      ],
      shippingAddress: '123 Store Street, Branch Area, City - 400001',
    },
    {
      id: 'PO-2026-003',
      supplierStore: 'Regional Hub - Delhi',
      supplierStoreId: 'STORE-002',
      products: 4,
      totalAmount: 32000,
      status: 'Approved',
      orderDate: '2026-03-07',
      expectedDelivery: '2026-03-12',
      items: [
        {
          productName: 'PCOD Care Pack',
          productCode: 'PC-500',
          quantity: 20,
          unitPrice: 1200,
          totalPrice: 24000,
        },
        {
          productName: 'Skin Glow Serum',
          productCode: 'SG-600',
          quantity: 10,
          unitPrice: 800,
          totalPrice: 8000,
        },
      ],
      shippingAddress: '123 Store Street, Branch Area, City - 400001',
      notes: 'Please pack carefully',
    },
    {
      id: 'PO-2026-004',
      supplierStore: 'Main Store - Mumbai',
      supplierStoreId: 'STORE-001',
      products: 2,
      totalAmount: 18000,
      status: 'Pending',
      orderDate: '2026-03-08',
      expectedDelivery: '2026-03-13',
      items: [
        {
          productName: 'Hair Growth Oil',
          productCode: 'HG-700',
          quantity: 30,
          unitPrice: 600,
          totalPrice: 18000,
        },
      ],
      shippingAddress: '123 Store Street, Branch Area, City - 400001',
    },
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const pending = purchaseOrders.filter(po => po.status === 'Pending').length;
    const approved = purchaseOrders.filter(po => po.status === 'Approved').length;
    const shipped = purchaseOrders.filter(po => po.status === 'Shipped').length;
    const delivered = purchaseOrders.filter(po => po.status === 'Delivered').length;
    const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

    return { total, pending, approved, shipped, delivered, totalValue };
  }, []);

  // Filter and search purchase orders
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplierStore.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'Approved':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'Shipped':
        return <Package className="h-3.5 w-3.5" />;
      case 'Delivered':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'Rejected':
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Purchase Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage orders placed to purchase from other stores
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Orders</CardDescription>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All purchase orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pending</CardDescription>
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>In Transit</CardDescription>
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.approved + stats.shipped}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Value</CardDescription>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₹{stats.totalValue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All orders combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or supplier store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders List</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} of {purchaseOrders.length} purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier Store</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.supplierStore}</p>
                          <p className="text-xs text-muted-foreground">{order.supplierStoreId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.products} items</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>{new Date(order.expectedDelivery).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>Complete information about {selectedOrder?.id}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">PO Number</Label>
                  <p className="font-semibold text-lg">{selectedOrder.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1 w-fit`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Supplier Store</Label>
                  <p className="font-medium">{selectedOrder.supplierStore}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.supplierStoreId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Date</Label>
                  <p className="font-medium">
                    {new Date(selectedOrder.orderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expected Delivery</Label>
                  <p className="font-medium">
                    {new Date(selectedOrder.expectedDelivery).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="font-semibold text-lg text-emerald-600">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="font-medium mt-1">{selectedOrder.shippingAddress}</p>
              </div>

              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="font-medium mt-1">{selectedOrder.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Order Items */}
              <div>
                <Label className="text-muted-foreground mb-3 block">Order Items</Label>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-muted-foreground">{item.productCode}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            ₹{item.unitPrice.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-semibold">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                  Close
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PO
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
