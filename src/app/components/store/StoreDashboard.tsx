import { Card } from '../ui/card';
import { ShoppingCart, Users, Package, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export function StoreDashboard() {
  // Mock data for the store dashboard
  const stats = [
    {
      title: 'Today\'s Orders',
      value: '24',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Stock Items',
      value: '89',
      change: '-3',
      trend: 'down',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Today\'s Revenue',
      value: '₹42,580',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Rajesh Kumar', amount: 2450, status: 'Completed', time: '10 mins ago' },
    { id: 'ORD-002', customer: 'Priya Sharma', amount: 1890, status: 'Processing', time: '25 mins ago' },
    { id: 'ORD-003', customer: 'Amit Patel', amount: 3200, status: 'Completed', time: '1 hour ago' },
    { id: 'ORD-004', customer: 'Neha Singh', amount: 1560, status: 'Pending', time: '2 hours ago' },
  ];

  const lowStockItems = [
    { name: 'Moringa Powder', quantity: 5, unit: 'kg' },
    { name: 'Ashwagandha Capsules', quantity: 12, unit: 'bottles' },
    { name: 'Turmeric Extract', quantity: 8, unit: 'kg' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Store Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening in your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'} ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span className={`text-sm ml-1 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₹{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
          </div>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-amber-700">Running low</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-700">{item.quantity}</p>
                  <p className="text-xs text-amber-600">{item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
