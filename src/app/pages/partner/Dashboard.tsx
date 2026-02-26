import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useNavigate } from 'react-router';
import { OTPSection } from '@/app/components/partner/OTPSection';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  UserPlus, 
  ArrowRight,
  Calendar,
  Award,
  DollarSign
} from 'lucide-react';

export function PartnerDashboard() {
  const navigate = useNavigate();

  // Mock current partner data
  const partnerData = {
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    joinDate: '2024-02-05',
    totalEarnings: 45600,
    currentMonthRP: 2300,
    totalNetwork: 12,
    sponsoredPartners: 8,
    pendingPayout: 2400,
    lastPayoutDate: '25 Jan 2026',
    currentMonthEarnings: 6800,
    teamRPA: 500,
    teamRPB: 500,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Partner Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {partnerData.name}! Here's your performance overview.
        </p>
      </div>

      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {partnerData.name}!</h2>
              <p className="text-emerald-50">
                Partner since {new Date(partnerData.joinDate).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-emerald-50 text-sm">Total Earnings (All Time)</p>
              <p className="text-3xl font-bold mt-1">₹{partnerData.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/partner/transactions')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">This Month Earnings</p>
              <Wallet className="size-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">₹{partnerData.currentMonthEarnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">January 2026</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/partner/points')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Current Month RP</p>
              <TrendingUp className="size-5 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-teal-700">{partnerData.currentMonthRP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Business Volume</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/partner/network')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">My Network</p>
              <Users className="size-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{partnerData.totalNetwork}</p>
            <p className="text-xs text-muted-foreground mt-1">Total partners</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/partner/sponsored')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Sponsored</p>
              <UserPlus className="size-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{partnerData.sponsoredPartners}</p>
            <p className="text-xs text-muted-foreground mt-1">Direct referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* OTP Authentication Section */}
      <OTPSection />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Earnings Summary</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/partner/transactions')}
              >
                View All <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="size-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">Total Received</p>
                    <p className="text-sm text-muted-foreground">All time</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-emerald-700">₹{partnerData.totalEarnings.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="size-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-medium">Pending Payout</p>
                    <p className="text-sm text-muted-foreground">Processing</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-amber-700">₹{partnerData.pendingPayout.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="size-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">Last Payout</p>
                    <p className="text-sm text-muted-foreground">{partnerData.lastPayoutDate}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-700">₹5,600</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RP Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">RP Performance</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/partner/points')}
              >
                View Details <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Award className="size-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">Self RP</p>
                    <p className="text-sm text-muted-foreground">Current month</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-emerald-700">1,800</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="size-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">Team A RP</p>
                    <p className="text-sm text-muted-foreground">Left leg</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-700">{partnerData.teamRPA.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="size-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium">Team B RP</p>
                    <p className="text-sm text-muted-foreground">Right leg</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-green-700">{partnerData.teamRPB.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="size-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="font-medium">Matching RP</p>
                    <p className="text-sm text-muted-foreground">Min(A, B)</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-purple-700">{Math.min(partnerData.teamRPA, partnerData.teamRPB).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-emerald-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-4 flex-col gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
              onClick={() => navigate('/partner/network')}
            >
              <UserPlus className="size-6" />
              <span>Add New Partner</span>
            </Button>
            <Button 
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
              onClick={() => navigate('/partner/transactions')}
            >
              <Wallet className="size-6" />
              <span>View Transactions</span>
            </Button>
            <Button 
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
              onClick={() => navigate('/partner/sponsored')}
            >
              <Users className="size-6" />
              <span>View Sponsored Partners</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}