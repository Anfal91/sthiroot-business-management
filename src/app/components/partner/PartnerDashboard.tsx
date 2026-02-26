import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Wallet, Coins, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export function PartnerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Partner Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your performance and earnings</p>
      </div>

      {/* Wallet & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹45,000</p>
            <Button variant="secondary" size="sm" className="mt-3">
              Withdraw
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-600">
              <Coins className="h-5 w-5" />
              Total RP Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">12,500</p>
            <p className="text-sm text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              This Month RP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">3,200</p>
            <p className="text-sm text-muted-foreground mt-1">Current month points</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
              <Users className="h-5 w-5" />
              My Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">24</p>
            <p className="text-sm text-muted-foreground mt-1">Active partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Sponsor ID Usage */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sponsor ID Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sponsored Users</span>
              <span className="font-semibold">24 / ∞</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Your Sponsor ID: P001</p>
              <p className="text-sm text-emerald-700 mt-1">Share this ID with new partners to add them to your network</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Commissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { date: 'Jan 10, 2026', amount: 1200, rp: 300 },
              { date: 'Jan 08, 2026', amount: 800, rp: 200 },
              { date: 'Jan 05, 2026', amount: 1500, rp: 375 },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.rp} RP Points</p>
                </div>
                <p className="text-lg font-semibold text-emerald-600">+₹{item.amount}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Network Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { user: 'Kavita Singh', action: 'Generated 210 RP', time: '2 hours ago' },
              { user: 'Suresh Patel', action: 'Generated 180 RP', time: '5 hours ago' },
              { user: 'Amit Kumar', action: 'New partner joined', time: '1 day ago' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{item.user}</p>
                  <p className="text-sm text-muted-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-900">Progress to Next Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Current: Level 5</span>
              <span className="font-semibold text-purple-900">3,200 / 5,000 RP</span>
            </div>
            <Progress value={64} className="h-3 bg-purple-200" />
          </div>
          <p className="text-sm text-purple-700">
            Earn 1,800 more RP points this month to reach Level 6 and unlock higher commission rates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
