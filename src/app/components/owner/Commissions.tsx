import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Coins, CheckCircle2, Clock, TrendingUp, Award, Users } from 'lucide-react';
import { toast } from 'sonner';

// Month-wise commission summary data
interface MonthlyCommissionSummary {
  month: string;
  year: number;
  totalRP: number;
  totalCommission: number;
  totalMembers: number;
  status: 'Current' | 'Finalized';
}

const monthlyCommissionData: MonthlyCommissionSummary[] = [
  { month: 'January', year: 2026, totalRP: 45600, totalCommission: 182400, totalMembers: 28, status: 'Current' },
  { month: 'December', year: 2025, totalRP: 42300, totalCommission: 169200, totalMembers: 26, status: 'Finalized' },
  { month: 'November', year: 2025, totalRP: 38900, totalCommission: 155600, totalMembers: 24, status: 'Finalized' },
  { month: 'October', year: 2025, totalRP: 35200, totalCommission: 140800, totalMembers: 22, status: 'Finalized' },
  { month: 'September', year: 2025, totalRP: 31800, totalCommission: 127200, totalMembers: 20, status: 'Finalized' },
  { month: 'August', year: 2025, totalRP: 28500, totalCommission: 114000, totalMembers: 18, status: 'Finalized' },
];

export function Commissions() {
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const handleFinalizeCommission = () => {
    toast.success('Commissions Finalized', {
      description: 'Commission has been credited to wallets. RP points have been reset to zero.',
    });
  };

  // Calculate stats
  const currentMonth = monthlyCommissionData[0];
  const allTimeData = monthlyCommissionData.reduce((acc, month) => ({
    totalPaid: acc.totalPaid + (month.status === 'Finalized' ? month.totalCommission : 0),
    totalRP: acc.totalRP + month.totalRP,
  }), { totalPaid: 0, totalRP: 0 });

  // Filter data by month
  const filteredData = monthFilter === 'all' 
    ? monthlyCommissionData 
    : monthlyCommissionData.filter(d => `${d.month} ${d.year}` === monthFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Commission Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage monthly commissions for partners and agents</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <CheckCircle2 className="h-4 w-4" />
              Finalize This Month
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finalize Monthly Commission?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                <div>This action will:</div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Calculate commission for all partners based on their RP points</li>
                  <li>Credit commission amounts to partner wallets</li>
                  <li>Reset all RP points to zero for the new month</li>
                  <li>Send notification to all partners</li>
                </ul>
                <div className="text-red-600 font-semibold pt-2">This action cannot be undone. Continue?</div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinalizeCommission}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Finalize Commission
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins className="h-4 w-4 text-emerald-600" />
              Expected Payout (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-emerald-700">
              ₹{currentMonth.totalCommission.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonth.totalMembers} members • {currentMonth.totalRP.toLocaleString()} RP
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              All Time Paid Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-blue-700">
              ₹{allTimeData.totalPaid.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total finalized commissions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              All Time RP Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-purple-700">
              {allTimeData.totalRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total RP across all months
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              This Month RP Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-amber-700">
              {currentMonth.totalRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active in {currentMonth.month} {currentMonth.year}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Commission Summary Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                Monthly Commission Summary
              </CardTitle>
              <CardDescription>Month-wise commission breakdown and history</CardDescription>
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {monthlyCommissionData.map((data) => (
                  <SelectItem key={`${data.month}-${data.year}`} value={`${data.month} ${data.year}`}>
                    {data.month} {data.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Total RP</TableHead>
                  <TableHead className="text-right">Total Commission</TableHead>
                  <TableHead className="text-right">Total Members</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((data, index) => (
                  <TableRow 
                    key={`${data.month}-${data.year}`}
                    className={index === 0 && monthFilter === 'all' ? 'bg-emerald-50/50' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {data.month} {data.year}
                        {index === 0 && monthFilter === 'all' && (
                          <Badge variant="outline" className="border-emerald-600 text-emerald-700 bg-emerald-50">
                            Current
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                        {data.totalRP.toLocaleString()} RP
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      ₹{data.totalCommission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {data.totalMembers}
                      </span>
                    </TableCell>
                    <TableCell>
                      {data.status === 'Current' ? (
                        <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
                          <Clock className="h-3 w-3" />
                          Current
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Finalized
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredData.map((data, index) => (
              <Card 
                key={`${data.month}-${data.year}`}
                className={index === 0 && monthFilter === 'all' ? 'border-emerald-200 bg-emerald-50/30' : ''}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-base">
                      {data.month} {data.year}
                    </div>
                    {data.status === 'Current' ? (
                      <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
                        <Clock className="h-3 w-3" />
                        Current
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Finalized
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total RP</p>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                        {data.totalRP.toLocaleString()} RP
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Members</p>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {data.totalMembers}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Total Commission</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        ₹{data.totalCommission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How Commission Works */}
      <Card className="shadow-lg border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-emerald-900">How Commission Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-emerald-800">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</div>
            <p>Partners earn RP (Business Value) points with each sale they generate</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</div>
            <p>Commission is calculated monthly based on total RP points accumulated</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</div>
            <p>After finalization, commission is credited to wallets and RP points reset to zero</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</div>
            <p>Partners can withdraw from their wallet or use it for purchases</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}