import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Store, 
  UserCog, 
  Network, 
  TrendingUp, 
  TrendingDown,
  Calendar as CalendarIcon 
} from 'lucide-react';
import { mockKPIData, mockRevenueData } from '../../data/mockData';
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
  isWithinInterval
} from 'date-fns';

type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export function OwnerDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date('2020-01-01'),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => mockRevenueData, []);

  // Quick date range presets
  const datePresets = [
    { label: 'Today', value: 'today' as DatePreset },
    { label: 'Yesterday', value: 'yesterday' as DatePreset },
    { label: 'This Week', value: 'thisWeek' as DatePreset },
    { label: 'This Month', value: 'thisMonth' as DatePreset },
    { label: 'Last Month', value: 'lastMonth' as DatePreset },
    { label: 'This Year', value: 'thisYear' as DatePreset },
    { label: 'Last Year', value: 'lastYear' as DatePreset },
  ];

  // Function to get date range based on preset
  const getDateRangeFromPreset = (preset: DatePreset): { from: Date; to: Date } => {
    const today = new Date();
    
    switch (preset) {
      case 'today':
        return { from: startOfDay(today), to: endOfDay(today) };
      case 'yesterday':
        const yesterday = subDays(today, 1);
        return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
      case 'thisWeek':
        return { from: startOfWeek(today), to: endOfWeek(today) };
      case 'thisMonth':
        return { from: startOfMonth(today), to: endOfMonth(today) };
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case 'thisYear':
        return { from: startOfYear(today), to: endOfYear(today) };
      case 'lastYear':
        const lastYear = subYears(today, 1);
        return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
      default:
        return { from: today, to: today };
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset: DatePreset) => {
    const range = getDateRangeFromPreset(preset);
    setDateRange(range);
    setSelectedPreset(preset);
  };

  // Calculate filtered KPI data based on date range
  const filteredKPIData = useMemo(() => {
    // Simulate filtering based on date range
    // In a real app, this would filter actual data based on the date range
    const rangeDays = dateRange.to && dateRange.from 
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    // Apply a multiplier based on the range to simulate different values
    const multiplier = Math.min(rangeDays / 30, 1.5); // Scale based on days selected

    return {
      totalRevenue: Math.round(mockKPIData.totalRevenue * multiplier),
      revenueGrowth: mockKPIData.revenueGrowth,
      totalOrders: Math.round(mockKPIData.totalOrders * multiplier),
      ordersGrowth: mockKPIData.ordersGrowth,
      totalCustomers: Math.round(mockKPIData.totalCustomers * multiplier),
      totalStores: mockKPIData.totalStores, // Stores don't change with date
      totalEmployees: mockKPIData.totalEmployees, // Employees don't change with date
      totalPartners: Math.round(mockKPIData.totalPartners * multiplier),
    };
  }, [dateRange]);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${(filteredKPIData.totalRevenue / 1000).toFixed(0)}K`,
      change: `+${filteredKPIData.revenueGrowth}%`,
      positive: true,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Total Orders',
      value: filteredKPIData.totalOrders.toLocaleString(),
      change: `+${filteredKPIData.ordersGrowth}%`,
      positive: true,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: filteredKPIData.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Active Stores',
      value: filteredKPIData.totalStores,
      icon: Store,
      color: 'orange',
    },
    {
      title: 'Total Employees',
      value: filteredKPIData.totalEmployees,
      icon: UserCog,
      color: 'pink',
    },
    {
      title: 'Total Partners',
      value: filteredKPIData.totalPartners.toLocaleString(),
      icon: Network,
      color: 'teal',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500',
    teal: 'from-teal-500 to-emerald-500',
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
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
                  {datePresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={selectedPreset === preset.value ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetSelect(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[card.color]} opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorMap[card.color]} bg-opacity-10`}>
                <card.icon className={`h-5 w-5 text-${card.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              {card.change && (
                <div className="flex items-center gap-1 mt-2">
                  {card.positive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change} from last month
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Revenue Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly revenue over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={chartData} 
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                id="revenue-line-chart"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  className="opacity-50"
                  id="revenue-grid"
                />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  tickLine={false}
                  interval={0}
                  id="revenue-x-axis"
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  tickLine={false}
                  id="revenue-y-axis"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  id="revenue-tooltip"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  id="revenue-line"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Orders Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly orders over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={chartData} 
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                id="orders-bar-chart"
              >
                <defs>
                  <linearGradient id="ordersBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  className="opacity-50"
                  id="orders-grid"
                />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  tickLine={false}
                  interval={0}
                  id="orders-x-axis"
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                  tickLine={false}
                  id="orders-y-axis"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  id="orders-tooltip"
                />
                <Bar 
                  dataKey="orders" 
                  fill="url(#ordersBarGradient)" 
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                  id="orders-bar"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Store</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">Sthiroot Weight Loss - Delhi</p>
            <p className="text-sm text-muted-foreground mt-1">₹245K revenue this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">47</p>
            <p className="text-sm text-muted-foreground mt-1">Orders awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-700">892</p>
            <p className="text-sm text-muted-foreground mt-1">Partners in your network</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}