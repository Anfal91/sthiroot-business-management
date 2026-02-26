import { useState } from 'react';
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
import { format } from 'date-fns';

export function OwnerDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(2025, 11, 1),
    to: new Date(2026, 0, 12),
  });

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${(mockKPIData.totalRevenue / 1000).toFixed(0)}K`,
      change: `+${mockKPIData.revenueGrowth}%`,
      positive: true,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Total Orders',
      value: mockKPIData.totalOrders.toLocaleString(),
      change: `+${mockKPIData.ordersGrowth}%`,
      positive: true,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: mockKPIData.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Active Stores',
      value: mockKPIData.totalStores,
      icon: Store,
      color: 'orange',
    },
    {
      title: 'Total Employees',
      value: mockKPIData.totalEmployees,
      icon: UserCog,
      color: 'pink',
    },
    {
      title: 'Total Partners',
      value: mockKPIData.totalPartners.toLocaleString(),
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
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => range && setDateRange(range)}
            />
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
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
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
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Bar 
                  dataKey="orders" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
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
