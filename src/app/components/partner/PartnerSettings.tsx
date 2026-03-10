import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  Upload,
  X,
  Camera,
  Calendar as CalendarIcon,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export function PartnerSettings() {
  // Mock KYC status - in production this would come from API
  const [kycStatus, setKycStatus] = useState<{
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedDate?: string;
    rejectionMessage?: string;
  }>({
    status: 'Pending',
    submittedDate: '2026-03-08',
  });

  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@sthiroot.com',
    phone: '9876543210',
    age: '35',
    gender: 'Male',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '123 Main Street, Andheri West',
    panCard: 'ABCDE1234F',
    aadharCard: '123456789012',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh');
  
  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState<string>('');
  
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  const [aadharBackPreview, setAadharBackPreview] = useState<string>('');
  
  const [panCardPhoto, setPanCardPhoto] = useState<File | null>(null);
  const [panCardPhotoPreview, setPanCardPhotoPreview] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview('https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh');
  };

  const handleAadharFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharFront(file);
      setAadharFrontPreview(URL.createObjectURL(file));
    }
  };

  const removeAadharFront = () => {
    setAadharFront(null);
    setAadharFrontPreview('');
  };

  const handleAadharBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharBack(file);
      setAadharBackPreview(URL.createObjectURL(file));
    }
  };

  const removeAadharBack = () => {
    setAadharBack(null);
    setAadharBackPreview('');
  };

  const handlePanCardPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPanCardPhoto(file);
      setPanCardPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePanCardPhoto = () => {
    setPanCardPhoto(null);
    setPanCardPhotoPreview('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())) {
      toast.error('Invalid PAN Card format');
      return;
    }

    if (formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard)) {
      toast.error('Aadhar Card must be 12 digits');
      return;
    }

    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));

    toast.success('Password changed successfully!');
  };

  const handleResubmitKYC = () => {
    // In production, this would submit to API
    setKycStatus({
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
    });
    toast.success('KYC documents resubmitted for verification');
  };

  const getKycStatusIcon = () => {
    switch (kycStatus.status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getKycStatusColor = () => {
    switch (kycStatus.status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* KYC Status Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {getKycStatusIcon()}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">KYC Verification Status</h3>
                <Badge variant="outline" className={getKycStatusColor()}>
                  {kycStatus.status}
                </Badge>
              </div>
              {kycStatus.submittedDate && (
                <p className="text-sm text-muted-foreground mb-2">
                  Submitted on {new Date(kycStatus.submittedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
              
              {kycStatus.status === 'Pending' && (
                <p className="text-sm text-amber-700">
                  Your KYC documents are currently under review. You will be notified once the verification is complete.
                </p>
              )}
              
              {kycStatus.status === 'Approved' && (
                <p className="text-sm text-emerald-700">
                  Your KYC has been verified and approved. You have full access to all features.
                </p>
              )}
              
              {kycStatus.status === 'Rejected' && kycStatus.rejectionMessage && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-800">{kycStatus.rejectionMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {kycStatus.status === 'Rejected' && (
            <Button 
              onClick={handleResubmitKYC}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resubmit KYC
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Photo Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <Avatar className="size-24">
            {profilePhotoPreview && <AvatarImage src={profilePhotoPreview} />}
            <AvatarFallback className="text-2xl">{getInitials(formData.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="profile-photo">
                  <Button type="button" variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </label>
              </div>
              {profilePhoto && (
                <Button type="button" variant="outline" onClick={removeProfilePhoto}>
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or JPEG. Max size 2MB.
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  className="pl-10"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="City"
                  className="pl-10"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="state"
                  placeholder="State"
                  className="pl-10"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PAN Card */}
            <div className="space-y-2">
              <Label htmlFor="panCard">PAN Card *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="panCard"
                  placeholder="ABCDE1234F"
                  className="pl-10 uppercase"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Aadhar Card */}
            <div className="space-y-2">
              <Label htmlFor="aadharCard">Aadhar Card *</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="aadharCard"
                  type="tel"
                  placeholder="12-digit Aadhar number"
                  className="pl-10"
                  value={formData.aadharCard}
                  onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                  maxLength={12}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Document Photos Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Document Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aadhar Front Photo */}
              <div className="space-y-2">
                <Label>Aadhar Front Photo</Label>
                {aadharFrontPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={aadharFrontPreview} 
                      alt="Aadhar Front" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removeAadharFront}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="aadhar-front"
                      accept="image/*"
                      onChange={handleAadharFrontUpload}
                      className="hidden"
                    />
                    <label htmlFor="aadhar-front" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload Aadhar Front</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Aadhar Back Photo */}
              <div className="space-y-2">
                <Label>Aadhar Back Photo</Label>
                {aadharBackPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={aadharBackPreview} 
                      alt="Aadhar Back" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removeAadharBack}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="aadhar-back"
                      accept="image/*"
                      onChange={handleAadharBackUpload}
                      className="hidden"
                    />
                    <label htmlFor="aadhar-back" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload Aadhar Back</span>
                    </label>
                  </div>
                )}
              </div>

              {/* PAN Card Photo */}
              <div className="space-y-2">
                <Label>PAN Card Photo</Label>
                {panCardPhotoPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={panCardPhotoPreview} 
                      alt="PAN Card" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removePanCardPhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="pan-card-photo"
                      accept="image/*"
                      onChange={handlePanCardPhotoUpload}
                      className="hidden"
                    />
                    <label htmlFor="pan-card-photo" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload PAN Card</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Current password"
                  className="pl-10"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="pl-10"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}