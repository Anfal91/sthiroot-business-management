import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Store, 
  Plus, 
  MoreVertical, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Eye, 
  Power, 
  PowerOff,
  Download,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { mockStores } from '../../data/mockData';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';

// Indian States
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface StoreData {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  emailAddress: string;
  gstNumber?: string;
  fssaiNumber?: string;
  ownerName: string;
  ownerContact: string;
  aadharFrontPhoto?: File | string;
  aadharBackPhoto?: File | string;
  panDocument?: File | string;
  storeOwnerPhoto?: File | string;
  storeFrontPhoto?: File | string;
  status: 'Active' | 'Inactive';
  revenue: number;
  orders: number;
  domain?: string;
  onboardedDate: string;
}

export function Stores() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [alertDialogState, setAlertDialogState] = useState<{
    open: boolean;
    storeId: string;
    action: 'activate' | 'deactivate';
  }>({ open: false, storeId: '', action: 'activate' });

  const [formData, setFormData] = useState({
    storeName: '',
    storeState: '',
    storeCity: '',
    storeAddress: '',
    pinCode: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    emailAddress: '',
    gstNumber: '',
    fssaiNumber: '',
    storeDomain: [] as string[],
    centerType: '',
    securityDeposit: '',
    storeOwnerName: '',
    storeOwnerContact: '',
    aadharFrontPhoto: null as File | null,
    aadharBackPhoto: null as File | null,
    panDocument: null as File | null,
    storeOwnerPhoto: null as File | null,
    storeFrontPhoto: null as File | null,
    password: '',
    confirmPassword: '',
  });

  // Mock stores data with enhanced fields
  const [stores, setStores] = useState<StoreData[]>(
    mockStores.map(store => ({
      id: store.id,
      name: store.name,
      state: 'Maharashtra',
      city: 'Mumbai',
      address: '123 Main Street, Andheri West',
      phoneNumber: '9876543210',
      alternativePhoneNumber: '9876543211',
      emailAddress: `${store.id.toLowerCase()}@sthiroot.com`,
      gstNumber: '27AAAAA0000A1Z5',
      ownerName: 'Store Owner',
      ownerContact: '9876543210',
      aadharFrontPhoto: 'mock-aadhar-front.pdf',
      aadharBackPhoto: 'mock-aadhar-back.pdf',
      panDocument: 'mock-pan.pdf',
      storeOwnerPhoto: 'mock-owner-photo.jpg',
      storeFrontPhoto: 'mock-store-front.jpg',
      status: store.status as 'Active' | 'Inactive',
      revenue: store.revenue,
      orders: store.orders,
      domain: store.domain,
      onboardedDate: '2024-01-15',
    }))
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'aadharFrontPhoto' | 'aadharBackPhoto' | 'panDocument' | 'storeOwnerPhoto' | 'storeFrontPhoto', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleViewDetails = (store: StoreData) => {
    setSelectedStore(store);
    setIsViewDetailsOpen(true);
  };

  const handleToggleStatus = (storeId: string, currentStatus: 'Active' | 'Inactive') => {
    const action = currentStatus === 'Active' ? 'deactivate' : 'activate';
    setAlertDialogState({ open: true, storeId, action });
  };

  const confirmToggleStatus = () => {
    const { storeId, action } = alertDialogState;
    
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === storeId
          ? { ...store, status: action === 'activate' ? 'Active' : 'Inactive' }
          : store
      )
    );

    toast.success(
      action === 'activate'
        ? 'Store activated successfully! 🟢'
        : 'Store deactivated successfully! 🔴'
    );

    setAlertDialogState({ open: false, storeId: '', action: 'activate' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.storeDomain.length === 0) {
      toast.error('Please select at least one store category!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    // GST validation (basic format check)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (formData.gstNumber && !gstRegex.test(formData.gstNumber.toUpperCase())) {
      toast.error('Invalid GST Number format!');
      return;
    }

    // FSSAI validation (basic format check)
    const fssaiRegex = /^[0-9]{14}$/;
    if (formData.fssaiNumber && !fssaiRegex.test(formData.fssaiNumber)) {
      toast.error('Invalid FSSAI Number format!');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      toast.error('Invalid email address!');
      return;
    }

    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error('Phone number must be 10 digits!');
      return;
    }

    if (formData.alternativePhoneNumber && !/^\d{10}$/.test(formData.alternativePhoneNumber)) {
      toast.error('Alternative phone number must be 10 digits!');
      return;
    }

    if (!/^\d{10}$/.test(formData.storeOwnerContact)) {
      toast.error('Store owner contact must be 10 digits!');
      return;
    }

    // Document validation
    if (!formData.aadharFrontPhoto) {
      toast.error('Please upload Aadhar Card front photo!');
      return;
    }

    if (!formData.aadharBackPhoto) {
      toast.error('Please upload Aadhar Card back photo!');
      return;
    }

    if (!formData.panDocument) {
      toast.error('Please upload PAN Card document!');
      return;
    }

    if (!formData.storeOwnerPhoto) {
      toast.error('Please upload Store Owner photo!');
      return;
    }

    if (!formData.storeFrontPhoto) {
      toast.error('Please upload Store Front photo!');
      return;
    }

    // Mock API call
    console.log('Store Onboarding Data:', formData);
    toast.success('Store onboarded successfully! 🎉');
    
    // Reset form and close dialog
    setFormData({
      storeName: '',
      storeState: '',
      storeCity: '',
      storeAddress: '',
      pinCode: '',
      phoneNumber: '',
      alternativePhoneNumber: '',
      emailAddress: '',
      gstNumber: '',
      fssaiNumber: '',
      storeDomain: [] as string[],
      centerType: '',
      securityDeposit: '',
      storeOwnerName: '',
      storeOwnerContact: '',
      aadharFrontPhoto: null,
      aadharBackPhoto: null,
      panDocument: null,
      storeOwnerPhoto: null,
      storeFrontPhoto: null,
      password: '',
      confirmPassword: '',
    });
    setIsOnboardingOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage all your franchise stores</p>
        </div>
        <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Plus className="h-4 w-4" />
              Onboard Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="size-6 text-emerald-600" />
                Onboard New Store
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to onboard a new franchise store to your network.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Building2 className="size-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">Store Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="storeName"
                      placeholder="e.g., Sthiroot Health Center Mumbai"
                      value={formData.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeState">State <span className="text-red-500">*</span></Label>
                    <Select value={formData.storeState} onValueChange={(value) => handleInputChange('storeState', value)} required>
                      <SelectTrigger id="storeState">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeCity">City <span className="text-red-500">*</span></Label>
                    <Input
                      id="storeCity"
                      placeholder="e.g., Mumbai"
                      value={formData.storeCity}
                      onChange={(e) => handleInputChange('storeCity', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="emailAddress"
                        type="email"
                        placeholder="store@example.com"
                        className="pl-10"
                        value={formData.emailAddress}
                        onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="storeAddress">Store Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="storeAddress"
                        placeholder="Full address with landmark"
                        className="pl-10"
                        value={formData.storeAddress}
                        onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pinCode">Pin Code <span className="text-red-500">*</span></Label>
                    <Input
                      id="pinCode"
                      type="tel"
                      placeholder="6-digit pin code"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="pl-10"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternativePhoneNumber">Alternative Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="alternativePhoneNumber"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="pl-10"
                        value={formData.alternativePhoneNumber}
                        onChange={(e) => handleInputChange('alternativePhoneNumber', e.target.value)}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="gstNumber"
                        placeholder="22AAAAA0000A1Z5"
                        className="pl-10 uppercase"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fssaiNumber">FSSAI Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="fssaiNumber"
                        placeholder="14-digit FSSAI number"
                        className="pl-10"
                        value={formData.fssaiNumber}
                        onChange={(e) => handleInputChange('fssaiNumber', e.target.value)}
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Select Categories <span className="text-red-500">*</span></Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['weightloss', 'skincare', 'sleephealth', 'sexualcare'].map((category) => (
                        <div key={category} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                          <Checkbox
                            id={`category-${category}`}
                            checked={formData.storeDomain.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  storeDomain: [...prev.storeDomain, category]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  storeDomain: prev.storeDomain.filter(c => c !== category)
                                }));
                              }
                            }}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none cursor-pointer capitalize"
                          >
                            {category === 'weightloss' ? 'Weight Loss' :
                             category === 'skincare' ? 'Skin Care' :
                             category === 'sleephealth' ? 'Sleep Health' :
                             'Sexual Care'}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.storeDomain.length > 0 && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.storeDomain.length} {formData.storeDomain.length === 1 ? 'category' : 'categories'} selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="centerType">Center Type <span className="text-red-500">*</span></Label>
                    <Select value={formData.centerType} onValueChange={(value) => handleInputChange('centerType', value)} required>
                      <SelectTrigger id="centerType">
                        <SelectValue placeholder="Select center type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="hub">Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit <span className="text-red-500">*</span></Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      placeholder="Amount in INR"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Store Owner Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Store Owner Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeOwnerName">Owner Name <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="storeOwnerName"
                        placeholder="Full name as per documents"
                        className="pl-10"
                        value={formData.storeOwnerName}
                        onChange={(e) => handleInputChange('storeOwnerName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeOwnerContact">Owner Contact Number <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="storeOwnerContact"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="pl-10"
                        value={formData.storeOwnerContact}
                        onChange={(e) => handleInputChange('storeOwnerContact', e.target.value)}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="space-y-2">
                    <Label htmlFor="aadharFrontPhoto">Upload Aadhar Card Front Photo <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="aadharFrontPhoto"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('aadharFrontPhoto', e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        required
                      />
                    </div>
                    {formData.aadharFrontPhoto && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.aadharFrontPhoto.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharBackPhoto">Upload Aadhar Card Back Photo <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="aadharBackPhoto"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('aadharBackPhoto', e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        required
                      />
                    </div>
                    {formData.aadharBackPhoto && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.aadharBackPhoto.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panDocument">Upload PAN Card <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="panDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('panDocument', e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                    {formData.panDocument && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.panDocument.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeOwnerPhoto">Upload Store Owner Photo <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="storeOwnerPhoto"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('storeOwnerPhoto', e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                    {formData.storeOwnerPhoto && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.storeOwnerPhoto.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeFrontPhoto">Upload Store Front Photo <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="storeFrontPhoto"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('storeFrontPhoto', e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                    {formData.storeFrontPhoto && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {formData.storeFrontPhoto.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Lock className="size-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">Login Credentials</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                  <p className="font-semibold mb-1">📧 Login Credentials</p>
                  <p>The store owner will use the provided email address as username and the password set above to login to the system.</p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOnboardingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Onboard Store
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Store className="h-8 w-8 text-emerald-600" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(store.id, store.status)}
                    >
                      {store.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(store)}
                    >
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold">{store.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{store.id}</p>
              </div>
              <Badge variant="outline" className={store.status === 'Active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}>
                {store.status}
              </Badge>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-semibold">₹{(store.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orders</span>
                  <span className="font-semibold">{store.orders}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>Complete list of franchise locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.id}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      {store.domain}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">₹{store.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{store.orders}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={store.status === 'Active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}>
                      {store.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Sheet */}
      <Sheet open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto pl-8 pr-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="size-6 text-emerald-600" />
              Store Details
            </SheetTitle>
            <SheetDescription>
              Complete information about the selected store and owner.
            </SheetDescription>
          </SheetHeader>

          {selectedStore && (
            <div className="mt-8 space-y-8 pb-8">
              {/* Status and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={selectedStore.status === 'Active' 
                      ? 'border-green-500 bg-green-100 text-green-700 text-base px-4 py-1.5' 
                      : 'border-red-500 bg-red-100 text-red-700 text-base px-4 py-1.5'
                    }
                  >
                    {selectedStore.status === 'Active' ? (
                      <CheckCircle2 className="size-4 mr-1.5" />
                    ) : (
                      <XCircle className="size-4 mr-1.5" />
                    )}
                    {selectedStore.status}
                  </Badge>
                  <div>
                    <p className="text-sm text-muted-foreground">Onboarded on</p>
                    <p className="font-semibold text-base mt-0.5">
                      {new Date(selectedStore.onboardedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    handleToggleStatus(selectedStore.id, selectedStore.status);
                    setIsViewDetailsOpen(false);
                  }}
                  variant={selectedStore.status === 'Active' ? 'destructive' : 'default'}
                  className={selectedStore.status === 'Active' 
                    ? '' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  }
                >
                  {selectedStore.status === 'Active' ? (
                    <>
                      <PowerOff className="size-4 mr-2" />
                      Deactivate Store
                    </>
                  ) : (
                    <>
                      <Power className="size-4 mr-2" />
                      Activate Store
                    </>
                  )}
                </Button>
              </div>
              {/* Store Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-emerald-100">
                  <Building2 className="size-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">Store Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">Store Name</Label>
                    <p className="font-semibold text-base">{selectedStore.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">Store ID</Label>
                    <p className="font-semibold text-base">{selectedStore.id}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">State</Label>
                    <p className="font-semibold text-base">{selectedStore.state}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium">City</Label>
                    <p className="font-semibold text-base">{selectedStore.city}</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <MapPin className="size-4" />
                      Address
                    </Label>
                    <p className="font-semibold text-base">{selectedStore.address}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <Phone className="size-4" />
                      Phone Number
                    </Label>
                    <p className="font-semibold text-base">{selectedStore.phoneNumber}</p>
                  </div>

                  {selectedStore.alternativePhoneNumber && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Phone className="size-4" />
                        Alternative Phone
                      </Label>
                      <p className="font-semibold text-base">{selectedStore.alternativePhoneNumber}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <Mail className="size-4" />
                      Email Address
                    </Label>
                    <p className="font-semibold text-base">{selectedStore.emailAddress}</p>
                  </div>

                  {selectedStore.gstNumber && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <CreditCard className="size-4" />
                        GST Number
                      </Label>
                      <p className="font-semibold text-base">{selectedStore.gstNumber}</p>
                    </div>
                  )}

                  {selectedStore.fssaiNumber && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <CreditCard className="size-4" />
                        FSSAI Number
                      </Label>
                      <p className="font-semibold text-base">{selectedStore.fssaiNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Store Owner Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                  <User className="size-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Store Owner Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <User className="size-4" />
                      Owner Name
                    </Label>
                    <p className="font-semibold text-base">{selectedStore.ownerName}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <Phone className="size-4" />
                      Owner Contact
                    </Label>
                    <p className="font-semibold text-base">{selectedStore.ownerContact}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Documents */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-purple-100">
                  <FileText className="size-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">Uploaded Documents</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1">
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <CreditCard className="size-4" />
                      PAN Card Document
                    </Label>
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <FileText className="size-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            {typeof selectedStore.panDocument === 'string' 
                              ? selectedStore.panDocument 
                              : selectedStore.panDocument?.name || 'No document'}
                          </p>
                          <p className="text-xs text-blue-700">PDF Document • Uploaded on {new Date(selectedStore.onboardedDate).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          // In real app: open document in new tab/modal
                          toast.success('Opening PAN Card document...');
                          window.open('#', '_blank');
                        }}
                      >
                        <Eye className="size-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Performance Metrics */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-orange-100">
                  <TrendingUp className="size-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Performance Metrics</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-1">
                  <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-700">₹{selectedStore.revenue.toLocaleString()}</p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-700">{selectedStore.orders}</p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Avg. Order Value</p>
                    <p className="text-3xl font-bold text-purple-700">
                      ₹{Math.round(selectedStore.revenue / selectedStore.orders).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Alert Dialog for Status Toggle */}
      <AlertDialog open={alertDialogState.open} onOpenChange={setAlertDialogState}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertDialogState.action === 'activate' ? 'Activate Store' : 'Deactivate Store'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {alertDialogState.action === 'activate' ? 'activate' : 'deactivate'} this store?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleStatus}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {alertDialogState.action === 'activate' ? 'Activate' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}