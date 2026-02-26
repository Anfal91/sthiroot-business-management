import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
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
import { Coins, Search, CheckCircle2, Clock } from 'lucide-react';
import { mockCommissions } from '../../data/mockData';
import { toast } from 'sonner';

export function Commissions() {
  const [search, setSearch] = useState('');

  const handleFinalizeCommission = () => {
    toast.success('Commissions Finalized', {
      description: 'Commission has been credited to wallets. RP points have been reset to zero.',
    });
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">₹28,400</p>
            <p className="text-sm text-muted-foreground mt-1">2 partners awaiting payout</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">₹145,200</p>
            <p className="text-sm text-muted-foreground mt-1">18 partners paid</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total RP Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">7,100</p>
            <p className="text-sm text-muted-foreground mt-1">Active this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                Commission History
              </CardTitle>
              <CardDescription>Track and manage commission payouts</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">RP Points</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">{commission.id}</TableCell>
                  <TableCell>{commission.agent}</TableCell>
                  <TableCell className="text-muted-foreground">{commission.month}</TableCell>
                  <TableCell className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {commission.rpPoints} RP
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">
                    ₹{commission.commission.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {commission.status === 'Pending' ? (
                      <Badge variant="outline" className="gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Finalized
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {commission.status === 'Pending' && (
                      <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                        Process
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <p>Partners earn RP (Rewards Points) points with each sale they generate</p>
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