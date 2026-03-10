import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Store,
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface KYCSubmission {
  id: string;
  userType: 'Store' | 'Partner' | 'Employee';
  name: string;
  email: string;
  phone: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  aadharFront?: string;
  aadharBack?: string;
  panCard?: string;
  photo?: string;
  city: string;
  state: string;
  address: string;
  age?: number;
  gender?: string;
  panNumber?: string;
  aadharNumber?: string;
  rejectionMessage?: string;
  storeName?: string;
  ownerName?: string;
  gstNumber?: string;
}

// Mock data - In production, this would come from an API
const mockKYCSubmissions: KYCSubmission[] = [
  {
    id: 'KYC-001',
    userType: 'Partner',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@sthiroot.com',
    phone: '+91 98765 43210',
    submittedDate: '2026-03-08',
    status: 'Pending',
    aadharFront: 'https://via.placeholder.com/400x250?text=Aadhar+Front',
    aadharBack: 'https://via.placeholder.com/400x250?text=Aadhar+Back',
    panCard: 'https://via.placeholder.com/400x250?text=PAN+Card',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '123 Main Street, Andheri West',
    age: 35,
    gender: 'Male',
    panNumber: 'ABCDE1234F',
    aadharNumber: '1234 5678 9012',
  },
  {
    id: 'KYC-002',
    userType: 'Employee',
    name: 'Priya Sharma',
    email: 'priya.sharma@sthiroot.com',
    phone: '+91 98765 43211',
    submittedDate: '2026-03-07',
    status: 'Pending',
    aadharFront: 'https://via.placeholder.com/400x250?text=Aadhar+Front',
    aadharBack: 'https://via.placeholder.com/400x250?text=Aadhar+Back',
    panCard: 'https://via.placeholder.com/400x250?text=PAN+Card',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    city: 'Delhi',
    state: 'Delhi',
    address: '456 Park Avenue, Connaught Place',
    age: 28,
    gender: 'Female',
    panNumber: 'FGHIJ5678K',
    aadharNumber: '9876 5432 1098',
  },
  {
    id: 'KYC-003',
    userType: 'Store',
    name: 'Health Plus Pharmacy',
    ownerName: 'Amit Verma',
    email: 'healthplus@sthiroot.com',
    phone: '+91 98765 43212',
    submittedDate: '2026-03-06',
    status: 'Approved',
    aadharFront: 'https://via.placeholder.com/400x250?text=Aadhar+Front',
    aadharBack: 'https://via.placeholder.com/400x250?text=Aadhar+Back',
    panCard: 'https://via.placeholder.com/400x250?text=PAN+Card',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '789 MG Road, Indiranagar',
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    aadharNumber: '5555 6666 7777',
  },
  {
    id: 'KYC-004',
    userType: 'Partner',
    name: 'Suresh Patel',
    email: 'suresh.patel@sthiroot.com',
    phone: '+91 98765 43213',
    submittedDate: '2026-03-05',
    status: 'Rejected',
    aadharFront: 'https://via.placeholder.com/400x250?text=Aadhar+Front',
    aadharBack: 'https://via.placeholder.com/400x250?text=Aadhar+Back',
    panCard: 'https://via.placeholder.com/400x250?text=PAN+Card',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: '321 Gandhi Road, Navrangpura',
    age: 42,
    gender: 'Male',
    panNumber: 'KLMNO9012P',
    aadharNumber: '1111 2222 3333',
    rejectionMessage: 'Aadhar card images are blurry and unreadable. Please upload clear, high-resolution images.',
  },
];

export function KYCVerification() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>(mockKYCSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [filterUserType, setFilterUserType] = useState<'All' | 'Store' | 'Partner' | 'Employee'>('All');
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'Store':
        return <Store className="h-4 w-4" />;
      case 'Partner':
        return <Users className="h-4 w-4" />;
      case 'Employee':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || submission.status === filterStatus;
    const matchesUserType = filterUserType === 'All' || submission.userType === filterUserType;

    return matchesSearch && matchesStatus && matchesUserType;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'Pending').length,
    approved: submissions.filter(s => s.status === 'Approved').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length,
  };

  const handleViewDetails = (submission: KYCSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };

  const handleApprove = () => {
    if (!selectedSubmission) return;

    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, status: 'Approved' as const }
          : sub
      )
    );

    toast.success(`KYC approved for ${selectedSubmission.name}`);
    setIsDetailsOpen(false);
    setSelectedSubmission(null);
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedSubmission) return;

    if (!rejectionMessage.trim()) {
      toast.error('Please provide a rejection message');
      return;
    }

    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, status: 'Rejected' as const, rejectionMessage }
          : sub
      )
    );

    toast.success(`KYC rejected for ${selectedSubmission.name}`);
    setIsRejectDialogOpen(false);
    setIsDetailsOpen(false);
    setSelectedSubmission(null);
    setRejectionMessage('');
  };

  const handleImageClick = (url: string, title: string) => {
    setImagePreview({ url, title });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">Review and verify identity documents for stores, partners, and employees</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Type Filter */}
          <div>
            <Select value={filterUserType} onValueChange={(value: any) => setFilterUserType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Store">Store</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Submissions List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No KYC submissions found
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {submission.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {submission.photo ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={submission.photo} />
                            <AvatarFallback>{getInitials(submission.name)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            {getUserTypeIcon(submission.userType)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{submission.name}</p>
                          {submission.ownerName && (
                            <p className="text-xs text-muted-foreground">Owner: {submission.ownerName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="gap-1">
                        {getUserTypeIcon(submission.userType)}
                        {submission.userType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {submission.email}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {submission.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(submission.submittedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Sheet */}
      {selectedSubmission && (
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>KYC Verification Details</SheetTitle>
              <SheetDescription>Review and verify submitted documents</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                {selectedSubmission.photo ? (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedSubmission.photo} />
                    <AvatarFallback className="text-xl">{getInitials(selectedSubmission.name)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    {getUserTypeIcon(selectedSubmission.userType)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{selectedSubmission.name}</h3>
                    <Badge variant="outline" className={getStatusColor(selectedSubmission.status)}>
                      {selectedSubmission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{selectedSubmission.id}</p>
                  <Badge variant="outline" className="gap-1">
                    {getUserTypeIcon(selectedSubmission.userType)}
                    {selectedSubmission.userType}
                  </Badge>
                </div>
              </div>

              {/* Contact Details */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{selectedSubmission.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">City, State</p>
                    <p className="font-medium">{selectedSubmission.city}, {selectedSubmission.state}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Submitted Date</p>
                    <p className="font-medium">
                      {new Date(selectedSubmission.submittedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {selectedSubmission.age && (
                    <div>
                      <p className="text-muted-foreground mb-1">Age</p>
                      <p className="font-medium">{selectedSubmission.age} years</p>
                    </div>
                  )}
                  {selectedSubmission.gender && (
                    <div>
                      <p className="text-muted-foreground mb-1">Gender</p>
                      <p className="font-medium">{selectedSubmission.gender}</p>
                    </div>
                  )}
                  {selectedSubmission.gstNumber && (
                    <div>
                      <p className="text-muted-foreground mb-1">GST Number</p>
                      <p className="font-medium">{selectedSubmission.gstNumber}</p>
                    </div>
                  )}
                  {selectedSubmission.ownerName && (
                    <div>
                      <p className="text-muted-foreground mb-1">Owner Name</p>
                      <p className="font-medium">{selectedSubmission.ownerName}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{selectedSubmission.address}</p>
                </div>
              </Card>

              {/* Document Numbers */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Identity Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedSubmission.panNumber && (
                    <div>
                      <p className="text-muted-foreground mb-1">PAN Number</p>
                      <p className="font-medium font-mono">{selectedSubmission.panNumber}</p>
                    </div>
                  )}
                  {selectedSubmission.aadharNumber && (
                    <div>
                      <p className="text-muted-foreground mb-1">Aadhar Number</p>
                      <p className="font-medium font-mono">{selectedSubmission.aadharNumber}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Document Images */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Submitted Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Aadhar Front */}
                  {selectedSubmission.aadharFront && (
                    <div>
                      <Label className="mb-2 block">Aadhar Card (Front)</Label>
                      <div 
                        className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(selectedSubmission.aadharFront!, 'Aadhar Card (Front)')}
                      >
                        <img 
                          src={selectedSubmission.aadharFront} 
                          alt="Aadhar Front" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Aadhar Back */}
                  {selectedSubmission.aadharBack && (
                    <div>
                      <Label className="mb-2 block">Aadhar Card (Back)</Label>
                      <div 
                        className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(selectedSubmission.aadharBack!, 'Aadhar Card (Back)')}
                      >
                        <img 
                          src={selectedSubmission.aadharBack} 
                          alt="Aadhar Back" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* PAN Card */}
                  {selectedSubmission.panCard && (
                    <div>
                      <Label className="mb-2 block">PAN Card</Label>
                      <div 
                        className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(selectedSubmission.panCard!, 'PAN Card')}
                      >
                        <img 
                          src={selectedSubmission.panCard} 
                          alt="PAN Card" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Rejection Message (if rejected) */}
              {selectedSubmission.status === 'Rejected' && selectedSubmission.rejectionMessage && (
                <Card className="p-4 border-red-200 bg-red-50">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                      <p className="text-sm text-red-800">{selectedSubmission.rejectionMessage}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              {selectedSubmission.status === 'Pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve KYC
                  </Button>
                  <Button
                    onClick={handleRejectClick}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject KYC
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this KYC submission. The user will be able to see this message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-message">Rejection Reason *</Label>
              <Textarea
                id="rejection-message"
                placeholder="Explain why the KYC is being rejected..."
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsRejectDialogOpen(false);
              setRejectionMessage('');
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      {imagePreview && (
        <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{imagePreview.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <img 
                src={imagePreview.url} 
                alt={imagePreview.title}
                className="w-full rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
