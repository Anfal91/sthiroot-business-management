import { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Filter, Eye, Download, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subMonths,
  subYears,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { OrderView } from '../orders/OrderView';
import type { Order } from '../orders/OrderView';

type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export function StoreOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date('2020-01-01'),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);

  // If viewing an order, show the full-screen order view
  if (viewOrderOpen && selectedOrder) {
    return (
      <OrderView
        order={selectedOrder}
        onBack={() => {
          setViewOrderOpen(false);
          setSelectedOrder(null);
        }}
      />
    );
  }

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      products: 3,
      amount: 2450,
      status: 'Completed',
      date: '2026-02-16',
      time: '10:30 AM',
      paymentMethod: 'UPI',
    },
    {
      id: 'ORD-002',
      customer: 'Priya Sharma',
      phone: '+91 98765 43211',
      products: 2,
      amount: 1890,
      status: 'Processing',
      date: '2026-02-16',
      time: '11:45 AM',
      paymentMethod: 'Cash',
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      phone: '+91 98765 43212',
      products: 5,
      amount: 3200,
      status: 'Completed',
      date: '2026-02-15',
      time: '03:20 PM',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'ORD-004',
      customer: 'Neha Singh',
      phone: '+91 98765 43213',
      products: 1,
      amount: 1560,
      status: 'Pending',
      date: '2026-02-15',
      time: '05:15 PM',
      paymentMethod: 'UPI',
    },
    {
      id: 'ORD-005',
      customer: 'Vikram Reddy',
      phone: '+91 98765 43214',
      products: 4,
      amount: 4200,
      status: 'Completed',
      date: '2026-02-14',
      time: '09:30 AM',
      paymentMethod: 'Cash',
    },
  ];

  // Function to generate detailed order data for viewing
  const getDetailedOrder = (orderId: string): Order | null => {
    const basicOrder = orders.find(o => o.id === orderId);
    if (!basicOrder) return null;

    // Generate mock detailed data based on basic order
    const detailedOrder: Order = {
      id: basicOrder.id,
      orderDate: basicOrder.date,
      orderTime: basicOrder.time,
      status: basicOrder.status as Order['status'],
      customer: {
        name: basicOrder.customer,
        phone: basicOrder.phone,
        alternativePhone: '+91 98765 99999',
        email: `${basicOrder.customer.toLowerCase().replace(' ', '.')}@example.com`,
        address: '123 Health Street, Wellness Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      agent: {
        name: 'Store Manager',
        phone: '+91 98765 00000',
        role: 'Store Admin',
        id: 'EMP-001',
      },
      items: [
        {
          productId: 'PROD-001',
          productName: 'Weight Loss Supplement',
          productCode: 'WL-100',
          productType: 'Physical Product',
          quantity: 2,
          unitPrice: 800,
          discount: 10,
          discountAmount: 160,
          totalPrice: 1440,
        },
        {
          productId: 'PROD-002',
          productName: 'Diabetes Care Capsules',
          productCode: 'DC-200',
          productType: 'Physical Product',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
        },
      ],
      subtotal: 2800,
      discount: 10,
      discountAmount: 160,
      deliveryCharges: 50,
      tax: 0,
      totalAmount: basicOrder.amount,
      paymentMethod: basicOrder.paymentMethod,
      paymentStatus: basicOrder.status === 'Completed' ? 'Paid' : basicOrder.status === 'Pending' ? 'Pending' : 'Partial',
      paidAmount: basicOrder.status === 'Completed' ? basicOrder.amount : basicOrder.status === 'Pending' ? 0 : Math.floor(basicOrder.amount / 2),
      pendingAmount: basicOrder.status === 'Completed' ? 0 : basicOrder.status === 'Pending' ? basicOrder.amount : Math.ceil(basicOrder.amount / 2),
      paymentDetails: basicOrder.paymentMethod === 'UPI' ? {
        transactionId: 'TXN' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        transactionDate: basicOrder.date,
        upiId: 'customer@paytm',
      } : basicOrder.paymentMethod === 'Bank Transfer' ? {
        transactionId: 'TXN' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        transactionDate: basicOrder.date,
        bankName: 'HDFC Bank',
      } : undefined,
      deliveryType: 'Home Delivery',
      orderSource: 'Direct',
      notes: 'Please deliver between 10 AM - 5 PM',
      internalNotes: 'Customer is a regular buyer',
      statusHistory: generateStatusHistory(basicOrder.status as Order['status'], basicOrder.date, basicOrder.time),
      store: {
        name: 'Main Store - Mumbai',
        id: 'STORE-001',
        address: '456 Store Road, Business District, Mumbai - 400001',
      },
    };

    return detailedOrder;
  };

  // Generate status history based on current status
  const generateStatusHistory = (currentStatus: Order['status'], orderDate: string, orderTime: string) => {
    const history: Order['statusHistory'] = [];
    
    // Add Pending status (always first)
    history.push({
      status: 'Pending',
      date: orderDate,
      time: orderTime,
      updatedBy: 'System',
      notes: 'Order placed successfully',
    });

    // Add intermediate statuses based on current status
    if (['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Completed'].includes(currentStatus)) {
      const processDate = new Date(orderDate);
      processDate.setHours(processDate.getHours() + 1);
      history.push({
        status: 'Processing',
        date: processDate.toISOString().split('T')[0],
        time: processDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        updatedBy: 'Store Manager',
        notes: 'Order confirmed and being prepared',
      });
    }

    if (['Confirmed', 'Shipped', 'Delivered', 'Completed'].includes(currentStatus)) {
      const confirmDate = new Date(orderDate);
      confirmDate.setHours(confirmDate.getHours() + 2);
      history.push({
        status: 'Confirmed',
        date: confirmDate.toISOString().split('T')[0],
        time: confirmDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        updatedBy: 'Warehouse Team',
        notes: 'Products packed and ready for shipment',
      });
    }

    if (['Shipped', 'Delivered', 'Completed'].includes(currentStatus)) {
      const shipDate = new Date(orderDate);
      shipDate.setDate(shipDate.getDate() + 1);
      history.push({
        status: 'Shipped',
        date: shipDate.toISOString().split('T')[0],
        time: '10:00 AM',
        updatedBy: 'Delivery Partner',
        notes: 'Order dispatched for delivery',
      });
    }

    if (['Delivered', 'Completed'].includes(currentStatus)) {
      const deliverDate = new Date(orderDate);
      deliverDate.setDate(deliverDate.getDate() + 2);
      history.push({
        status: 'Delivered',
        date: deliverDate.toISOString().split('T')[0],
        time: '03:30 PM',
        updatedBy: 'Delivery Partner',
        notes: 'Order delivered successfully',
      });
    }

    if (currentStatus === 'Completed') {
      const completeDate = new Date(orderDate);
      completeDate.setDate(completeDate.getDate() + 3);
      history.push({
        status: 'Completed',
        date: completeDate.toISOString().split('T')[0],
        time: '04:00 PM',
        updatedBy: 'System',
        notes: 'Order completed and closed',
      });
    }

    if (currentStatus === 'Cancelled') {
      const cancelDate = new Date(orderDate);
      cancelDate.setHours(cancelDate.getHours() + 1);
      history.push({
        status: 'Cancelled',
        date: cancelDate.toISOString().split('T')[0],
        time: cancelDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        updatedBy: 'Customer Service',
        notes: 'Order cancelled by customer request',
      });
    }

    return history.reverse(); // Most recent first
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const orderDate = parseISO(order.date);
    const isWithinRange = isWithinInterval(orderDate, {
      start: dateRange.from,
      end: dateRange.to || endOfDay(new Date()),
    });
    return matchesSearch && matchesStatus && isWithinRange;
  });

  const handlePresetChange = (preset: DatePreset) => {
    setSelectedPreset(preset);
    switch (preset) {
      case 'today':
        setDateRange({ from: startOfDay(new Date()), to: endOfDay(new Date()) });
        break;
      case 'yesterday':
        setDateRange({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) });
        break;
      case 'thisWeek':
        setDateRange({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) });
        break;
      case 'thisMonth':
        setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
        break;
      case 'lastMonth':
        setDateRange({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) });
        break;
      case 'thisYear':
        setDateRange({ from: startOfYear(new Date()), to: endOfYear(new Date()) });
        break;
      case 'lastYear':
        setDateRange({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) });
        break;
      case 'custom':
        setDateRange({ from: new Date('2020-01-01'), to: new Date() });
        break;
      default:
        setDateRange({ from: new Date('2020-01-01'), to: new Date() });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all orders from your store
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from && format(dateRange.from, 'MMM dd')} - {dateRange.to && format(dateRange.to, 'MMM dd, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex flex-col md:flex-row">
                {/* Quick Date Presets */}
                <div className="border-b md:border-b-0 md:border-r p-3 space-y-1">
                  <div className="text-sm font-medium text-muted-foreground mb-2 px-2">Quick Select</div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                    <Button
                      variant={selectedPreset === 'today' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('today')}
                    >
                      Today
                    </Button>
                    <Button
                      variant={selectedPreset === 'yesterday' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('yesterday')}
                    >
                      Yesterday
                    </Button>
                    <Button
                      variant={selectedPreset === 'thisWeek' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('thisWeek')}
                    >
                      This Week
                    </Button>
                    <Button
                      variant={selectedPreset === 'thisMonth' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('thisMonth')}
                    >
                      This Month
                    </Button>
                    <Button
                      variant={selectedPreset === 'lastMonth' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('lastMonth')}
                    >
                      Last Month
                    </Button>
                    <Button
                      variant={selectedPreset === 'thisYear' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('thisYear')}
                    >
                      This Year
                    </Button>
                    <Button
                      variant={selectedPreset === 'lastYear' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetChange('lastYear')}
                    >
                      Last Year
                    </Button>
                  </div>
                </div>
                {/* Calendar */}
                <div className="p-2 md:p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange(range);
                        setSelectedPreset('custom');
                      }
                    }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.products} items</TableCell>
                    <TableCell className="font-semibold">₹{order.amount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.date}</p>
                        <p className="text-sm text-muted-foreground">{order.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(getDetailedOrder(order.id));
                          setViewOrderOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found
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