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
import { Wallet, ArrowUpCircle, ArrowDownCircle, Send, AlertTriangle, CheckCircle, XCircle, Eye, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { mockTopUpRequests, mockWithdrawRequests, mockReportedTransactions, mockWallets } from '../../data/walletMockData';

export function AccountantWallet() {
  const [selectedTopUp, setSelectedTopUp] = useState<any>(null);
  const [selectedWithdraw, setSelectedWithdraw] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [openSendMoney, setOpenSendMoney] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifiedRecipient, setVerifiedRecipient] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Withdrawal Approval Form State
  const [withdrawApprovalForm, setWithdrawApprovalForm] = useState({
    transactionId: '',
    transactionDate: '',
    screenshot: null as File | null,
  });

  // Send Money Form State
  const [sendMoneyForm, setSendMoneyForm] = useState({
    recipientType: 'Partner',
    recipientId: '',
    amount: '',
    transferType: 'Reward',
    notes: '',
  });

  const handleApproveTopUp = (request: any) => {
    console.log('Approving top-up:', request);
    toast.success(`Top-up request ${request.requestNumber} approved! WhatsApp notification sent.`);
    setSelectedTopUp(null);
  };

  const handleRejectTopUp = (request: any) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    console.log('Rejecting top-up:', request, rejectionReason);
    toast.success(`Top-up request ${request.requestNumber} rejected. WhatsApp notification sent.`);
    setSelectedTopUp(null);
    setRejectionReason('');
  };

  const handleApproveWithdraw = (request: any) => {
    if (!withdrawApprovalForm.transactionId || !withdrawApprovalForm.transactionDate || !withdrawApprovalForm.screenshot) {
      toast.error('Please provide transaction ID, date, and payment screenshot');
      return;
    }
    console.log('Approving withdraw:', request, withdrawApprovalForm);
    toast.success(`Withdraw request ${request.requestNumber} approved! Payment details recorded.`);
    setSelectedWithdraw(null);
    setWithdrawApprovalForm({
      transactionId: '',
      transactionDate: '',
      screenshot: null,
    });
  };

  const handleRejectWithdraw = (request: any) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    console.log('Rejecting withdraw:', request, rejectionReason);
    toast.success(`Withdraw request ${request.requestNumber} rejected. Notification sent.`);
    setSelectedWithdraw(null);
    setRejectionReason('');
  };

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifiedRecipient) {
      toast.error('Please verify the recipient before sending money');
      return;
    }
    
    console.log('Sending money:', sendMoneyForm, 'to', verifiedRecipient);
    toast.success('Money sent successfully! Wallet updated.');
    setOpenSendMoney(false);
    setSendMoneyForm({
      recipientType: 'Partner',
      recipientId: '',
      amount: '',
      transferType: 'Reward',
      notes: '',
    });
    setVerifiedRecipient(null);
  };

  const handleVerifyRecipient = () => {
    if (!sendMoneyForm.recipientId) {
      toast.error('Please enter recipient ID');
      return;
    }

    setIsVerifying(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Find recipient in mockWallets
      const recipient = mockWallets.find(w => w.userCode === sendMoneyForm.recipientId.toUpperCase());
      
      if (!recipient) {
        toast.error('Recipient not found! Please check the ID.');
        setVerifiedRecipient(null);
        setIsVerifying(false);
        return;
      }

      // Check if recipient type matches
      if (recipient.userType !== sendMoneyForm.recipientType) {
        toast.error(`Recipient type mismatch! ${sendMoneyForm.recipientId} is a ${recipient.userType}, not ${sendMoneyForm.recipientType}.`);
        setVerifiedRecipient(null);
        setIsVerifying(false);
        return;
      }

      setVerifiedRecipient(recipient);
      toast.success('Recipient verified successfully!');
      setIsVerifying(false);
    }, 500);
  };

  const handleResolveReport = (report: any, resolution: string) => {
    console.log('Resolving report:', report, resolution);
    toast.success(`Report ${report.reportNumber} resolved!`);
    setSelectedReport(null);
  };

  const pendingTopUps = mockTopUpRequests.filter(r => r.status === 'Pending');
  const pendingWithdraws = mockWithdrawRequests.filter(r => r.status === 'Pending');
  const pendingReports = mockReportedTransactions.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Wallet Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage wallet requests and transactions</p>
        </div>
        <Dialog open={openSendMoney} onOpenChange={setOpenSendMoney}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full md:w-auto">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send Money</span>
              <span className="sm:hidden">Send</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Send Money to Wallet</DialogTitle>
              <DialogDescription>Transfer money directly to partner, employee, or store wallet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recipient Type *</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={sendMoneyForm.recipientType}
                    onChange={(e) => {
                      setSendMoneyForm({ ...sendMoneyForm, recipientType: e.target.value });
                      setVerifiedRecipient(null); // Reset verification when type changes
                    }}
                    required
                  >
                    <option value="Partner">Partner</option>
                    <option value="Employee">Employee</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Recipient ID *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={sendMoneyForm.recipientId}
                      onChange={(e) => {
                        setSendMoneyForm({ ...sendMoneyForm, recipientId: e.target.value });
                        setVerifiedRecipient(null); // Reset verification when ID changes
                      }}
                      placeholder="e.g., P001, E001, S001"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyRecipient}
                      disabled={isVerifying || !sendMoneyForm.recipientId}
                      className="whitespace-nowrap"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recipient Verification Result */}
              {verifiedRecipient && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-900">Recipient Verified</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium text-gray-900">{verifiedRecipient.userName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium text-gray-900">
                            <Badge variant="outline" className="ml-1">{verifiedRecipient.userType}</Badge>
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <p className="font-medium text-gray-900">{verifiedRecipient.userCode}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Balance:</span>
                          <p className="font-medium text-emerald-600">₹{verifiedRecipient.balance.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    value={sendMoneyForm.amount}
                    onChange={(e) => setSendMoneyForm({ ...sendMoneyForm, amount: e.target.value })}
                    placeholder="10000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transfer Type *</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={sendMoneyForm.transferType}
                    onChange={(e) => setSendMoneyForm({ ...sendMoneyForm, transferType: e.target.value })}
                    required
                  >
                    <option value="Reward">Reward</option>
                    <option value="Incentive">Incentive</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Refund">Refund</option>
                    <option value="Adjustment">Adjustment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={sendMoneyForm.notes}
                  onChange={(e) => setSendMoneyForm({ ...sendMoneyForm, notes: e.target.value })}
                  placeholder="Add any notes or comments..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenSendMoney(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  Send Money
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Top-Ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingTopUps.length}</div>
              <ArrowUpCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdraws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingWithdraws.length}</div>
              <ArrowDownCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reported Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingReports.length}</div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockWallets.filter(w => w.status === 'Active').length}</div>
              <Wallet className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="topup" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-max md:min-w-0">
            <TabsTrigger value="topup" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
              <ArrowUpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Top-Up</span>
              <span className="sm:hidden">Top-Up</span>
              {pendingTopUps.length > 0 && (
                <Badge variant="destructive" className="ml-1 md:ml-2 text-xs">{pendingTopUps.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
              <ArrowDownCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Withdraw</span>
              <span className="sm:hidden">Withdraw</span>
              {pendingWithdraws.length > 0 && (
                <Badge variant="destructive" className="ml-1 md:ml-2 text-xs">{pendingWithdraws.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reported" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Reported</span>
              <span className="sm:hidden">Reports</span>
              {pendingReports.length > 0 && (
                <Badge variant="destructive" className="ml-1 md:ml-2 text-xs">{pendingReports.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Wallets</span>
              <span className="sm:hidden">Wallets</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Top-Up Requests Tab */}
        <TabsContent value="topup">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Top-Up Requests</CardTitle>
              <CardDescription className="text-sm">Review and approve wallet top-up requests from partners and stores</CardDescription>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Request #</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">Type</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell whitespace-nowrap">Transaction ID</TableHead>
                      <TableHead className="hidden lg:table-cell whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTopUpRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-xs text-muted-foreground">{request.userCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{request.userType}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">₹{request.amount.toLocaleString()}</TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">{request.transactionId}</TableCell>
                        <TableCell className="hidden lg:table-cell">{new Date(request.transactionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'Approved' ? 'default' :
                              request.status === 'Rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedTopUp(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Top-Up Request Details</DialogTitle>
                                <DialogDescription>Request #{request.requestNumber}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">User</Label>
                                    <p className="font-medium">{request.userName} ({request.userCode})</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Amount</Label>
                                    <p className="text-2xl font-bold text-emerald-600">₹{request.amount.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">Transaction ID</Label>
                                    <p className="font-mono text-sm">{request.transactionId}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Transaction Date</Label>
                                    <p>{new Date(request.transactionDate).toLocaleString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Notes</Label>
                                  <p>{request.notes}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Payment Screenshot</Label>
                                  <div className="mt-2 border rounded-lg p-4 bg-muted text-center">
                                    <p className="text-sm text-muted-foreground">Screenshot: {request.paymentScreenshot}</p>
                                  </div>
                                </div>
                                {request.status === 'Pending' && (
                                  <>
                                    <div className="space-y-2">
                                      <Label>Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Provide reason for rejection..."
                                        rows={2}
                                      />
                                    </div>
                                    <DialogFooter className="gap-2">
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRejectTopUp(request)}
                                        className="gap-2"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleApproveTopUp(request)}
                                        className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Approve & Credit
                                      </Button>
                                    </DialogFooter>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdraw Requests Tab */}
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Withdraw Requests</CardTitle>
              <CardDescription className="text-sm">Process withdrawal requests from partners, employees, and stores</CardDescription>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Request #</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">Type</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell whitespace-nowrap">Payment Details</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWithdrawRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requestNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-xs text-muted-foreground">{request.userCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{request.userType}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">₹{request.requestedAmount.toLocaleString()}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs">
                          {request.upiId || `${request.bankAccountNumber} (${request.ifscCode})`}
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
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedWithdraw(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Withdraw Request Details</DialogTitle>
                                <DialogDescription>Request #{request.requestNumber}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">User</Label>
                                    <p className="font-medium">{request.userName} ({request.userCode})</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Amount</Label>
                                    <p className="text-2xl font-bold text-orange-600">₹{request.requestedAmount.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Payment Method</Label>
                                  {request.upiId ? (
                                    <p>UPI: <span className="font-medium">{request.upiId}</span></p>
                                  ) : (
                                    <div>
                                      <p>Bank Account: <span className="font-medium">{request.bankAccountNumber}</span></p>
                                      <p>IFSC Code: <span className="font-medium">{request.ifscCode}</span></p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Notes</Label>
                                  <p>{request.notes}</p>
                                </div>
                                {request.status === 'Pending' && (
                                  <>
                                    <div className="border-t pt-4 mt-4">
                                      <h4 className="font-semibold text-emerald-600 mb-3">Approval Information</h4>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        Please provide payment details after processing the withdrawal manually
                                      </p>
                                      
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Transaction ID *</Label>
                                          <Input
                                            value={withdrawApprovalForm.transactionId}
                                            onChange={(e) => setWithdrawApprovalForm({ ...withdrawApprovalForm, transactionId: e.target.value })}
                                            placeholder="e.g., UTR123456789"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Transaction Date *</Label>
                                          <Input
                                            type="date"
                                            value={withdrawApprovalForm.transactionDate}
                                            onChange={(e) => setWithdrawApprovalForm({ ...withdrawApprovalForm, transactionDate: e.target.value })}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Payment Screenshot *</Label>
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <input
                                              type="file"
                                              id="withdraw-screenshot"
                                              accept="image/*"
                                              onChange={(e) => setWithdrawApprovalForm({ ...withdrawApprovalForm, screenshot: e.target.files?.[0] || null })}
                                              className="hidden"
                                            />
                                            <label htmlFor="withdraw-screenshot" className="flex flex-col items-center gap-2 cursor-pointer">
                                              <Upload className="h-8 w-8 text-muted-foreground" />
                                              <p className="text-sm text-muted-foreground">
                                                {withdrawApprovalForm.screenshot ? withdrawApprovalForm.screenshot.name : 'Click to upload payment screenshot'}
                                              </p>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border-t pt-4">
                                      <div className="space-y-2">
                                        <Label>Rejection Reason (if rejecting)</Label>
                                        <Textarea
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          placeholder="Provide reason for rejection..."
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter className="gap-2 flex-col sm:flex-row">
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRejectWithdraw(request)}
                                        className="gap-2 w-full sm:w-auto"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleApproveWithdraw(request)}
                                        className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 w-full sm:w-auto"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Approve & Process
                                      </Button>
                                    </DialogFooter>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Transactions Tab */}
        <TabsContent value="reported">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Reported Transactions</CardTitle>
              <CardDescription className="text-sm">Review and resolve reported transaction issues</CardDescription>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Report #</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="hidden lg:table-cell whitespace-nowrap">Transaction #</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">Reason</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReportedTransactions.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.reportNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.userName}</p>
                            <p className="text-xs text-muted-foreground">{report.userCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">{report.transactionNumber}</TableCell>
                        <TableCell className="text-right font-semibold">₹{report.expectedAmount.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">{report.reportReason}</TableCell>
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
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Reported Transaction Details</DialogTitle>
                                <DialogDescription>Report #{report.reportNumber}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">User</Label>
                                    <p className="font-medium">{report.userName} ({report.userCode})</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Expected Amount</Label>
                                    <p className="text-2xl font-bold text-red-600">₹{report.expectedAmount.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Transaction Number</Label>
                                  <p className="font-mono">{report.transactionNumber}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Report Reason</Label>
                                  <p className="font-medium">{report.reportReason}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Details</Label>
                                  <p className="text-sm">{report.reportDetails}</p>
                                </div>
                                {report.status === 'Pending' && (
                                  <DialogFooter className="gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleResolveReport(report, 'Under Review')}
                                    >
                                      Mark Under Review
                                    </Button>
                                    <Button
                                      onClick={() => handleResolveReport(report, 'Resolved')}
                                      className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Resolve & Credit
                                    </Button>
                                  </DialogFooter>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Wallets Tab */}
        <TabsContent value="wallets">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">All Wallets</CardTitle>
              <CardDescription className="text-sm">View all user wallets and their balances</CardDescription>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Wallet ID</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">Type</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Balance</TableHead>
                      <TableHead className="hidden lg:table-cell text-right whitespace-nowrap">Total Top-Up</TableHead>
                      <TableHead className="hidden lg:table-cell text-right whitespace-nowrap">Total Withdraw</TableHead>
                      <TableHead className="hidden xl:table-cell text-right whitespace-nowrap">Total Received</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWallets.map((wallet) => (
                      <TableRow key={wallet.id}>
                        <TableCell className="font-medium">{wallet.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{wallet.userName}</p>
                            <p className="text-xs text-muted-foreground">{wallet.userCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{wallet.userType}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          ₹{wallet.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                          ₹{wallet.totalTopUp.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                          ₹{wallet.totalWithdraw.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-right text-muted-foreground">
                          ₹{wallet.totalReceived.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={wallet.status === 'Active' ? 'default' : 'destructive'}
                          >
                            {wallet.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}