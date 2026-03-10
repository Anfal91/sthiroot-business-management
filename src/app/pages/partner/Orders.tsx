import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Eye, Download, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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

type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export function PartnerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date('2020-01-01'),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');

  // Mock orders data - Partner's orders
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      products: 3,
      amount: 2450,
      commission: 1004, // 41% RP commission
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
      commission: 775, // 41% RP commission
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
      commission: 1312, // 41% RP commission
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
      commission: 640, // 41% RP commission
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
      commission: 1722, // 41% RP commission
      status: 'Completed',
      date: '2026-02-14',
      time: '09:30 AM',
      paymentMethod: 'Cash',
    },
    {
      id: 'ORD-006',
      customer: 'Sanjay Gupta',
      phone: '+91 98765 43215',
      products: 2,
      amount: 2800,
      commission: 1148, // 41% RP commission
      status: 'Completed',
      date: '2026-02-13',
      time: '02:15 PM',
      paymentMethod: 'UPI',
    },
  ];

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

  // Calculate totals
  const totalOrders = filteredOrders.length;
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalCommission = filteredOrders.reduce((sum, order) => sum + order.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your orders
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{totalOrders}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">₹{totalAmount.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Commission (RP)</p>
          <p className="text-3xl font-bold mt-2 text-purple-600">₹{totalCommission.toLocaleString()}</p>
        </Card>
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
                <TableHead>Commission (RP)</TableHead>
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
                    <TableCell className="font-semibold">₹{order.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-purple-600">₹{order.commission.toLocaleString()}</TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
