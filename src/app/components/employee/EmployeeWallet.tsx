import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Wallet, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Upload, Eye, History, Smartphone, QrCode, Building2, Copy, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { mockWallets, mockWithdrawRequests, mockWalletTransactions, mockReportedTransactions, mockTopUpRequests } from '../../data/walletMockData';
import { getActivePaymentMethods } from '../../../data/mockPaymentMethods';
import { useAuth } from '../../contexts/AuthContext';
import { copyToClipboard } from '../../utils/clipboard';
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

const EMPLOYEE_ID = 'EMP-001'; // Current logged-in employee

export function EmployeeWallet() {
  const { user } = useAuth();
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openTopUp, setOpenTopUp] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [reportingTransaction, setReportingTransaction] = useState<any>(null);
  
  // Date filter state for transaction history
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date('2020-01-01'),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');

  // Top-Up Request Form (for Partner and Store only)
  const [topUpForm, setTopUpForm] = useState({
    amount: '',
    transactionId: '',
    transactionDate: '',
    notes: '',
    screenshot: null as File | null,
  });

  // Withdraw Request Form
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    paymentMethod: 'upi',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    notes: '',
  });

  // Report Transaction Form
  const [reportForm, setReportForm] = useState({
    transactionId: '',
    reason: '',
    details: '',
    expectedAmount: '',
  });

  // Check if user can request top-up (Partner or Store, not Employee)
  const canRequestTopUp = user?.role === 'partner' || user?.role === 'store-owner';

  // Get employee's wallet
  const employeeWallet = mockWallets.find(w => w.userId === EMPLOYEE_ID);
  
  // Get employee's transactions
  const employeeTransactions = mockWalletTransactions.filter(t => t.userId === EMPLOYEE_ID);
  
  // Get employee's withdraw requests
  const employeeWithdrawRequests = mockWithdrawRequests.filter(r => r.userId === EMPLOYEE_ID);
  
  // Get employee's top-up requests (for partner/store)
  const employeeTopUpRequests = mockTopUpRequests.filter(r => r.userId === EMPLOYEE_ID);
  
  // Get employee's reports
  const employeeReports = mockReportedTransactions.filter(r => r.userId === EMPLOYEE_ID);

  const handleTopUpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topUpForm.amount || parseFloat(topUpForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!topUpForm.transactionId || !topUpForm.transactionDate) {
      toast.error('Please provide transaction ID and date');
      return;
    }

    if (!topUpForm.screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    console.log('Top-up request:', topUpForm);
    toast.success('Top-up request submitted successfully! Accountant will review it shortly.');
    setOpenTopUp(false);
    setTopUpForm({
      amount: '',
      transactionId: '',
      transactionDate: '',
      notes: '',
      screenshot: null,
    });
  };

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawForm.amount) > (employeeWallet?.balance || 0)) {
      toast.error('Insufficient wallet balance');
      return;
    }

    if (withdrawForm.paymentMethod === 'upi' && !withdrawForm.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (withdrawForm.paymentMethod === 'bank' && (!withdrawForm.bankAccount || !withdrawForm.ifscCode)) {
      toast.error('Please enter bank details');
      return;
    }

    console.log('Withdraw request:', withdrawForm);
    toast.success('Withdraw request submitted successfully! You will be notified once processed.');
    setOpenWithdraw(false);
    setWithdrawForm({
      amount: '',
      paymentMethod: 'upi',
      upiId: '',
      bankAccount: '',
      ifscCode: '',
      notes: '',
    });
  };

  const handleReportTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportForm.transactionId || !reportForm.reason || !reportForm.details) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Report transaction:', reportForm);
    toast.success('Transaction reported successfully! Our team will review it shortly.');
    setOpenReport(false);
    setReportForm({
      transactionId: '',
      reason: '',
      details: '',
      expectedAmount: '',
    });
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

  // Filter transactions by date range
  const filteredTransactions = employeeTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.transactionDate);
    return isWithinInterval(transactionDate, {
      start: dateRange.from,
      end: dateRange.to || endOfDay(new Date()),
    });
  });

  return (
    <div className="space-y-6">
      {/* Report Transaction Dialog */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Report a Transaction Issue</DialogTitle>
            <DialogDescription>
              {reportingTransaction ? (
                <>Report issue for transaction <span className="font-mono font-semibold">{reportingTransaction.transactionNumber}</span></>
              ) : (
                'Report if you haven\'t received money or found an issue'
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportTransaction} className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Number *</Label>
              <Input
                value={reportForm.transactionId}
                onChange={(e) => setReportForm({ ...reportForm, transactionId: e.target.value })}
                placeholder="e.g., TXN-002"
                readOnly={!!reportingTransaction}
                className={reportingTransaction ? 'bg-gray-50' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Transaction Amount *</Label>
              <Input
                type="number"
                value={reportForm.expectedAmount}
                onChange={(e) => setReportForm({ ...reportForm, expectedAmount: e.target.value })}
                placeholder="3000"
                required
              />
              <p className="text-xs text-muted-foreground">Enter the expected or disputed amount</p>
            </div>

            <div className="space-y-2">
              <Label>Issue Type *</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={reportForm.reason}
                onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                required
              >
                <option value="">Select issue type</option>
                <option value="Amount not received">Amount not received</option>
                <option value="Incorrect amount credited">Incorrect amount credited</option>
                <option value="Duplicate transaction">Duplicate transaction</option>
                <option value="Other issue">Other issue</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Details *</Label>
              <Textarea
                value={reportForm.details}
                onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                placeholder="Please describe the issue in detail..."
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setOpenReport(false);
                setReportingTransaction(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-red-600 to-orange-600">
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Manage your digital wallet and transactions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openWithdraw} onOpenChange={setOpenWithdraw}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <ArrowDownCircle className="h-4 w-4" />
                Withdraw Money
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Withdraw Money</DialogTitle>
                <DialogDescription>Request to withdraw money from your wallet</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{employeeWallet?.balance.toLocaleString() || '0'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Withdrawal Amount *</Label>
                  <Input
                    type="number"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    placeholder="Enter amount"
                    max={employeeWallet?.balance || 0}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={withdrawForm.paymentMethod}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, paymentMethod: e.target.value })}
                    required
                  >
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                {withdrawForm.paymentMethod === 'upi' ? (
                  <div className="space-y-2">
                    <Label>UPI ID *</Label>
                    <Input
                      value={withdrawForm.upiId}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, upiId: e.target.value })}
                      placeholder="yourname@paytm"
                      required={withdrawForm.paymentMethod === 'upi'}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Bank Account Number *</Label>
                      <Input
                        value={withdrawForm.bankAccount}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, bankAccount: e.target.value })}
                        placeholder="123456789012"
                        required={withdrawForm.paymentMethod === 'bank'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code *</Label>
                      <Input
                        value={withdrawForm.ifscCode}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, ifscCode: e.target.value })}
                        placeholder="HDFC0001234"
                        required={withdrawForm.paymentMethod === 'bank'}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={withdrawForm.notes}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, notes: e.target.value })}
                    placeholder="Add any notes..."
                    rows={2}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenWithdraw(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {canRequestTopUp && (
            <Dialog open={openTopUp} onOpenChange={setOpenTopUp}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <ArrowUpCircle className="h-4 w-4" />
                  Top-Up Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Top-Up Wallet</DialogTitle>
                  <DialogDescription>Pay to one of our payment methods and submit proof</DialogDescription>
                </DialogHeader>
                
                <div className="overflow-y-auto flex-1 px-1">
                  {/* Payment Methods Section */}
                  <div className="mb-6 space-y-3">
                    <h3 className="font-semibold text-gray-900">Pay to One of Our Payment Methods:</h3>
                    {getActivePaymentMethods().map((method) => (
                      <div
                        key={method.id}
                        className="p-4 border-2 border-emerald-200 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            method.type === 'upi' ? 'bg-purple-100 text-purple-600' :
                            method.type === 'qr' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {method.type === 'upi' && <Smartphone className="h-5 w-5" />}
                            {method.type === 'qr' && <QrCode className="h-5 w-5" />}
                            {method.type === 'bank' && <Building2 className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            <div className="mt-2 space-y-2">
                              {method.type === 'upi' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">UPI ID:</span>
                                  <span className="text-sm font-semibold text-gray-900">{method.details.upiId}</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2"
                                    onClick={async () => {
                                      const success = await copyToClipboard(method.details.upiId || '');
                                      if (success) {
                                        toast.success('UPI ID copied!');
                                      } else {
                                        toast.error('Failed to copy UPI ID');
                                      }
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                              {method.type === 'qr' && (
                                <div>
                                  <img 
                                    src={method.details.qrImage} 
                                    alt={method.name} 
                                    className="w-32 h-32 border border-gray-200 rounded-lg"
                                  />
                                </div>
                              )}
                              {method.type === 'bank' && (
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">Account:</span>
                                    <div className="font-semibold text-gray-900 flex items-center gap-1">
                                      {method.details.accountNumber}
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 px-1"
                                        onClick={async () => {
                                          const success = await copyToClipboard(method.details.accountNumber || '');
                                          if (success) {
                                            toast.success('Account number copied!');
                                          } else {
                                            toast.error('Failed to copy account number');
                                          }
                                        }}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">IFSC:</span>
                                    <div className="font-semibold text-gray-900 flex items-center gap-1">
                                      {method.details.ifscCode}
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 px-1"
                                        onClick={async () => {
                                          const success = await copyToClipboard(method.details.ifscCode || '');
                                          if (success) {
                                            toast.success('IFSC code copied!');
                                          } else {
                                            toast.error('Failed to copy IFSC code');
                                          }
                                        }}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-600">Account Name:</span>
                                    <div className="font-semibold text-gray-900">{method.details.accountName}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Bank:</span>
                                    <div className="font-semibold text-gray-900">{method.details.bankName}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Branch:</span>
                                    <div className="font-semibold text-gray-900">{method.details.branch}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form Section */}
                  <form onSubmit={handleTopUpRequest} className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{employeeWallet?.balance.toLocaleString() || '0'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Top-Up Amount *</Label>
                      <Input
                        type="number"
                        value={topUpForm.amount}
                        onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Transaction ID *</Label>
                      <Input
                        value={topUpForm.transactionId}
                        onChange={(e) => setTopUpForm({ ...topUpForm, transactionId: e.target.value })}
                        placeholder="Enter transaction ID"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Transaction Date *</Label>
                      <Input
                        type="date"
                        value={topUpForm.transactionDate}
                        onChange={(e) => setTopUpForm({ ...topUpForm, transactionDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Screenshot *</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTopUpForm({ ...topUpForm, screenshot: e.target.files?.[0] || null })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={topUpForm.notes}
                        onChange={(e) => setTopUpForm({ ...topUpForm, notes: e.target.value })}
                        placeholder="Add any notes..."
                        rows={2}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpenTopUp(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="shadow-lg border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-2">Total Balance</p>
              <p className="text-4xl font-bold text-emerald-600">
                ₹{employeeWallet?.balance.toLocaleString() || '0'}
              </p>
            </div>
            <Wallet className="h-16 w-16 text-emerald-600 opacity-50" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-200">
            <div>
              <p className="text-xs text-muted-foreground">Total Received</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{employeeWallet?.totalReceived.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Withdrawn</p>
              <p className="text-lg font-semibold text-orange-600">
                ₹{employeeWallet?.totalWithdraw.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className="mt-1">{employeeWallet?.status || 'Active'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className={`grid w-full ${canRequestTopUp ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="transactions" className="gap-2">
            <History className="h-4 w-4" />
            Transaction History
          </TabsTrigger>
          {canRequestTopUp && (
            <TabsTrigger value="topups" className="gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Top-Up Requests
            </TabsTrigger>
          )}
          <TabsTrigger value="withdrawals" className="gap-2">
            <ArrowDownCircle className="h-4 w-4" />
            Withdrawal Requests
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reported Issues
          </TabsTrigger>
        </TabsList>

        {/* Transaction History */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Date Filter */}
              <div className="mb-6 flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
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

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.transactionNumber}</TableCell>
                      <TableCell>
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${
                          transaction.type === 'Received' || transaction.type === 'Refund' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'Received' || transaction.type === 'Refund' ? '+' : '-'}
                          ₹{transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{transaction.balanceAfter.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === 'Completed' ? 'default' :
                            transaction.status === 'Reported' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => {
                            setReportingTransaction(transaction);
                            setReportForm({
                              transactionId: transaction.transactionNumber,
                              reason: '',
                              details: '',
                              expectedAmount: transaction.amount.toString(),
                            });
                            setOpenReport(true);
                          }}
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top-Up Requests */}
        {canRequestTopUp && (
          <TabsContent value="topups">
            <Card>
              <CardHeader>
                <CardTitle>Top-Up Requests</CardTitle>
                <CardDescription>Track your top-up requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request #</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeTopUpRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestNumber}</TableCell>
                        <TableCell>
                          {new Date(request.requestedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{request.requestedAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {request.transactionId}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'Processed' ? 'default' :
                              request.status === 'Rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {request.rejectionReason || request.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Withdrawal Requests */}
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>Track your withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request #</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeWithdrawRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requestNumber}</TableCell>
                      <TableCell>
                        {new Date(request.requestedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{request.requestedAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {request.upiId || `${request.bankAccountNumber}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === 'Processed' ? 'default' :
                            request.status === 'Rejected' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {request.rejectionReason || request.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Issues */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reported Transaction Issues</CardTitle>
              <CardDescription>Track reported transaction issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report #</TableHead>
                    <TableHead>Transaction #</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{report.transactionNumber}</TableCell>
                      <TableCell>
                        {new Date(report.reportedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{report.reportReason}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{report.expectedAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'Resolved' ? 'default' :
                            report.status === 'Rejected' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}