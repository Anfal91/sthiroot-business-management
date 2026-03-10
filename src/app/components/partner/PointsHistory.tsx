import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Calendar as CalendarComponent } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { 
  TrendingUp, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  ShoppingCart,
  Award,
  Calendar,
  Filter
} from 'lucide-react';
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

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  rpPerUnit: number;
  totalRP: number;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  totalAmount: number;
  totalRP: number;
  rpType: 'self' | 'team_a' | 'team_b';
  products: Product[];
  status: string;
}

// Mock RP/Points history data
const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    date: '2026-01-28',
    customerName: 'Rajesh Kumar',
    totalAmount: 4500,
    totalRP: 450,
    rpType: 'self',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-001',
        name: 'Premium Wellness Pack',
        sku: 'PWP-001',
        quantity: 2,
        rpPerUnit: 150,
        totalRP: 300,
      },
      {
        id: 'PROD-002',
        name: 'Immunity Booster Capsules',
        sku: 'IBC-002',
        quantity: 3,
        rpPerUnit: 50,
        totalRP: 150,
      },
    ],
  },
  {
    id: 'ORD-2026-002',
    date: '2026-01-26',
    customerName: 'Priya Sharma',
    totalAmount: 2800,
    totalRP: 280,
    rpType: 'team_a',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-003',
        name: 'Digestive Health Formula',
        sku: 'DHF-003',
        quantity: 2,
        rpPerUnit: 80,
        totalRP: 160,
      },
      {
        id: 'PROD-004',
        name: 'Energy Drink Mix',
        sku: 'EDM-004',
        quantity: 4,
        rpPerUnit: 30,
        totalRP: 120,
      },
    ],
  },
  {
    id: 'ORD-2026-003',
    date: '2026-01-24',
    customerName: 'Amit Patel',
    totalAmount: 6200,
    totalRP: 620,
    rpType: 'self',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-005',
        name: 'Complete Health Package',
        sku: 'CHP-005',
        quantity: 1,
        rpPerUnit: 400,
        totalRP: 400,
      },
      {
        id: 'PROD-002',
        name: 'Immunity Booster Capsules',
        sku: 'IBC-002',
        quantity: 2,
        rpPerUnit: 50,
        totalRP: 100,
      },
      {
        id: 'PROD-006',
        name: 'Protein Supplement',
        sku: 'PS-006',
        quantity: 2,
        rpPerUnit: 60,
        totalRP: 120,
      },
    ],
  },
  {
    id: 'ORD-2026-004',
    date: '2026-01-20',
    customerName: 'Sunita Rao',
    totalAmount: 1500,
    totalRP: 150,
    rpType: 'team_b',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-007',
        name: 'Multivitamin Tablets',
        sku: 'MVT-007',
        quantity: 3,
        rpPerUnit: 50,
        totalRP: 150,
      },
    ],
  },
  {
    id: 'ORD-2025-152',
    date: '2025-12-28',
    customerName: 'Deepak Singh',
    totalAmount: 3400,
    totalRP: 340,
    rpType: 'self',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-001',
        name: 'Premium Wellness Pack',
        sku: 'PWP-001',
        quantity: 1,
        rpPerUnit: 150,
        totalRP: 150,
      },
      {
        id: 'PROD-003',
        name: 'Digestive Health Formula',
        sku: 'DHF-003',
        quantity: 1,
        rpPerUnit: 80,
        totalRP: 80,
      },
      {
        id: 'PROD-006',
        name: 'Protein Supplement',
        sku: 'PS-006',
        quantity: 1,
        rpPerUnit: 60,
        totalRP: 60,
      },
      {
        id: 'PROD-002',
        name: 'Immunity Booster Capsules',
        sku: 'IBC-002',
        quantity: 1,
        rpPerUnit: 50,
        totalRP: 50,
      },
    ],
  },
  {
    id: 'ORD-2025-151',
    date: '2025-12-22',
    customerName: 'Meena Kapoor',
    totalAmount: 2100,
    totalRP: 210,
    rpType: 'team_a',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-004',
        name: 'Energy Drink Mix',
        sku: 'EDM-004',
        quantity: 7,
        rpPerUnit: 30,
        totalRP: 210,
      },
    ],
  },
  {
    id: 'ORD-2025-150',
    date: '2025-12-18',
    customerName: 'Rohit Malhotra',
    totalAmount: 5600,
    totalRP: 560,
    rpType: 'team_b',
    status: 'Delivered',
    products: [
      {
        id: 'PROD-005',
        name: 'Complete Health Package',
        sku: 'CHP-005',
        quantity: 1,
        rpPerUnit: 400,
        totalRP: 400,
      },
      {
        id: 'PROD-003',
        name: 'Digestive Health Formula',
        sku: 'DHF-003',
        quantity: 2,
        rpPerUnit: 80,
        totalRP: 160,
      },
    ],
  },
];

function getRPTypeColor(type: Order['rpType']) {
  switch (type) {
    case 'self':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'team_a':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'team_b':
      return 'bg-purple-100 text-purple-700 border-purple-300';
  }
}

function getRPTypeLabel(type: Order['rpType']) {
  switch (type) {
    case 'self':
      return 'Self RP';
    case 'team_a':
      return 'Team A RP';
    case 'team_b':
      return 'Team B RP';
  }
}

interface PointsHistoryProps {
  partnerId: string;
}

export function PointsHistory({ partnerId }: PointsHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rpTypeFilter, setRPTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date('2020-01-01'),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

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

  // Calculate summary statistics
  const totalRP = mockOrders.reduce((sum, o) => sum + o.totalRP, 0);
  
  const currentMonthOrders = mockOrders.filter(o => {
    const orderDate = new Date(o.date);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });
  const currentMonthRP = currentMonthOrders.reduce((sum, o) => sum + o.totalRP, 0);
  
  const lastMonthOrders = mockOrders.filter(o => {
    const orderDate = new Date(o.date);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthRP = lastMonthOrders.reduce((sum, o) => sum + o.totalRP, 0);

  const selfRP = mockOrders.filter(o => o.rpType === 'self').reduce((sum, o) => sum + o.totalRP, 0);
  const teamARP = mockOrders.filter(o => o.rpType === 'team_a').reduce((sum, o) => sum + o.totalRP, 0);
  const teamBRP = mockOrders.filter(o => o.rpType === 'team_b').reduce((sum, o) => sum + o.totalRP, 0);
  const matchingRP = Math.min(teamARP, teamBRP);

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRPType = rpTypeFilter === 'all' || order.rpType === rpTypeFilter;
    
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.date);
      matchesDate = isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to });
    }
    
    return matchesSearch && matchesRPType && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total RP Earned</p>
              <TrendingUp className="size-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {totalRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Current Month RP</p>
              <Calendar className="size-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-teal-700">
              {currentMonthRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">January 2026</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Previous Month RP</p>
              <Calendar className="size-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {lastMonthRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">December 2025</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Matching RP</p>
              <Award className="size-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {matchingRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Min(A: {teamARP}, B: {teamBRP})</p>
          </CardContent>
        </Card>
      </div>

      {/* RP Breakdown */}
      <Card className="border-emerald-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">RP Breakdown by Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div>
                <p className="text-xs text-muted-foreground">Self RP</p>
                <p className="text-2xl font-bold text-emerald-700">{selfRP.toLocaleString()}</p>
              </div>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                Self
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-xs text-muted-foreground">Team A RP</p>
                <p className="text-2xl font-bold text-blue-700">{teamARP.toLocaleString()}</p>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                Team A
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <p className="text-xs text-muted-foreground">Team B RP</p>
                <p className="text-2xl font-bold text-purple-700">{teamBRP.toLocaleString()}</p>
              </div>
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                Team B
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order-wise RP History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-emerald-600" />
            Order-wise RP History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={rpTypeFilter} onValueChange={setRPTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="RP Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RP Types</SelectItem>
                <SelectItem value="self">Self RP</SelectItem>
                <SelectItem value="team_a">Team A RP</SelectItem>
                <SelectItem value="team_b">Team B RP</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto gap-2">
                  <Calendar className="h-4 w-4" />
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
                    <CalendarComponent
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

          {/* Orders List with Expandable Product Details */}
          <div className="space-y-2">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                
                return (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    {/* Order Summary Row */}
                    <div 
                      className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="size-5 text-emerald-600" />
                            ) : (
                              <ChevronRight className="size-5 text-emerald-600" />
                            )}
                          </button>
                          
                          <ShoppingCart className="size-5 text-muted-foreground flex-shrink-0" />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{order.id}</p>
                              <Badge variant="outline" className={`text-xs ${getRPTypeColor(order.rpType)}`}>
                                {getRPTypeLabel(order.rpType)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>{order.customerName}</span>
                              <span>•</span>
                              <span>{new Date(order.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}</span>
                              <span>•</span>
                              <span>{order.products.length} product{order.products.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground">Order Amount</p>
                          <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground">Total RP</p>
                          <p className="text-xl font-bold text-emerald-700">{order.totalRP.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Product Details */}
                    {isExpanded && (
                      <div className="border-t bg-background">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Package className="size-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm">Product-wise RP Breakdown</h4>
                          </div>
                          <div className="space-y-2">
                            {order.products.map((product) => (
                              <div 
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{product.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    SKU: {product.sku} • Qty: {product.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">RP per unit</p>
                                  <p className="font-semibold text-sm">{product.rpPerUnit} RP</p>
                                </div>
                                <div className="text-right ml-6">
                                  <p className="text-sm text-muted-foreground">Total RP</p>
                                  <p className="font-bold text-emerald-700">{product.totalRP} RP</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground border rounded-lg">
                No orders found matching your filters
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <p>Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
              <p>
                Total RP: <span className="font-bold text-emerald-700">
                  {filteredOrders.reduce((sum, o) => sum + o.totalRP, 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}